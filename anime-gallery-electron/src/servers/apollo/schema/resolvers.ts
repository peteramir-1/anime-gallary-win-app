import {
  AnimesController,
  AnimesDatabasePath,
  AnimeDatabaseFilename,
} from '../database/controllers/animes-controller';
import { createDbConnection } from '../database/controllers/utils';
import { Database } from 'better-sqlite3';
import { CreateAnimeInput, UpdateAnimeInput } from './resolvers.interface';

let animeDatabaseConnection: Database;
let animesController: AnimesController;

(async () => {
  animeDatabaseConnection = await createDbConnection(
    AnimesDatabasePath,
    AnimeDatabaseFilename
  );

  animesController = new AnimesController(animeDatabaseConnection);
})();

export const resolvers = {
  Query: {
    animes: async () => animesController.getAllAnimes(),
    anime: async (_: any, { id }: { id: string }) =>
      animesController.getAnimeById(id),
  },
  Mutation: {
    createAnime: async (
      _: any,
      { animeInput }: { animeInput: CreateAnimeInput }
    ) =>
      animesController.createAnime({
        name: animeInput.name,
        description: animeInput.description,
        numOfEpisodes: animeInput.numOfEpisodes,
        thumbnail: animeInput.thumbnail,
        status: animeInput.status,
        type: animeInput.type,
        episodes: animeInput.episodes,
      }),
    updateAnime: async (
      _: any,
      { animeInput }: { animeInput: UpdateAnimeInput }
    ) => {
      return animesController.updateAnimeById({
        id: animeInput.id,
        name: animeInput.name,
        description: animeInput.description,
        numOfEpisodes: animeInput.numOfEpisodes,
        thumbnail: animeInput.thumbnail,
        status: animeInput.status,
        type: animeInput.type,
        episodes: animeInput.episodes,
      });
    },
    deleteAnime: async (_: any, { id }: { id: string }) => ({
      affectedRows: animesController.deleteAnimeById(id),
    }),
  },
};
