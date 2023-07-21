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
const standalone_1 = require("@apollo/server/standalone");
const types_1 = require("./schema/types");
const resolvers_1 = require("./schema/resolvers");
exports.PORT = 8021;
const server = new server_1.ApolloServer({ typeDefs: types_1.typeDefs, resolvers: resolvers_1.resolvers });
const startApolloServer = (callbackFn = () => { }) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = yield (0, standalone_1.startStandaloneServer)(server, {
        listen: { port: 8021 },
    });
    console.log(`Apollo Server ready at ${url}`);
    callbackFn();
});
exports.startApolloServer = startApolloServer;
const closeApolloServer = () => {
    server.stop().then(() => {
        console.log('server running at http://localhost:4000/ is closed');
    });
};
exports.closeApolloServer = closeApolloServer;
if (((_a = process.env.mode) === null || _a === void 0 ? void 0 : _a.trim()) === 'development' && ((_b = process.env.NODE_APP) === null || _b === void 0 ? void 0 : _b.trim()) === 'apollo')
    (0, exports.startApolloServer)();
//# sourceMappingURL=app.js.map