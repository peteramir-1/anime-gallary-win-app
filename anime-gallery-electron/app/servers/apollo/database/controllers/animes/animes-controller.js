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
exports.AnimesController = void 0;
const statusments = require("./animes-sql");
const uuid_1 = require("uuid");
const graphql_1 = require("graphql");
class AnimesController {
    constructor(DatabaseConnection) {
        this.DatabaseConnection = DatabaseConnection;
        this.insertAnimeEpisodesTransaction = this.DatabaseConnection.transaction((id, episodes) => {
            for (const link of episodes) {
                this.DatabaseConnection.prepare(statusments.INSERT_ANIME_EPISODES).run({
                    anime_id: id,
                    link,
                });
            }
        });
        this.prepareDB();
    }
    prepareDB() {
        this.DatabaseConnection.prepare(statusments.CREATE_ANIME_TABLE_IF_NOT_EXISTED).run();
        this.DatabaseConnection.prepare(statusments.CREATE_ANIME_EPISODES_TABLE_IF_NOT_EXISTED).run();
        this.DatabaseConnection.pragma('journal_mode = WAL');
    }
    getAllAnimes() {
        return __awaiter(this, void 0, void 0, function* () {
            const episodes = yield this.getAnimeEpisodes();
            return new Promise((resolve, reject) => {
                try {
                    const animesWithoutEpisodes = this.DatabaseConnection.prepare(statusments.GET_ANIMES).all();
                    const episodesRecords = this.groupByProperty(episodes, 'anime_id', 'link');
                    const result = animesWithoutEpisodes.map(anime => {
                        const episodes = episodesRecords.find(record => record.id === anime.id);
                        if (episodes) {
                            return Object.assign(Object.assign({}, anime), { liked: anime.liked === undefined ? false : !!anime.liked, episodes: episodes.values });
                        }
                        else {
                            return Object.assign(Object.assign({}, anime), { liked: anime.liked === undefined ? false : !!anime.liked, episodes: [] });
                        }
                    });
                    resolve(result);
                }
                catch (error) {
                    reject(new graphql_1.GraphQLError('Error In Fetching Animes', {
                        extensions: {
                            code: 'INTERNAL_SERVER_ERROR',
                            origin: error,
                        },
                    }));
                }
            });
        });
    }
    getAnimeEpisodes() {
        return new Promise((resolve, reject) => {
            try {
                const animeEpisodes = this.DatabaseConnection.prepare(statusments.GET_ANIME_EPISODES).all();
                resolve(animeEpisodes);
            }
            catch (error) {
                reject(new graphql_1.GraphQLError('Error In Fetching All Animes Episodes Records', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        origin: error,
                    },
                }));
            }
        });
    }
    groupByProperty(array, key, innerPropertySelector) {
        const grouped = array.reduce((acc, obj) => {
            const keyValue = obj[key];
            if (!acc[keyValue]) {
                acc[keyValue] = [];
            }
            acc[keyValue].push(obj);
            return acc;
        }, {});
        return Object.values(grouped).map(group => {
            if (!group[0])
                return { id: '', values: [] };
            return {
                id: group[0][key],
                values: group.map(group => group[innerPropertySelector]),
            };
        });
    }
    getAnimeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const episodes = yield this.getAnimeEpisodesById(id);
            return new Promise((resolve, reject) => {
                try {
                    const anime = this.DatabaseConnection.prepare(statusments.GET_ANIME_BY_ID).get({ id });
                    const targetedAnime = Object.assign(Object.assign({}, anime), { liked: anime.liked === undefined ? false : !!anime.liked, episodes });
                    resolve(targetedAnime);
                }
                catch (error) {
                    reject(new graphql_1.GraphQLError('Error In Fetching Anime By Id', {
                        extensions: {
                            code: 'INTERNAL_SERVER_ERROR',
                            origin: error,
                        },
                    }));
                }
            });
        });
    }
    getAnimeEpisodesById(id) {
        return new Promise((resolve, reject) => {
            try {
                const animeEpisodes = this.DatabaseConnection.prepare(statusments.GET_ANIME_EPISODES_BY_ANIME_ID).all(id);
                resolve(animeEpisodes.map((episode) => episode.link));
            }
            catch (error) {
                reject(new graphql_1.GraphQLError('Error In Fetching Anime Episodes By Id', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        origin: error,
                    },
                }));
            }
        });
    }
    createAnime(anime) {
        return new Promise((resolve, reject) => {
            try {
                const id = (0, uuid_1.v4)();
                const createdAt = new Date().toLocaleDateString('en-CA');
                const DBAnime = {
                    id,
                    name: anime.name,
                    description: anime.description || '',
                    numOfEpisodes: !anime.numOfEpisodes || anime.numOfEpisodes < 1
                        ? 1
                        : anime.numOfEpisodes,
                    status: anime.status || 'complete',
                    type: anime.type || 'serie',
                    season: anime.season || null,
                    released: anime.released || null,
                    thumbnail: anime.thumbnail || null,
                    liked: anime.liked === undefined ? 0 : Number(anime.liked),
                    createdAt: createdAt,
                };
                this.DatabaseConnection.prepare(statusments.INSERT_ANIME_DETAILS).run(DBAnime);
                if (anime.episodes) {
                    this.insertAnimeEpisodesTransaction(id, anime.episodes);
                }
                this.getAnimeById(id)
                    .then(anime => {
                    resolve(anime);
                })
                    .catch(error => {
                    reject(new graphql_1.GraphQLError('Error In Fetching Anime After Updating', {
                        extensions: {
                            code: 'INTERNAL_SERVER_ERROR',
                            origin: error,
                        },
                    }));
                });
            }
            catch (error) {
                reject(new graphql_1.GraphQLError('Error In Adding new Anime', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        origin: error,
                    },
                }));
            }
        });
    }
    updateAnimeById(updatedAnime) {
        return __awaiter(this, void 0, void 0, function* () {
            const prev = yield this.getAnimeById(updatedAnime.id);
            return new Promise((resolve, reject) => {
                try {
                    const updatedAt = new Date().toLocaleDateString('en-CA');
                    const DBAnime = {
                        name: updatedAnime.name || prev.name,
                        description: updatedAnime.description || prev.description,
                        numOfEpisodes: updatedAnime.numOfEpisodes || prev.numOfEpisodes,
                        status: updatedAnime.status || prev.status,
                        type: updatedAnime.type || prev.type,
                        thumbnail: updatedAnime.thumbnail || prev.thumbnail,
                        released: updatedAnime.released || prev.released,
                        season: updatedAnime.season || prev.season,
                        liked: updatedAnime.liked === undefined
                            ? Number(prev.liked)
                            : Number(updatedAnime.liked),
                        updatedAt,
                        id: updatedAnime.id,
                    };
                    this.DatabaseConnection.prepare(statusments.UPDATE_ANIME_BY_ID).run(DBAnime);
                    if (updatedAnime.episodes) {
                        this.DatabaseConnection.prepare(statusments.DELETE_ANIME_EPISODES_BY_ID).run({ id: updatedAnime.id });
                        if (updatedAnime.type === 'movie') {
                            this.insertAnimeEpisodesTransaction(updatedAnime.id, [
                                updatedAnime.episodes[0],
                            ]);
                        }
                        else {
                            this.insertAnimeEpisodesTransaction(updatedAnime.id, updatedAnime.episodes);
                        }
                    }
                    this.getAnimeById(updatedAnime.id)
                        .then(anime => {
                        resolve(anime);
                    })
                        .catch(error => {
                        reject(new graphql_1.GraphQLError('Error In Fetching Anime After Updating', {
                            extensions: {
                                code: 'INTERNAL_SERVER_ERROR',
                                origin: error,
                            },
                        }));
                    });
                }
                catch (error) {
                    reject(new graphql_1.GraphQLError('Error In updating Anime', {
                        extensions: {
                            code: 'INTERNAL_SERVER_ERROR',
                            origin: error,
                        },
                    }));
                }
            });
        });
    }
    deleteAnimeById(id) {
        return new Promise((resolve, reject) => {
            try {
                const deletionOperation = this.DatabaseConnection.prepare(statusments.DELETE_ANIME_BY_ID).run({
                    id,
                });
                resolve(deletionOperation.changes);
            }
            catch (error) {
                reject(new graphql_1.GraphQLError('Error In Anime Deletion', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        origin: error,
                    },
                }));
            }
        });
    }
}
exports.AnimesController = AnimesController;
//# sourceMappingURL=animes-controller.js.map