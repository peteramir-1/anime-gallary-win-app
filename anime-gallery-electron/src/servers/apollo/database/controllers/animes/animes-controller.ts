import { Database } from 'better-sqlite3';
import * as statusments from './animes-sql';
import { v4 } from 'uuid';
import {
  Anime,
  DBAnime,
  DBEpisodes,
  Episode,
  Nullable,
} from '../../interfaces/anime.interface';

export class AnimesController {
  constructor(private DatabaseConnection: Database) {
    this.prepareDB();
  }

  private prepareDB(): void {
    this.DatabaseConnection.prepare(
      statusments.CREATE_ANIME_TABLE_IF_NOT_EXISTED
    ).run();
    this.DatabaseConnection.prepare(
      statusments.CREATE_ANIME_EPISODES_TABLE_IF_NOT_EXISTED
    ).run();
    this.DatabaseConnection.pragma('journal_mode = WAL');
  }

  public getAllAnimes(): Nullable<Anime>[] {
    const animes: DBAnime[] | undefined | null =
      this.DatabaseConnection.prepare(statusments.GET_ANIMES).all() as
        | DBAnime[]
        | undefined
        | null;
    if (!!animes) {
      return animes.map(
        (anime: DBAnime): Anime => ({
          ...anime,
          liked: anime.liked === undefined ? false : !!anime.liked,
          episodes: this.getAnimeEpisodesById(anime.id),
        })
      );
    } else {
      return [];
    }
  }

  public getAnimeById(id: string): Anime | undefined {
    const anime: DBAnime | undefined | null = this.DatabaseConnection.prepare(
      statusments.GET_ANIME_BY_ID
    ).get({ id }) as DBAnime | undefined | null;
    if (anime) {
      const episodes = this.getAnimeEpisodesById(id);
      return {
        ...anime,
        liked: anime.liked === undefined ? false : !!anime.liked,
        episodes,
      };
    }
  }

  private getAnimeEpisodesById(id: string): string[] {
    return (
      this.DatabaseConnection.prepare(statusments.GET_ANIME_EPISODES_BY_ID).all(
        id
      ) as DBEpisodes[]
    ).map((episode: DBEpisodes) => episode.link);
  }

  public createAnime(anime: Omit<Anime, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = v4();
    const createdAt = new Date().toLocaleDateString('en-CA');
    const DBAnime: DBAnime = {
      id,
      name: anime.name,
      description: anime.description || '',
      numOfEpisodes:
        !anime.numOfEpisodes || anime.numOfEpisodes < 1
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
    this.DatabaseConnection.prepare(statusments.INSERT_ANIME_DETAILS).run(
      DBAnime
    );
    this.InsertAnimeEpisodes(id, anime.episodes);
    return this.getAnimeById(id);
  }

  public updateAnimeById(updatedAnime: Omit<Anime, 'createdAt' | 'updatedAt'>) {
    const prev: any = this.getAnimeById(updatedAnime.id);
    const updatedAt = new Date().toLocaleDateString('en-CA');
    const DBAnime: DBAnime = {
      name: updatedAnime.name || prev.name,
      description: updatedAnime.description || prev.description,
      numOfEpisodes: updatedAnime.numOfEpisodes || prev.numOfEpisodes,
      status: updatedAnime.status || prev.status,
      type: updatedAnime.type || prev.type,
      thumbnail: updatedAnime.thumbnail || prev.thumbnail,
      released: updatedAnime.released || prev.released,
      season: updatedAnime.season || prev.season,
      liked:
        updatedAnime.liked === undefined
          ? Number(prev.liked)
          : Number(updatedAnime.liked),
      updatedAt,
      id: updatedAnime.id,
    };
    this.DatabaseConnection.prepare(statusments.UPDATE_ANIME_BY_ID).run(
      DBAnime
    );
    this.DatabaseConnection.prepare(
      statusments.DELETE_ANIME_EPISODES_BY_ID
    ).run({ id: updatedAnime.id });
    this.InsertAnimeEpisodes(
      updatedAnime.id,
      updatedAnime.episodes || prev.episodes
    );
    return this.getAnimeById(updatedAnime.id);
  }

  private InsertAnimeEpisodes(id: string, episodes: Episode[] = []): void {
    if (!episodes) return;
    const InsertAnimeEpisodesTransaction = this.DatabaseConnection.transaction(
      (_episodes: Episode[]) => {
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
