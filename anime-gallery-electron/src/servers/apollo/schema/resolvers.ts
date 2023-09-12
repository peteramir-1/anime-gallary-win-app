import {
  AnimesController,
  AnimesDatabasePath,
  AnimeDatabaseFilename,
} from '../database/controllers/animes-controller';
import { createDbConnection } from '../database/controllers/utils';
import { Database } from 'better-sqlite3';
import { Anime } from '../database/interfaces/anime.interface';

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
      { animeInput }: { animeInput: Omit<Anime, 'id'> }
    ) => animesController.createAnime(animeInput),
    updateAnime: async (_: any, { animeInput }: { animeInput: Anime }) =>
      animesController.updateAnimeById(animeInput),
    deleteAnime: async (_: any, { id }: { id: string }) => ({
      affectedRows: animesController.deleteAnimeById(id),
    }),
  },
};
