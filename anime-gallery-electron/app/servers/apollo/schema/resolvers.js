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
exports.getResolvers = void 0;
const anime_viewer_1 = require("../special-features/anime-viewer/anime-viewer");
const getResolvers = (animesController, settingsController) => ({
    Query: {
        animes: () => __awaiter(void 0, void 0, void 0, function* () { return animesController.getAllAnimes(); }),
        anime: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () { return animesController.getAnimeById(id); }),
        settings: () => __awaiter(void 0, void 0, void 0, function* () { return settingsController.getAllSettings(); }),
        animesFromFolder: (_, { mainFolderPath }) => __awaiter(void 0, void 0, void 0, function* () {
            const folders = (0, anime_viewer_1.readFolders)(mainFolderPath);
            return (0, anime_viewer_1.getAnimes)(folders);
        }),
    },
    Mutation: {
        createAnime: (_, { animeInput }) => __awaiter(void 0, void 0, void 0, function* () { return animesController.createAnime(animeInput); }),
        updateAnime: (_, { animeInput }) => __awaiter(void 0, void 0, void 0, function* () { return animesController.updateAnimeById(animeInput); }),
        deleteAnime: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                affectedRows: animesController.deleteAnimeById(id),
            });
        }),
        updateSettings: (_, { settingsInput, }) => __awaiter(void 0, void 0, void 0, function* () { return settingsController.updateSettings(settingsInput); }),
    },
});
exports.getResolvers = getResolvers;
//# sourceMappingURL=resolvers.js.map