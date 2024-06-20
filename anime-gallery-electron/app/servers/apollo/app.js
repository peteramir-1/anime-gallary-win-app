"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeApolloServer = exports.startApolloServer = void 0;
const express = require("express");
const http = require("http");
const cors = require("cors");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const resolvers_1 = require("./schema/resolvers");
const anime_types_1 = require("./schema/types/anime-types");
const settings_types_1 = require("./schema/types/settings-types");
const utils_1 = require("../apollo/common/utils");
const DBModel = require("./database/models/db.model");
const animes_controller_1 = require("./database/controllers/animes/animes-controller");
const settings_controller_1 = require("./database/controllers/settings/settings-controller");
const app = express();
const httpServer = http.createServer(app);
let animeDatabaseConnection;
let settingsDatabaseConnection;
let animesController;
let settingsController;
let server;
const startApolloServer = (callbackFn = () => { }) => __awaiter(void 0, void 0, void 0, function* () {
    animeDatabaseConnection = yield (0, utils_1.createDbConnection)(DBModel.appDatabaseDirectoryPath, DBModel.animeDatabaseFilename);
    settingsDatabaseConnection = yield (0, utils_1.createDbConnection)(DBModel.appDatabaseDirectoryPath, DBModel.settingsDatabaseFilename);
    animesController = new animes_controller_1.AnimesController(animeDatabaseConnection);
    settingsController = new settings_controller_1.SettingsController(settingsDatabaseConnection);
    const resolvers = (0, resolvers_1.getResolvers)(animesController, settingsController);
    server = new server_1.ApolloServer({
        typeDefs: [anime_types_1.animeTypeDefs, settings_types_1.settingsTypeDefs],
        resolvers,
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
    });
    yield server.start();
    app.use('', cors({ origin: ['http://localhost:8020'] }), express.json(), (0, express4_1.expressMiddleware)(server));
    yield new Promise(resolve => httpServer.listen({ port: DBModel.port }, resolve)).then(() => {
        console.log(`Apollo Server ready at ${DBModel.port}`);
        callbackFn();
    });
});
exports.startApolloServer = startApolloServer;
const closeApolloServer = () => {
    server.stop().then(() => {
        console.log(`server running at http://localhost:${DBModel.port}/ is closed`);
    });
};
exports.closeApolloServer = closeApolloServer;
if (((_a = process.env.mode) === null || _a === void 0 ? void 0 : _a.trim()) === 'development' &&
    ((_b = process.env.NODE_APP) === null || _b === void 0 ? void 0 : _b.trim()) === 'apollo')
    (0, exports.startApolloServer)();
//# sourceMappingURL=app.js.map