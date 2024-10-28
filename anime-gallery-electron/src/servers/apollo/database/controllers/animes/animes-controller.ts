import { Database } from 'better-sqlite3';
import * as statusments from './animes-sql';
import { v4 } from 'uuid';
import {
  Anime,
  DBAnime,
  DBEpisode,
  Episode,
  Nullable,
} from '../../interfaces/anime.interface';
import { GraphQLError } from 'graphql';

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

  public getAllAnimes(): Promise<Nullable<Anime>[]> {
    return new Promise<Nullable<Anime>[]>((resolve, reject) => {
      try {
        const animesWithoutEpisodes: DBAnime[] =
          this.DatabaseConnection.prepare(
            statusments.GET_ANIMES
          ).all() as DBAnime[];
        this.getAnimeEpisodes()
          .then(_episodes => {
            const episodesRecords = this.groupByProperty(
              _episodes,
              'anime_id',
              'link'
            );
            const result = animesWithoutEpisodes.map(anime => {
              const episodes = episodesRecords.find(
                record => record.id === anime.id
              );
              if (episodes) {
                return {
                  ...anime,
                  liked: anime.liked === undefined ? false : !!anime.liked,
                  episodes: episodes.values,
                };
              } else {
                return {
                  ...anime,
                  liked: anime.liked === undefined ? false : !!anime.liked,
                  episodes: [],
                };
              }
            });
            resolve(result);
          })
          .catch(error => {
            reject(
              new GraphQLError('Error In Fetching Animes Episodes', {
                extensions: {
                  code: 'INTERNAL_SERVER_ERROR',
                  origin: error,
                },
              })
            );
          });
      } catch (error) {
        reject(
          new GraphQLError('Error In Fetching Animes', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
            },
          })
        );
      }
    });
  }
  private getAnimeEpisodes(): Promise<DBEpisode[]> {
    return new Promise<DBEpisode[]>((resolve, reject) => {
      try {
        const animeEpisodes = this.DatabaseConnection.prepare(
          statusments.GET_ANIME_EPISODES
        ).all() as DBEpisode[];
        resolve(animeEpisodes);
      } catch (error) {
        reject(
          new GraphQLError('Error In Fetching All Animes Episodes Records', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
            },
          })
        );
      }
    });
  }
  private groupByProperty<T>(
    array: T[],
    key: keyof T,
    innerPropertySelector: keyof T
  ): { id: NonNullable<T>[keyof T] | string; values: T[keyof T][] }[] {
    const grouped = array.reduce((acc, obj) => {
      const keyValue = obj[key] as unknown as string;
      if (!acc[keyValue]) {
        acc[keyValue] = [];
      }
      acc[keyValue].push(obj);
      return acc;
    }, {} as Record<string, T[]>);
    return Object.values(grouped).map(group => {
      if (!group[0]) return { id: '', values: [] };
      return {
        id: group[0][key],
        values: group.map(group => group[innerPropertySelector]),
      };
    });
  }

  public getAnimeById(id: string): Promise<Anime> {
    return new Promise<Anime>((resolve, reject) => {
      try {
        const anime: DBAnime = this.DatabaseConnection.prepare(
          statusments.GET_ANIME_BY_ID
        ).get({ id }) as DBAnime;
        this.getAnimeEpisodesById(id).then(
          (episodes: string[]) => {
            const targetedAnime = {
              ...anime,
              liked: anime.liked === undefined ? false : !!anime.liked,
              episodes,
            };
            resolve(targetedAnime);
          },
          error => {
            reject(
              new GraphQLError('Error In Fetching Anime Episodes By Id', {
                extensions: {
                  code: 'INTERNAL_SERVER_ERROR',
                  origin: error,
                },
              })
            );
          }
        );
      } catch (error) {
        reject(
          new GraphQLError('Error In Fetching Anime By Id', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
            },
          })
        );
      }
    });
  }
  private getAnimeEpisodesById(id: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      try {
        const animeEpisodes = this.DatabaseConnection.prepare(
          statusments.GET_ANIME_EPISODES_BY_ANIME_ID
        ).all(id) as DBEpisode[];
        resolve(animeEpisodes.map((episode: DBEpisode) => episode.link));
      } catch (error) {
        reject(
          new GraphQLError('Error In Fetching Anime Episodes By Id', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
            },
          })
        );
      }
    });
  }

  public createAnime(
    anime: Omit<Anime, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Anime> {
    return new Promise((resolve, reject) => {
      try {
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
        this.InsertAnimeEpisodes(id, anime.episodes).then(
          () => {
            resolve(this.getAnimeById(id));
          },
          error => {
            reject(
              new GraphQLError('Error In Adding Anime Episodes', {
                extensions: {
                  code: 'INTERNAL_SERVER_ERROR',
                  origin: error,
                },
              })
            );
          }
        );
      } catch (error) {
        reject(
          new GraphQLError('Error In Adding new Anime', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
            },
          })
        );
      }
    });
  }

  public updateAnimeById(
    updatedAnime: Omit<Anime, 'createdAt' | 'updatedAt'>
  ): Promise<Anime> {
    return new Promise<Anime>((resolve, reject) => {
      try {
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
        ).then(
          () => {
            this.getAnimeById(updatedAnime.id).then(
              anime => resolve(anime),
              error => {
                reject(
                  new GraphQLError('Error In Fetching Anime', {
                    extensions: {
                      code: 'INTERNAL_SERVER_ERROR',
                      origin: error,
                    },
                  })
                );
              }
            );
          },
          error => {
            reject(
              new GraphQLError('Error In updating Anime Episodes', {
                extensions: {
                  code: 'INTERNAL_SERVER_ERROR',
                  origin: error,
                },
              })
            );
          }
        );
      } catch (error) {
        reject(
          new GraphQLError('Error In updating Anime', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
            },
          })
        );
      }
    });
  }

  private InsertAnimeEpisodes(
    id: string,
    episodes: Episode[] = []
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (!episodes) reject('invalid episodes');
      try {
        this.insertAnimeEpisodesTransaction(id, episodes);
        resolve(1);
      } catch (error) {
        reject(
          new GraphQLError('Error In inserting Anime Episodes', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
            },
          })
        );
      }
    });
  }
  private insertAnimeEpisodesTransaction = this.DatabaseConnection.transaction(
    (id: string, episodes: Episode[]) => {
      for (const link of episodes) {
        this.DatabaseConnection.prepare(statusments.INSERT_ANIME_EPISODES).run({
          anime_id: id,
          link,
        });
      }
    }
  );

  public deleteAnimeById(id: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      try {
        const deletionOperation = this.DatabaseConnection.prepare(
          statusments.DELETE_ANIME_BY_ID
        ).run({
          id,
        });
        resolve(deletionOperation.changes);
      } catch (error) {
        reject(
          new GraphQLError('Error In Anime Deletion', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
            },
          })
        );
      }
    });
  }
}
