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
exports.closeFrontendServer = exports.startFrontendServer = exports.PORT = void 0;
const express = require("express");
const path = require("path");
const systeminformation_1 = require("systeminformation");
const app_1 = require("../../servers/apollo/app");
const serving_files_1 = require("./routes/serving-files");
let server;
exports.PORT = 8020;
const app = express();
const startFrontendServer = (callback = () => { }) => __awaiter(void 0, void 0, void 0, function* () {
    app.use(express.static(path.join(__dirname, '..', '..', 'views')));
    const devices = yield (0, systeminformation_1.blockDevices)();
    devices
        .filter(device => !device.mount.startsWith('C'))
        .forEach(dir => {
        app.use(express.static(path.join(dir.mount)));
    });
    app.use('/serve', serving_files_1.default);
    app.use('/*', (req, res, next) => {
        const FrontEndPath = path.join(__dirname, '..', '..', 'assets', 'views', 'index.html');
        res.sendFile(FrontEndPath);
    });
    yield (0, app_1.startApolloServer)(() => {
        server = app.listen(exports.PORT);
        console.log(`Frontend Server ready at http://localhost:${exports.PORT}/`);
    });
    callback();
});
exports.startFrontendServer = startFrontendServer;
const closeFrontendServer = () => {
    server === null || server === void 0 ? void 0 : server.close();
};
exports.closeFrontendServer = closeFrontendServer;
if (((_a = process.env.mode) === null || _a === void 0 ? void 0 : _a.trim()) === 'development' &&
    ((_b = process.env.NODE_APP) === null || _b === void 0 ? void 0 : _b.trim()) === 'frontend')
    (0, exports.startFrontendServer)();
//# sourceMappingURL=app.js.map