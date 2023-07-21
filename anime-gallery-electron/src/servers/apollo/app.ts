import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/types';
import { resolvers } from './schema/resolvers';

export const PORT = 8021;

const server = new ApolloServer({ typeDefs, resolvers });

export const startApolloServer = async (callbackFn: () => void = () => {}) => {
  // `startStandaloneServer` returns a `Promise` with the
  // the URL that the server is listening on.
  // Modified server startup
  const { url } = await startStandaloneServer(server, {
    listen: { port: 8021 },
  });
  console.log(`Apollo Server ready at ${url}`);
  callbackFn();
};

export const closeApolloServer = () => {
  server.stop().then(() => {
    console.log('server running at http://localhost:4000/ is closed');
  });
};

// For Development mode start
// Please Comment below line on production.
// @ts-ignore
// eslint-disable-next-line prettier/prettier, max-len
if (process.env.mode?.trim() === 'development' && process.env.NODE_APP?.trim() === 'apollo') startApolloServer();
