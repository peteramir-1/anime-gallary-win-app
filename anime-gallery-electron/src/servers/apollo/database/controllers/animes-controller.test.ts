import { expect, jest, test } from '@jest/globals';
import { AnimesController, AnimesDatabasePath } from './animes-controller';
import { createDbConnection } from './utils';
import * as path from 'path';
import * as fs from 'fs';
import * as BetterSqlite3 from 'better-sqlite3';

const testAnimeDatabaseFilename = 'anime.test.sqlite';
const testAnimeDatabaseDir = path.join(
  AnimesDatabasePath,
  testAnimeDatabaseFilename
);

describe('Database Connection Functions', () => {
  test('create Database file and folder if not existed', async () => {
    await createDbConnection(AnimesDatabasePath, testAnimeDatabaseFilename);
    expect(fs.existsSync(testAnimeDatabaseDir)).toBe(true);
  });
});

describe('Anime Database Controller', () => {
  let animeDatabaseConnection: BetterSqlite3.Database,
    animeController: AnimesController;

  beforeEach(async () => {
    animeDatabaseConnection = await createDbConnection(
      AnimesDatabasePath,
      testAnimeDatabaseFilename
    );
    expect(fs.existsSync(testAnimeDatabaseDir)).toBe(true);
    animeController = new AnimesController(animeDatabaseConnection);
  });

  test('Get All Animes', () => {
    const animes = animeController.getAllAnimes();
    expect(animes).toBeTruthy();
  });

  test('Get Anime By Id', () => {
    const anime = animeController.createAnime({
      name: 'test',
      description: 'test',
      numOfEpisodes: 1,
      status: 'test',
      type: 'test',
      thumbnail: 'test',
      episodes: [
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
      ],
    });

    expect(animeController.getAnimeById(anime.id)).toBeTruthy();
  });

  test('Create Anime', () => {
    const anime = animeController.createAnime({
      name: 'test',
      description: 'test',
      numOfEpisodes: 1,
      status: 'test',
      type: 'test',
      thumbnail: 'test',
      episodes: [
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
      ],
    });
    expect(JSON.stringify(anime)).toEqual(
      JSON.stringify({
        id: anime.id,
        name: 'test',
        description: 'test',
        thumbnail: 'test',
        numOfEpisodes: 1,
        status: 'test',
        type: 'test',
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
  });

  test('Update Anime', () => {
    const updatedAt = new Date().toLocaleDateString('en-CA');
    const anime = animeController.createAnime({
      name: 'test',
      description: 'test',
      numOfEpisodes: 1,
      status: 'test',
      type: 'test',
      thumbnail: 'test',
      episodes: [
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
      ],
    });
    animeController.updateAnimeById({
      id: anime.id,
      name: 'test',
      description: 'test',
      numOfEpisodes: 1,
      status: 'changed',
      type: 'test',
      thumbnail: 'test',
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
        status: 'changed',
        type: 'test',
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
  });

  test('Delete Anime', () => {
    const anime = animeController.createAnime({
      name: 'test',
      description: 'test',
      numOfEpisodes: 1,
      status: 'test',
      type: 'test',
      thumbnail: 'test',
      episodes: [
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
        'video-link.mp4',
      ],
    });

    expect(animeController.getAnimeById(anime.id)).toBeTruthy();

    const affectedRows = animeController.deleteAnimeById(anime.id);
    expect(affectedRows).toBe(1);
    expect(animeController.getAnimeById(anime.id)).toBeFalsy();
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
