"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimesController = exports.AnimeDatabaseFilename = exports.AnimesDatabasePath = void 0;
const statusments = require("./animes-sql");
const uuid_1 = require("uuid");
const path = require("path");
exports.AnimesDatabasePath = path.join(__dirname, '..', 'databases');
exports.AnimeDatabaseFilename = 'anime.sqlite';
class AnimesController {
    constructor(DatabaseConnection) {
        this.DatabaseConnection = DatabaseConnection;
        this.prepareDB();
    }
    prepareDB() {
        this.DatabaseConnection.prepare(statusments.CREATE_ANIME_TABLE_IF_NOT_EXISTED).run();
        this.DatabaseConnection.prepare(statusments.CREATE_ANIME_EPISODES_TABLE_IF_NOT_EXISTED).run();
        this.DatabaseConnection.pragma('journal_mode = WAL');
    }
    getAllAnimes() {
        const animes = this.DatabaseConnection.prepare(statusments.GET_ANIMES).all();
        if (!!animes) {
            return animes.map((anime) => {
                const episodes = this.getAnimeEpisodesById(anime.id);
                return Object.assign(Object.assign({}, anime), { episodes: [...episodes] });
            });
        }
        else {
            return [];
        }
    }
    getAnimeById(id) {
        const anime = this.DatabaseConnection.prepare(statusments.GET_ANIME_BY_ID).get({ id });
        const episodes = this.getAnimeEpisodesById(id);
        if (!anime)
            return undefined;
        return Object.assign(Object.assign({}, anime), { episodes });
    }
    getAnimeEpisodesById(id) {
        return this.DatabaseConnection.prepare(statusments.GET_ANIME_EPISODES_BY_ID).all({
            id,
        }).map((episode) => {
            return episode.link;
        });
    }
    createAnime(animeInput) {
        const createdAt = new Date().toLocaleDateString('en-CA');
        const id = (0, uuid_1.v4)();
        this.DatabaseConnection.prepare(statusments.INSERT_ANIME_DETAILS).run({
            id,
            name: animeInput.name,
            description: animeInput.description || '',
            numOfEpisodes: !animeInput.numOfEpisodes || animeInput.numOfEpisodes < 1
                ? 1
                : animeInput.numOfEpisodes,
            status: animeInput.status || 'complete',
            type: animeInput.type || 'serie',
            thumbnail: animeInput.thumbnail || null,
            createdAt: createdAt,
        });
        this.InsertAnimeEpisodes(id, animeInput.episodes);
        return this.getAnimeById(id);
    }
    updateAnimeById(animeInput) {
        const prev = this.getAnimeById(animeInput.id);
        const updatedAt = new Date().toLocaleDateString('en-CA');
        this.DatabaseConnection.prepare(statusments.UPDATE_ANIME_BY_ID).run({
            name: animeInput.name || prev.name,
            description: animeInput.description || prev.description,
            numOfEpisodes: animeInput.numOfEpisodes || prev.numOfEpisodes,
            status: animeInput.status || prev.status,
            type: animeInput.type || prev.type,
            thumbnail: animeInput.thumbnail || prev.thumbnail,
            updatedAt,
            id: animeInput.id,
        });
        this.DatabaseConnection.prepare(statusments.DELETE_ANIME_EPISODES_BY_ID).run({ id: animeInput.id });
        this.InsertAnimeEpisodes(animeInput.id, animeInput.episodes || prev.episodes);
        return this.getAnimeById(animeInput.id);
    }
    InsertAnimeEpisodes(id, episodes = []) {
        if (episodes == null)
            return;
        const InsertAnimeEpisodesTransaction = this.DatabaseConnection.transaction((_episodes) => {
            for (const link of _episodes) {
                this.DatabaseConnection.prepare(statusments.INSERT_ANIME_EPISODES).run({
                    anime_id: id,
                    link,
                });
            }
        });
        InsertAnimeEpisodesTransaction(episodes);
    }
    deleteAnimeById(id) {
        return this.DatabaseConnection.prepare(statusments.DELETE_ANIME_BY_ID).run({
            id,
        }).changes;
    }
}
exports.AnimesController = AnimesController;
//# sourceMappingURL=animes-controller.js.map