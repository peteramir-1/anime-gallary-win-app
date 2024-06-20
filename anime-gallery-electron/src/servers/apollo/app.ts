import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { Database } from 'better-sqlite3';

import { getResolvers } from './schema/resolvers';
import { animeTypeDefs } from './schema/types/anime-types';
import { settingsTypeDefs } from './schema/types/settings-types';

import { createDbConnection } from '../apollo/common/utils';
import * as DBModel from './database/models/db.model';
import { AnimesController } from './database/controllers/animes/animes-controller';
import { SettingsController } from './database/controllers/settings/settings-controller';

const app = express();
const httpServer = http.createServer(app);

let animeDatabaseConnection: Database;
let settingsDatabaseConnection: Database;
let animesController: AnimesController;
let settingsController: SettingsController;

let server: any;

export const startApolloServer = async (callbackFn: () => void = () => {}) => {
  animeDatabaseConnection = await createDbConnection(
    DBModel.appDatabaseDirectoryPath,
    DBModel.animeDatabaseFilename
  );

  settingsDatabaseConnection = await createDbConnection(
    DBModel.appDatabaseDirectoryPath,
    DBModel.settingsDatabaseFilename
  );

  animesController = new AnimesController(animeDatabaseConnection);
  settingsController = new SettingsController(settingsDatabaseConnection);

  const resolvers = getResolvers(animesController, settingsController);
  server = new ApolloServer({
    typeDefs: [animeTypeDefs, settingsTypeDefs],
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '',
    cors<cors.CorsRequest>({ origin: ['http://localhost:8020'] }),
    express.json(),
    expressMiddleware(server)
  );

  await new Promise<void>(resolve =>
    httpServer.listen({ port: DBModel.port }, resolve)
  ).then(() => {
    console.log(`Apollo Server ready at ${DBModel.port}`);
    callbackFn();
  });
};

export const closeApolloServer = () => {
  server.stop().then(() => {
    console.log(
      `server running at http://localhost:${DBModel.port}/ is closed`
    );
  });
};

// For Development mode start
// Please Comment below line on production.
// @ts-ignore
// eslint-disable-next-line prettier/prettier, max-len
if (
  process.env.mode?.trim() === 'development' &&
  process.env.NODE_APP?.trim() === 'apollo'
)
  startApolloServer();
