"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.settingsDatabaseFilename = exports.animeDatabaseFilename = exports.appDatabaseDirectoryPath = void 0;
const path = require("path");
exports.appDatabaseDirectoryPath = path.join(__dirname, '..', 'databases');
exports.animeDatabaseFilename = 'anime.sqlite';
exports.settingsDatabaseFilename = 'settings.sqlite';
exports.port = 8021;
//# sourceMappingURL=db.model.js.map