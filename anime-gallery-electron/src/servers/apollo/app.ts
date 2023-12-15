import { ApolloServer } from '@apollo/server';
import { typeDefs } from './schema/types';
import { resolvers } from './schema/resolvers';
import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';

export const PORT = 8021;

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

export const startApolloServer = async (callbackFn: () => void = () => {}) => {
  await server.start();
  
  app.use(
    '',
    cors<cors.CorsRequest>({ origin: ['http://localhost:8020'] }),
    express.json(),
    expressMiddleware(server)
  );

  await new Promise<void>(resolve =>
    httpServer.listen({ port: PORT }, resolve)
  ).then(() => {
    console.log(`Apollo Server ready at ${PORT}`);
    callbackFn();
  });
};

export const closeApolloServer = () => {
  server.stop().then(() => {
    console.log(`server running at http://localhost:${PORT}/ is closed`);
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
