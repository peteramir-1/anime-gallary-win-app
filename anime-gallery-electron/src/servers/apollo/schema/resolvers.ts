import { AnimesController } from '../database/controllers/animes/animes-controller';
import { SettingsController } from '../database/controllers/settings/settings-controller';
import { Anime } from '../database/interfaces/anime.interface';
import { Settings } from '../database/interfaces/settings-interface';
import {
  readFolders,
  getAnimes,
} from '../special-features/anime-viewer/anime-viewer';
import { GraphQLError } from 'graphql';

export const getResolvers = (
  animesController: AnimesController,
  settingsController: SettingsController
): any => ({
  Query: {
    animes: async () => {
      try {
        const animes = await animesController.getAllAnimes();
        return animes;
      } catch (error) {
        throw new GraphQLError(
          'App DB Error. Unrecognized Error while fetching Animes!',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
              http: {
                status: 500,
              },
            },
          }
        );
      }
    },
    anime: async (_: any, { id }: { id: string }) => {
      try {
        const anime = await animesController.getAnimeById(id);
        return anime;
      } catch (error) {
        throw new GraphQLError(
          'App DB Error. Unrecognized Error while fetching Anime!',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
              http: {
                status: 500,
              },
            },
          }
        );
      }
    },
    settings: async () => {
      try {
        const appSettings = await settingsController.getAllSettings();
        return appSettings;
      } catch (error) {
        throw new GraphQLError(
          'App Settings Error. Unrecognized Error while fetching settings!',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
              http: {
                status: 500,
              },
            },
          }
        );
      }
    },
    animesFromFolder: async (
      _: any,
      { mainFolderPath }: { mainFolderPath: string }
    ) => {
      const folders = readFolders(mainFolderPath);
      return getAnimes(folders);
    },
  },
  Mutation: {
    createAnime: async (
      _: any,
      { animeInput }: { animeInput: Omit<Anime, 'id'> }
    ) => {
      try {
        const createdAnime = await animesController.createAnime(animeInput);
        return createdAnime;
      } catch (error) {
        throw new GraphQLError(
          'App DB Error. Unrecognized Error while creating Anime!',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
              http: {
                status: 500,
              },
            },
          }
        );
      }
    },
    updateAnime: async (_: any, { animeInput }: { animeInput: Anime }) => {
      try {
        const updatedAnime = await animesController.updateAnimeById(animeInput);
        return updatedAnime;
      } catch (error) {
        throw new GraphQLError(
          'App DB Error. Unrecognized Error while updating Anime!',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
              http: {
                status: 500,
              },
            },
          }
        );
      }
    },
    deleteAnime: async (_: any, { id }: { id: string }) => {
      try {
        const affectedRows = await animesController.deleteAnimeById(id);
        return { affectedRows };
      } catch (error) {
        throw new GraphQLError(
          'App DB Error. Unrecognized Error while Deleting Anime!',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
              http: {
                status: 500,
              },
            },
          }
        );
      }
    },
    updateSettings: async (
      _: any,
      {
        settingsInput,
      }: { settingsInput: Omit<Settings, 'id' | 'createdAt' | 'updatedAt'> }
    ) => {
      try {
        const settings = await settingsController.updateSettings(settingsInput);
        return settings;
      } catch (error) {
        throw new GraphQLError('App Error While updating Settings', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            origin: error,
            http: {
              status: 500,
            },
          },
        });
      }
    },
  },
});
