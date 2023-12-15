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
exports.closeApolloServer = exports.startApolloServer = exports.PORT = void 0;
const server_1 = require("@apollo/server");
const types_1 = require("./schema/types");
const resolvers_1 = require("./schema/resolvers");
const express = require("express");
const http = require("http");
const cors = require("cors");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express4_1 = require("@apollo/server/express4");
exports.PORT = 8021;
const app = express();
const httpServer = http.createServer(app);
const server = new server_1.ApolloServer({
    typeDefs: types_1.typeDefs,
    resolvers: resolvers_1.resolvers,
    plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
});
const startApolloServer = (callbackFn = () => { }) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.start();
    app.use('', cors({ origin: ['http://localhost:8020'] }), express.json(), (0, express4_1.expressMiddleware)(server));
    yield new Promise(resolve => httpServer.listen({ port: exports.PORT }, resolve)).then(() => {
        console.log(`Apollo Server ready at ${exports.PORT}`);
        callbackFn();
    });
});
exports.startApolloServer = startApolloServer;
const closeApolloServer = () => {
    server.stop().then(() => {
        console.log(`server running at http://localhost:${exports.PORT}/ is closed`);
    });
};
exports.closeApolloServer = closeApolloServer;
if (((_a = process.env.mode) === null || _a === void 0 ? void 0 : _a.trim()) === 'development' &&
    ((_b = process.env.NODE_APP) === null || _b === void 0 ? void 0 : _b.trim()) === 'apollo')
    (0, exports.startApolloServer)();
//# sourceMappingURL=app.js.map