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
exports.selectFilesFromFolder = exports.selectFile = exports.selectFolder = void 0;
const electron = require("electron");
const fs = require("fs");
const path = require("path");
const selectFolder = (events, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { canceled, filePaths } = yield electron.dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
    const dirPath = filePaths[0];
    return !canceled && dirPath;
});
exports.selectFolder = selectFolder;
const selectFile = (events, extensions) => __awaiter(void 0, void 0, void 0, function* () {
    const { canceled, filePaths } = yield electron.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {
                name: 'set of Dynamic extensions',
                extensions: extensions,
            },
        ],
    });
    return !canceled && filePaths[0];
});
exports.selectFile = selectFile;
const selectFilesFromFolder = (events, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { canceled, filePaths } = yield electron.dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
    const dirPath = filePaths[0];
    if (!!canceled) {
        return false;
    }
    else {
        const dirents = yield fs.promises.readdir(dirPath, {
            withFileTypes: true,
        });
        return {
            folderPath: dirPath,
            data: dirents.map(dirent => path.join(dirPath, dirent.name)),
        };
    }
});
exports.selectFilesFromFolder = selectFilesFromFolder;
//# sourceMappingURL=handlers.js.map