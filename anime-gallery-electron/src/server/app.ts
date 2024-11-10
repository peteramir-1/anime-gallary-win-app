import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import * as path from 'path';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';

import * as DBModel from './database/models/db.model';
import { createDbConnection } from './database/helpers/database';

import { getResolvers } from './schema/resolvers';
import { animeTypeDefs } from './schema/types/anime-types';
import { settingsTypeDefs } from './schema/types/settings-types';

import { AnimesController } from './database/controllers/animes/animes-controller';
import { SettingsController } from './database/controllers/settings/settings-controller';

import { blockDevices } from 'systeminformation';

import servingFilesRoutes from './routes/serving-files';

import * as env from './environment';

export class ApplicationServer {
  private readonly app = express();
  private readonly httpServer = http.createServer(this.app);

  private apolloServer?: ApolloServer;

  async start(): Promise<void> {
    const animeDatabaseConnection = await createDbConnection(
      DBModel.appDatabaseDirectoryPath,
      DBModel.animeDatabaseFilename
    );

    const settingsDatabaseConnection = await createDbConnection(
      DBModel.appDatabaseDirectoryPath,
      DBModel.settingsDatabaseFilename
    );

    const animesController = new AnimesController(animeDatabaseConnection);
    const settingsController = new SettingsController(
      settingsDatabaseConnection
    );

    const resolvers = getResolvers(animesController, settingsController);
    const typeDefs = [animeTypeDefs, settingsTypeDefs];

    this.apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
      ],
    });

    await this.apolloServer.start();

    this.app.use(
      '/graphql',
      cors<cors.CorsRequest>({ origin: [`http://localhost:${env.severPort}`] }),
      express.json(),
      expressMiddleware(this.apolloServer)
    );

    this.app.use(express.static(path.join(__dirname, '..', 'views')));

    const devices = await blockDevices();

    devices
      .filter(device => !device.mount.startsWith('C'))
      .forEach(dir => {
        this.app.use(express.static(path.join(dir.mount)));
      });

    this.app.use('/serve', servingFilesRoutes);

    this.app.use('/*', (req, res, next) => {
      const FrontEndPath = path.join(
        __dirname,
        '..',
        '..',
        'views',
        'index.html'
      );
      res.sendFile(FrontEndPath);
    });

    return new Promise<void>(resolve => {
      this.httpServer.listen({ port: env.severPort }, resolve);
    }).then(() => {
      console.log(`🚀 Server ready at http://localhost:${env.severPort}/`);
    });
  }

  async stop(): Promise<void> {
    if (this.httpServer && this.apolloServer) {
      await this.apolloServer.stop();
      this.httpServer.close(() => {
        console.log('Apollo Server and Express server have been stopped');
      });
    }
  }
}
