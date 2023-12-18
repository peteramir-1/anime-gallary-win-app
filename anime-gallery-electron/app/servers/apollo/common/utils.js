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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDbConnection = void 0;
const fs = require("fs");
const BetterSqlite3 = require("better-sqlite3");
const path = require("path");
const DatabaseConfigs = {
    nativeBinding: (() => {
        var _a, _b;
        return path.join('node_modules', 'better-sqlite3', 'build', 'Release', 'better_sqlite3.node');
        const commonPath = [
            'node_modules',
            'better-sqlite3',
            'build',
            'Release',
            'better_sqlite3.node',
        ];
        if (!!((_a = require.main) === null || _a === void 0 ? void 0 : _a.path)) {
            return path.join(...[((_b = require.main) === null || _b === void 0 ? void 0 : _b.path) || '', '..', ...commonPath]);
        }
        else {
            return path.join(...[__dirname, '..', '..', '..', '..', '..', ...commonPath]);
        }
    })(),
    readonly: false,
    fileMustExist: false,
};
const createDbConnection = (dbDir, dbFilename) => __awaiter(void 0, void 0, void 0, function* () {
    fs.existsSync(path.join(dbDir, dbFilename)) ||
        (yield fs.promises.mkdir(dbDir, { recursive: true }));
    return new BetterSqlite3(path.join(dbDir, dbFilename), DatabaseConfigs);
});
exports.createDbConnection = createDbConnection;
//# sourceMappingURL=utils.js.map