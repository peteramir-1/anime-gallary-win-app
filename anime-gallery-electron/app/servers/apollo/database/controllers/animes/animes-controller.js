"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimesController = void 0;
const statusments = require("./animes-sql");
const uuid_1 = require("uuid");
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
        return new Promise((resolve, reject) => {
            try {
                const animesWithoutEpisodes = this.DatabaseConnection.prepare(statusments.GET_ANIMES).all();
                this.getAnimeEpisodes()
                    .then(_episodes => {
                    const episodesRecords = this.groupByProperty(_episodes, 'anime_id', 'link');
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
                })
                    .catch(error => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getAnimeEpisodes() {
        return new Promise((resolve, reject) => {
            try {
                const animeEpisodes = this.DatabaseConnection.prepare(statusments.GET_ANIME_EPISODES).all();
                resolve(animeEpisodes);
            }
            catch (error) {
                reject(error);
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
        return new Promise((resolve, reject) => {
            try {
                const anime = this.DatabaseConnection.prepare(statusments.GET_ANIME_BY_ID).get({ id });
                if (anime) {
                    this.getAnimeEpisodesById(id).then((episodes) => {
                        const targetedAnime = Object.assign(Object.assign({}, anime), { liked: anime.liked === undefined ? false : !!anime.liked, episodes });
                        resolve(targetedAnime);
                    }, error => {
                        reject(error);
                    });
                }
                else {
                    reject('Invalid anime id');
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getAnimeEpisodesById(id) {
        return new Promise((resolve, reject) => {
            try {
                const animeEpisodes = this.DatabaseConnection.prepare(statusments.GET_ANIME_EPISODES_BY_ANIME_ID).all(id);
                resolve(animeEpisodes.map((episode) => episode.link));
            }
            catch (error) {
                reject(error);
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
                this.InsertAnimeEpisodes(id, anime.episodes).then(() => {
                    resolve(this.getAnimeById(id));
                }, error => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    updateAnimeById(updatedAnime) {
        return new Promise((resolve, reject) => {
            try {
                const prev = this.getAnimeById(updatedAnime.id);
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
                this.DatabaseConnection.prepare(statusments.DELETE_ANIME_EPISODES_BY_ID).run({ id: updatedAnime.id });
                this.InsertAnimeEpisodes(updatedAnime.id, updatedAnime.episodes || prev.episodes).then(() => {
                    this.getAnimeById(updatedAnime.id).then(anime => resolve(anime));
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    InsertAnimeEpisodes(id, episodes = []) {
        return new Promise((resolve, reject) => {
            if (!episodes)
                reject('invalid episodes');
            try {
                this.insertAnimeEpisodesTransaction(id, episodes);
                resolve(1);
            }
            catch (error) {
                reject(error);
            }
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
                reject(error);
            }
        });
    }
}
exports.AnimesController = AnimesController;
//# sourceMappingURL=animes-controller.js.map