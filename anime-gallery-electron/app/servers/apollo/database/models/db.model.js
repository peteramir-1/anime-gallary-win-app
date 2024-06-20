"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.settingsDatabaseFilename = exports.animeDatabaseFilename = exports.appDatabaseDirectoryPath = void 0;
const path = require("path");
const utils_1 = require("../../common/utils");
exports.appDatabaseDirectoryPath = path.join((0, utils_1.getAppDataPath)(), 'anime-gallery-app', 'sqlite-files');
exports.animeDatabaseFilename = 'anime.sqlite';
exports.settingsDatabaseFilename = 'settings.sqlite';
exports.port = 8021;
//# sourceMappingURL=db.model.js.map