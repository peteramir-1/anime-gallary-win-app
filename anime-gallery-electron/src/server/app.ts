import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import * as path from 'path';

import * as _ from 'lodash';

import { APPLICATION_SERVER, TContext } from './app.interfaces';

import { ApolloServer, ContextFunction } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';

import {
  animesDatabaseFilename,
  appDatabaseDirectoryPath,
  settingsDatabaseFilename,
} from './config/db';
import { createDbConnection } from './graphql/helpers/database';

import { blockDevices } from 'systeminformation';

import servingFilesRoutes from './routes/serving-files';

import * as env from './config/env';
import Database from 'better-sqlite3';

import { animesTypeDefs } from './graphql/schema/animes/animes.typeDefs';
import { settingsTypeDefs } from './graphql/schema/settings/settings.typeDefs';
import { AnimesDbModel } from './graphql/models/animes/animesModel';
import { SettingsDbModel } from './graphql/models/settings/settingsModel';
import { animeViewerTypeDefs } from './graphql/schema/anime-viewer/anime-viewer.typeDefs';
import { animeResolver } from './graphql/schema/animes/animes.resolver';
import { settingsResolver } from './graphql/schema/settings/settings.resolver';
import { animeViewerResolver } from './graphql/schema/anime-viewer/anime-viewer.resolver';

interface StandaloneServerContextFunctionArgument {
  req: http.IncomingMessage;
  res: http.ServerResponse;
}

type DatabaseConnections = { [databaseName: string]: Database.Database };

export class ApplicationServer implements APPLICATION_SERVER {
  private readonly app: express.Express = express();
  private readonly httpServer: http.Server = http.createServer(this.app);
  private apolloServer?: ApolloServer<TContext>;
  private databasesConnections: DatabaseConnections = {};

  async start(): Promise<http.Server> {
    await this.createDatabaseConnections();
    await this.createApolloServer();
    await this.apolloServer?.start();
    await this.registerAllRequiredFiles();
    this.addRoutes();

    return this.httpServer.listen({ port: env.severPort }, () => {
      console.log(`🚀 Server ready at http://localhost:${env.severPort}`);
    });
  }

  private async createDatabaseConnections(): Promise<DatabaseConnections> {
    this.databasesConnections.animes = await createDbConnection(
      appDatabaseDirectoryPath,
      animesDatabaseFilename
    );

    this.databasesConnections.settings = await createDbConnection(
      appDatabaseDirectoryPath,
      settingsDatabaseFilename
    );

    return {
      animesDbConnection: this.databasesConnections.animes,
      settingsDbConnection: this.databasesConnections.settings,
    };
  }

  private async createApolloServer(): Promise<void> {
    const typeDefs = [animesTypeDefs, settingsTypeDefs, animeViewerTypeDefs];
    const resolvers = _.merge({}, animeResolver, settingsResolver, animeViewerResolver);

    this.apolloServer = new ApolloServer<TContext>({
      typeDefs,
      resolvers,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
      ],
    });
  }

  private async registerAllRequiredFiles(): Promise<void> {
    this.registerSPAFiles();
    await this.registerDevicePartitionsFiles();
  }
  private registerSPAFiles(): void {
    this.app.use(express.static(path.join(__dirname, '..', 'views')));
  }
  private async registerDevicePartitionsFiles(): Promise<void> {
    const devices = await blockDevices();

    devices
      // For Security purposes Access to C directory is prohibited
      .filter(device => !device.mount.startsWith('C'))
      .forEach(dir => {
        this.app.use(express.static(path.join(dir.mount)));
      });
  }

  private addRoutes(): void {
    this.addGraphqlRoute();
    this.registerServePicturesRoutes();
    this.registerSPARoutes();
  }
  private addGraphqlRoute(): void {
    const context: ContextFunction<
      [StandaloneServerContextFunctionArgument],
      TContext
    > = async () => ({
      animesDbModel: new AnimesDbModel(this.databasesConnections.animes!),
      settingsDbModel: new SettingsDbModel(this.databasesConnections.settings!),
    });

    this.app.use(
      '/graphql',
      cors<cors.CorsRequest>({ origin: [`http://localhost:${env.severPort}`] }),
      express.json(),
      expressMiddleware(this.apolloServer!, { context })
    );
  }
  private registerServePicturesRoutes(): void {
    this.app.use('/serve', servingFilesRoutes);
  }
  private registerSPARoutes(): void {
    this.app.use('*', (req, res, next) => {
      const FrontEndPath = path.join(
        __dirname,
        '..',
        '..',
        'views',
        'index.html'
      );
      res.sendFile(FrontEndPath);
    });
  }

  async close(): Promise<void> {
    if (this.httpServer && this.apolloServer) {
      await this.apolloServer.stop();
      this.databasesConnections.animes?.close();
      this.databasesConnections.settings?.close();
      this.httpServer.close(() => {
        console.log('Apollo Server and Express server have been stopped');
      });
    }
  }
}
