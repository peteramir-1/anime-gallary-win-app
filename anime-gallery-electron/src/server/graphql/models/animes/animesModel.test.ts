import { expect, test } from '@jest/globals';
import { createDbConnection } from '../../helpers/database';
import { appDatabaseDirectoryPath } from '../../../config/db';
import path from 'path';
import fs from 'fs';
import BetterSqlite3 from 'better-sqlite3';
import { AnimesController } from './animesModel';

const testAnimeDatabaseFilename = 'anime.test.sqlite';
const testAnimeDatabaseDir = path.join(
  appDatabaseDirectoryPath,
  testAnimeDatabaseFilename
);

describe('Database Connection Functions', () => {
  test('create Database file and folder if not existed', async () => {
    await createDbConnection(
      appDatabaseDirectoryPath,
      testAnimeDatabaseFilename
    );
    expect(fs.existsSync(testAnimeDatabaseDir)).toBe(true);
  });
});

describe('Anime Database Controller', () => {
  let animeDatabaseConnection: BetterSqlite3.Database,
    animeController: AnimesController;

  beforeEach(async () => {
    animeDatabaseConnection = await createDbConnection(
      appDatabaseDirectoryPath,
      testAnimeDatabaseFilename
    );
    expect(fs.existsSync(testAnimeDatabaseDir)).toBe(true);
    animeController = new AnimesController(animeDatabaseConnection);
  });

  test('Get All Animes', () => {
    const animes = animeController.getAllAnimes();
    expect(animes).toBeTruthy();
  });

  test('Get Anime By Id', async () => {
    const anime = await animeController.createAnime({
      name: 'test',
      description: 'test',
      numOfEpisodes: 1,
      status: 'complete',
      type: 'movie',
      thumbnail: 'test',
      episodes: [
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
      ],
    });

    if (anime?.id) expect(animeController.getAnimeById(anime.id)).toBeTruthy();
    else throw new Error('Not Created');
  });

  test('Create Anime', async () => {
    const anime = await animeController.createAnime({
      name: 'test',
      description: 'test',
      numOfEpisodes: 1,
      status: 'complete',
      type: 'movie',
      thumbnail: 'test',
      episodes: [
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
      ],
    });
    if (anime?.id)
      expect(JSON.stringify(anime)).toEqual(
        JSON.stringify({
          id: anime.id,
          name: 'test',
          description: 'test',
          thumbnail: 'test',
          numOfEpisodes: 1,
          status: 'complete',
          type: 'movie',
          released: null,
          season: null,
          liked: false,
          createdAt: new Date().toLocaleDateString('en-CA'),
          updatedAt: null,
          episodes: [
            'video-link.mp4',
            'video-link.mp4',
            'video-link.mp4',
            'video-link.mp4',
          ],
        })
      );
    else throw new Error('Not Created');
  });

  test('Update Anime', async () => {
    const updatedAt = new Date().toLocaleDateString('en-CA');
    const anime = await animeController.createAnime({
      name: 'test',
      description: 'test',
      numOfEpisodes: 1,
      status: 'complete',
      type: 'movie',
      thumbnail: 'test',
      season: 'Summer',
      released: '2005',
      liked: false,
      episodes: [
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
      ],
    });
    if (anime?.id) {
      animeController.updateAnimeById({
        id: anime.id,
        name: 'test',
        description: 'test',
        numOfEpisodes: 1,
        status: 'incomplete',
        type: 'movie',
        season: 'winter',
        released: '2004',
        thumbnail: 'test',
        liked: true,
        episodes: [
          'video-link.mp4',
          'video-link.mp4',
          'video-link.mp4',
          'video-link.mp4',
        ],
      });
      const updatedAnime = animeController.getAnimeById(anime.id);
      expect(JSON.stringify(updatedAnime)).toEqual(
        JSON.stringify({
          id: anime.id,
          name: 'test',
          description: 'test',
          thumbnail: 'test',
          numOfEpisodes: 1,
          status: 'incomplete',
          type: 'movie',
          released: '2004',
          season: 'winter',
          liked: true,
          createdAt: anime.createdAt,
          updatedAt: updatedAt,
          episodes: [
            'video-link.mp4',
            'video-link.mp4',
            'video-link.mp4',
            'video-link.mp4',
          ],
        })
      );
    } else throw new Error('Not Created');
  });

  test('Delete Anime', async () => {
    const anime = await animeController.createAnime({
      name: 'test',
      description: 'test',
      numOfEpisodes: 1,
      status: 'complete',
      type: 'movie',
      thumbnail: 'test',
      released: 'season',
      season: 'summer',
      episodes: [
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
      ],
    });
    if (anime?.id) {
      expect(animeController.getAnimeById(anime.id)).toBeTruthy();

      const affectedRows = animeController.deleteAnimeById(anime.id);
      expect(affectedRows).toBe(1);
      expect(animeController.getAnimeById(anime.id)).toBeFalsy();
    } else throw new Error('Not Created');
  });

  // test.skip('get Select Episodes By Id', () => {
  //   const animes = animeController.getAllAnimes();
  //   const episodes = animeController.getAnimeEpisodesById(animes[0].id);
  //   expect(JSON.stringify(episodes)).toEqual(
  //     JSON.stringify([
  //       'video-link.mp4',
  //       'video-link.mp4',
  //       'video-link.mp4',
  //       'video-link.mp4',
  //     ])
  //   );
  // });
});
