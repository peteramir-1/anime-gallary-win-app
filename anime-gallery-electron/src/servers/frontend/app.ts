import * as express from 'express';
import * as path from 'path';
import { blockDevices } from 'systeminformation';
import { startApolloServer, closeApolloServer } from '../../servers/apollo/app';

// Variables and constants
let server: any;
export const PORT = 8020;
const app = express();
// # Variables and constants

// Main Function
export const startFrontendServer = async (callback: () => void = () => {}) => {
  await app.use(express.static(path.join(__dirname, '..', '..', 'views')));

  const devices = await blockDevices();

  devices
    .filter((device) => !device.mount.startsWith('C'))
    .forEach((dir) => {
      app.use(express.static(path.join(dir.mount)));
    });

  await app.use('/*', (req, res, next) => {
    const FrontEndPath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'views',
      'index.html'
    );
    res.sendFile(FrontEndPath);
  });

  await startApolloServer(() => {
    server = app.listen(PORT);
    console.log(`Frontend Server ready at http://localhost:${PORT}/`);
  });

  callback();
};

export const closeFrontendServer = () => {
  server?.close();
};
// # Main Functions

// For Development mode start
// Please Comment below line on production.
// @ts-ignore
// eslint-disable-next-line prettier/prettier, max-len
if (process.env.mode?.trim() === 'development' && process.env.NODE_APP?.trim() === 'frontend') startFrontendServer();
