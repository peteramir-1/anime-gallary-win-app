import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';

import _ from 'lodash';

import { APPLICATION_SERVER, TContext } from './app.interfaces';

import { ApolloServer, ContextFunction } from '@apollo/server';
import {
  ExpressContextFunctionArgument,
  expressMiddleware,
} from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import {
  animesDatabaseFilename,
  appDatabaseDirectoryPath,
  settingsDatabaseFilename,
} from './config/db';
import { createDbConnection } from './graphql/helpers/database';

import servingFilesRoutes from './routes/serving-files';

import Database from 'better-sqlite3';
import * as env from './config/env';

import { AnimesDbModel } from './graphql/models/animes/animesModel';
import { SettingsDbModel } from './graphql/models/settings/settingsModel';
import { animeViewerResolver } from './graphql/schema/anime-viewer/anime-viewer.resolver';
import { animeViewerTypeDefs } from './graphql/schema/anime-viewer/anime-viewer.typeDefs';
import { animeResolver } from './graphql/schema/animes/animes.resolver';
import { animesTypeDefs } from './graphql/schema/animes/animes.typeDefs';
import { settingsResolver } from './graphql/schema/settings/settings.resolver';
import { settingsTypeDefs } from './graphql/schema/settings/settings.typeDefs';
import { initSafeRoots } from './helpers/path-vallidation';

type DatabaseConnections = { [databaseName: string]: Database.Database };

export class ApplicationServer implements APPLICATION_SERVER {
  private readonly app: express.Express = express();
  private readonly httpServer: http.Server = http.createServer(this.app);
  private apolloServer?: ApolloServer<TContext>;
  private databasesConnections: DatabaseConnections = {};

  /**
   * Starts the server by creating database connections, creating the Apollo server
   * and registering all required files, then starts the server and adds routes.
   * @returns A promise that resolves with the http server.
   */
  async start(): Promise<http.Server> {
    await this.createDatabaseConnections();
    await this.createApolloServer();
    await this.apolloServer?.start();
    await initSafeRoots();
    this.registerSPAFiles();
    this.addRoutes();

    return this.httpServer.listen({ port: env.serverPort }, () => {
      console.log(`🚀 Server ready at http://localhost:${env.serverPort}`);
    });
  }

  /**
   * Establishes connections to the necessary databases for the application.
   *
   * @private
   * @async
   * @returns {Promise<DatabaseConnections>} A promise that resolves to an object containing
   * connections to the 'animes' and 'settings' databases.
   */
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

  /**
   * Creates an Apollo Server instance and configures it to work with the
   * Express.js server and the SQLite databases. It also sets up the
   * schema by merging all type definitions and resolvers.
   *
   * @private
   * @async
   * @returns {Promise<void>} A promise that resolves when the Apollo server
   * is created and configured.
   */
  private async createApolloServer(): Promise<void> {
    const typeDefs = [animesTypeDefs, settingsTypeDefs, animeViewerTypeDefs];
    const resolvers = _.merge(
      {},
      animeResolver,
      settingsResolver,
      animeViewerResolver
    );

    this.apolloServer = new ApolloServer<TContext>({
      typeDefs,
      resolvers,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
      ],
    });
  }

  /**
   * Registers a route that serves static files from the `views` directory
   * so that the Angular SPA can be served.
   *
   * @private
   * @returns {void}
   */
  private registerSPAFiles(): void {
    this.app.use(
      express.static(path.join(__dirname, '..', 'views', 'browser'))
    );
  }

  /**
   * Adds various routes to the application, including GraphQL, static file serving,
   * and Angular Single Page Application (SPA) routes.
   *
   * @private
   * @returns {void}
   */
  private addRoutes(): void {
    this.addGraphqlRoute();
    this.registerServePicturesRoutes();
    this.registerSPARoutes();
  }

  /**
   * Adds a route that serves the GraphQL API. The route is configured to use CORS
   * to allow requests from the Angular SPA running on localhost. The route also
   * sets up the Apollo Server context to provide the `animesDbModel` and
   * `settingsDbModel` instances to the resolvers.
   * @private
   * @returns {void}
   */
  private addGraphqlRoute(): void {
    /**
     * Provides the context for the Apollo Server by creating instances of
     * `AnimesDbModel` and `SettingsDbModel` using the database connections.
     * This context is used by the GraphQL resolvers to interact with the
     * respective databases.
     *
     * @param {StandaloneServerContextFunctionArgument} contextArguments - The arguments containing
     * the HTTP request and response objects.
     * @returns {Promise<TContext>} A promise resolving to an object containing
     * `animesDbModel` and `settingsDbModel` instances.
     */
    const context: ContextFunction<
      [ExpressContextFunctionArgument],
      TContext
    > = async () => ({
      animesDbModel: new AnimesDbModel(this.databasesConnections.animes!),
      settingsDbModel: new SettingsDbModel(this.databasesConnections.settings!),
    });

    this.app.use(
      '/graphql',
      cors<cors.CorsRequest>({
        origin: [`http://localhost:${env.serverPort}`],
      }),
      express.json(),
      expressMiddleware(this.apolloServer!, { context })
    );
  }

  /**
   * Registers routes for serving picture and video files.
   * This function uses the `servingFilesRoutes` router to handle
   * requests to the `/serve` endpoint.
   *
   * @private
   * @returns {void}
   */
  private registerServePicturesRoutes(): void {
    this.app.use('/serve', servingFilesRoutes);
  }

  /**
   * Registers a catch-all route to serve the Angular Single Page Application (SPA).
   * This route sends the `index.html` file located in the `views` directory for
   * any incoming request, allowing the SPA to handle client-side routing.
   *
   * @private
   * @returns {void}
   */
  private registerSPARoutes(): void {
    this.app.use((_, res) => {
      const FrontEndPath = path.join(
        __dirname,
        '..',
        'views',
        'browser',
        'index.html'
      );
      res.sendFile(FrontEndPath);
    });
  }

  /**
   * Closes the Apollo Server and Express server.
   * This function stops the Apollo Server and the Express server and closes
   * the SQLite database connections.
   *
   * @public
   * @returns {Promise<void>} A promise that resolves when the servers have been stopped.
   */
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

const mode = process.env.mode;

if (mode === 'server') {
  new ApplicationServer().start();
}
