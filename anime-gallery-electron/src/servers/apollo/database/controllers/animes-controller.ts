import { Database } from 'better-sqlite3';
import * as statusments from './animes-sql';
import { v4 } from 'uuid';
import * as path from 'path';

export const AnimesDatabasePath = path.join(__dirname, '..', 'databases');
export const AnimeDatabaseFilename = 'anime.sqlite';

export class AnimesController {
  constructor(private DatabaseConnection: Database) {
    this.prepareDB();
  }

  private prepareDB() {
    this.DatabaseConnection.prepare(
      statusments.CREATE_ANIME_TABLE_IF_NOT_EXISTED
    ).run();
    this.DatabaseConnection.prepare(
      statusments.CREATE_ANIME_EPISODES_TABLE_IF_NOT_EXISTED
    ).run();
    this.DatabaseConnection.pragma('journal_mode = WAL');
  }

  public getAllAnimes() {
    const animes = this.DatabaseConnection.prepare(
      statusments.GET_ANIMES
    ).all();
    if (!!animes) {
      return animes.map((anime: any): any => {
        const episodes = this.getAnimeEpisodesById(anime.id);
        return {
          ...anime,
          episodes: [...episodes],
        };
      });
    } else {
      return [];
    }
  }

  public getAnimeById(id: string) {
    const anime: any = this.DatabaseConnection.prepare(
      statusments.GET_ANIME_BY_ID
    ).get({ id });
    const episodes = this.getAnimeEpisodesById(id);
    if (!anime) return undefined;
    return {
      ...anime,
      episodes,
    };
  }

  private getAnimeEpisodesById(id: string) {
    return (
      this.DatabaseConnection.prepare(statusments.GET_ANIME_EPISODES_BY_ID).all(
        {
          id,
        }
      ) as { link: string }[]
    ).map((episode: { link: string }): string => {
      return episode.link;
    });
  }

  public createAnime(animeInput: {
    name: string;
    description?: string;
    numOfEpisodes?: number;
    thumbnail?: string;
    status?: string;
    type?: string;
    episodes?: string[];
  }) {
    const createdAt = new Date().toLocaleDateString('en-CA');
    const id = v4();
    this.DatabaseConnection.prepare(statusments.INSERT_ANIME_DETAILS).run({
      id,
      name: animeInput.name,
      description: animeInput.description || '',
      numOfEpisodes:
        !animeInput.numOfEpisodes || animeInput.numOfEpisodes < 1
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

  public updateAnimeById(animeInput: {
    id: string;
    name?: string;
    description?: string;
    numOfEpisodes?: number;
    thumbnail?: string;
    status?: string;
    type?: string;
    episodes?: string[];
  }) {
    const prev: any = this.getAnimeById(animeInput.id);
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
    this.DatabaseConnection.prepare(
      statusments.DELETE_ANIME_EPISODES_BY_ID
    ).run({ id: animeInput.id });
    this.InsertAnimeEpisodes(
      animeInput.id,
      animeInput.episodes || prev.episodes
    );
    return this.getAnimeById(animeInput.id);
  }

  private InsertAnimeEpisodes(id: string, episodes: string[] | null = []) {
    if (episodes == null) return;
    const InsertAnimeEpisodesTransaction = this.DatabaseConnection.transaction(
      (_episodes: any[]) => {
        for (const link of _episodes) {
          this.DatabaseConnection.prepare(
            statusments.INSERT_ANIME_EPISODES
          ).run({
            anime_id: id,
            link,
          });
        }
      }
    );
    InsertAnimeEpisodesTransaction(episodes);
  }

  public deleteAnimeById(id: string): number {
    return this.DatabaseConnection.prepare(statusments.DELETE_ANIME_BY_ID).run({
      id,
    }).changes;
  }
}
