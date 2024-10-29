"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnimesFromFolderUrl = void 0;
const fs = require("fs");
const getAnimesFromFolderUrl = (req, res, next) => {
    const animeFolderUrl = req.body.url;
    if (!animeFolderUrl || animeFolderUrl === '')
        res.send([]);
    fs.readdir(animeFolderUrl, { withFileTypes: true }, (err, animesFolderDirnet) => {
        if (!!err) {
            res.send(undefined);
        }
        else {
            if (animesFolderDirnet.length === 0) {
                res.send([]);
            }
            else {
                for (const animeFolderDirnet of animesFolderDirnet) {
                    if (!animeFolderDirnet.isDirectory())
                        continue;
                    const animes = fetchAnimesFromFolder(animeFolderDirnet.name, animeFolderDirnet.path);
                    res.send(animes);
                }
            }
        }
    });
};
exports.getAnimesFromFolderUrl = getAnimesFromFolderUrl;
const pictureExtensions = [
    'jpg',
    'jpeg',
    'gif',
    'tiff',
    'psd',
    'pdf',
    'eps',
    'ai',
    'indd',
    'raw',
];
const fetchAnimesFromFolder = (name, path) => {
    let animes = [];
    const animeFolderDirnets = fs.readdirSync(path, {
        withFileTypes: true,
    });
    let type = 'movies';
    let episodesCount = 0;
    let hasPicture = false;
    let picture = '';
    animeFolderDirnets.forEach((dirnet) => {
        if (dirnet.isDirectory()) {
            const fetchedAnimes = fetchAnimesFromFolder(dirnet.name, dirnet.path);
            animes = [...animes, ...fetchedAnimes];
        }
        else {
            const isDirnetPicture = pictureExtensions.includes(dirnet.path.split('.')[1].toLowerCase().trim());
            if (isDirnetPicture) {
                hasPicture = true;
                picture = dirnet.path;
            }
            else {
                episodesCount++;
                if (episodesCount > 2)
                    type = 'serie';
            }
            if (episodesCount !== 0) {
                animes.push({
                    name,
                    type,
                    picture,
                });
            }
        }
    });
    return animes;
};
//# sourceMappingURL=app-viewer.controller.js.map