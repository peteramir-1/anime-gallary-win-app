"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnimes = exports.readFolders = void 0;
const fs = require("fs");
const path = require("path");
const uuid_1 = require("uuid");
const pictureExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'tiff',
    'psd',
    'pdf',
    'eps',
    'ai',
    'indd',
    'raw',
];
const videoExtensions = [
    'flv',
    'mwv',
    'mp4',
    'avi',
    'mpeg',
    'webm',
    '3gp',
    'ogv',
    'm3u8',
    'ts',
    'mov',
];
const readFolders = (pathUrl) => {
    const dirents = fs.readdirSync(pathUrl, {
        withFileTypes: true,
    });
    return dirents.filter(dirent => dirent.isDirectory());
};
exports.readFolders = readFolders;
const getAnimes = (foldersList) => {
    const animes = [];
    foldersList.forEach(folder => {
        const deepDirent = fs.readdirSync(path.join(folder.path, folder.name), {
            withFileTypes: true,
        });
        const id = (0, uuid_1.v4)();
        let anime = {
            id,
            name: folder.name,
            type: 'movie',
            thumbnail: undefined,
            episodes: [],
        };
        deepDirent.forEach(dirent => {
            const isDirectory = dirent.isDirectory();
            const isVideo = videoExtensions.includes(getExtension(dirent.name));
            const isPicture = pictureExtensions.includes(getExtension(dirent.name));
            if (!isDirectory && isPicture) {
                anime.thumbnail = path.join(dirent.path, dirent.name);
            }
            else if (!isDirectory && isVideo) {
                anime.episodes.push(path.join(dirent.path, dirent.name));
            }
            else if (isDirectory) {
                const folders = (0, exports.readFolders)(dirent.path);
                const deepAnimes = (0, exports.getAnimes)(folders);
                deepAnimes.forEach(deepAnime => {
                    const isDuplicate = animes.some(anime => anime.name === deepAnime.name);
                    if (!isDuplicate)
                        animes.push(deepAnime);
                });
            }
        });
        if (anime.episodes.length > 1)
            anime.type = 'movie';
        if (anime.episodes.length === 1)
            anime.type = 'serie';
        if (anime.episodes.length !== 0)
            animes.push(anime);
    });
    return animes.map(anime => anime);
};
exports.getAnimes = getAnimes;
const getExtension = (filename) => {
    const namePieces = filename.split('.');
    return namePieces[namePieces.length - 1].toLowerCase().trim();
};
//# sourceMappingURL=anime-viewer.js.map