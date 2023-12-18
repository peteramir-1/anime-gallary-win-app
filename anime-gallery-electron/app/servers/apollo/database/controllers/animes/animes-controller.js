"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimesController = void 0;
const statusments = require("./animes-sql");
const uuid_1 = require("uuid");
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
            return animes.map((anime) => (Object.assign(Object.assign({}, anime), { liked: anime.liked === undefined ? false : !!anime.liked, episodes: this.getAnimeEpisodesById(anime.id) })));
        }
        else {
            return [];
        }
    }
    getAnimeById(id) {
        const anime = this.DatabaseConnection.prepare(statusments.GET_ANIME_BY_ID).get({ id });
        if (anime) {
            const episodes = this.getAnimeEpisodesById(id);
            return Object.assign(Object.assign({}, anime), { liked: anime.liked === undefined ? false : !!anime.liked, episodes });
        }
    }
    getAnimeEpisodesById(id) {
        return this.DatabaseConnection.prepare(statusments.GET_ANIME_EPISODES_BY_ID).all(id).map((episode) => episode.link);
    }
    createAnime(anime) {
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
        this.InsertAnimeEpisodes(id, anime.episodes);
        return this.getAnimeById(id);
    }
    updateAnimeById(updatedAnime) {
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
        this.InsertAnimeEpisodes(updatedAnime.id, updatedAnime.episodes || prev.episodes);
        return this.getAnimeById(updatedAnime.id);
    }
    InsertAnimeEpisodes(id, episodes = []) {
        if (!episodes)
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