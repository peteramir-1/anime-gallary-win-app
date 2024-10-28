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
            try {
                const animes = yield animesController.getAllAnimes();
                return animes;
            }
            catch (error) {
                throw new graphql_1.GraphQLError('App DB Error. Unrecognized Error while fetching Animes!', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        origin: error,
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        }),
        anime: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const anime = yield animesController.getAnimeById(id);
                return anime;
            }
            catch (error) {
                throw new graphql_1.GraphQLError('App DB Error. Unrecognized Error while fetching Anime!', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        origin: error,
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        }),
        settings: () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const appSettings = yield settingsController.getAllSettings();
                return appSettings;
            }
            catch (error) {
                throw new graphql_1.GraphQLError('App Settings Error. Unrecognized Error while fetching settings!', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        origin: error,
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        }),
        animesFromFolder: (_, { mainFolderPath }) => __awaiter(void 0, void 0, void 0, function* () {
            const folders = (0, anime_viewer_1.readFolders)(mainFolderPath);
            return (0, anime_viewer_1.getAnimes)(folders);
        }),
    },
    Mutation: {
        createAnime: (_, { animeInput }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const createdAnime = yield animesController.createAnime(animeInput);
                return createdAnime;
            }
            catch (error) {
                throw new graphql_1.GraphQLError('App DB Error. Unrecognized Error while creating Anime!', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        origin: error,
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        }),
        updateAnime: (_, { animeInput }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const updatedAnime = yield animesController.updateAnimeById(animeInput);
                return updatedAnime;
            }
            catch (error) {
                throw new graphql_1.GraphQLError('App DB Error. Unrecognized Error while updating Anime!', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        origin: error,
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        }),
        deleteAnime: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const affectedRows = yield animesController.deleteAnimeById(id);
                return { affectedRows };
            }
            catch (error) {
                throw new graphql_1.GraphQLError('App DB Error. Unrecognized Error while Deleting Anime!', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        origin: error,
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        }),
        updateSettings: (_, { settingsInput, }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const settings = yield settingsController.updateSettings(settingsInput);
                return settings;
            }
            catch (error) {
                throw new graphql_1.GraphQLError('App Error While updating Settings', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        origin: error,
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        }),
    },
});
exports.getResolvers = getResolvers;
//# sourceMappingURL=resolvers.js.map