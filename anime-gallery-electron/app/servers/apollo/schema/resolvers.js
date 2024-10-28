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
const graphql_1 = require("graphql");
const getResolvers = (animesController, settingsController) => ({
    Query: {
        animes: () => __awaiter(void 0, void 0, void 0, function* () {
            const animes = yield animesController.getAllAnimes();
            if (animes)
                return animes;
            else
                throw new graphql_1.GraphQLError('App DB Error. Unrecognized Error while fetching Animes!', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                    },
                });
        }),
        anime: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const anime = yield animesController.getAnimeById(id);
            if (anime)
                return anime;
            else
                throw new graphql_1.GraphQLError('App DB Error. Unrecognized Error while fetching Anime!', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                    },
                });
        }),
        settings: () => __awaiter(void 0, void 0, void 0, function* () {
            const appSettings = yield settingsController.getAllSettings();
            if (appSettings)
                return appSettings;
            else
                throw new graphql_1.GraphQLError('App Settings Error. Unrecognized Error while fetching settings!', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                    },
                });
        }),
        animesFromFolder: (_, { mainFolderPath }) => __awaiter(void 0, void 0, void 0, function* () {
            const folders = (0, anime_viewer_1.readFolders)(mainFolderPath);
            return (0, anime_viewer_1.getAnimes)(folders);
        }),
    },
    Mutation: {
        createAnime: (_, { animeInput }) => __awaiter(void 0, void 0, void 0, function* () {
            const createdAnime = yield animesController.createAnime(animeInput);
            if (createdAnime)
                return createdAnime;
            else
                throw new graphql_1.GraphQLError('App DB Error. Unrecognized Error while creating Anime!', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                    },
                });
        }),
        updateAnime: (_, { animeInput }) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedAnime = yield animesController.updateAnimeById(animeInput);
            if (updatedAnime)
                return updatedAnime;
            else
                throw new graphql_1.GraphQLError('App DB Error. Unrecognized Error while updating Anime!', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                    },
                });
        }),
        deleteAnime: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const affectedRows = yield animesController.deleteAnimeById(id);
            if (affectedRows)
                return { affectedRows };
            else
                throw new graphql_1.GraphQLError('App DB Error. Unrecognized Error while Deleting Anime!', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                    },
                });
        }),
        updateSettings: (_, { settingsInput, }) => __awaiter(void 0, void 0, void 0, function* () {
            const settings = yield settingsController.updateSettings(settingsInput);
            if (settings)
                return settings;
            else
                throw new graphql_1.GraphQLError('App Settings Error. Unrecognized Error while updating settings!', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                    },
                });
        }),
    },
});
exports.getResolvers = getResolvers;
//# sourceMappingURL=resolvers.js.map