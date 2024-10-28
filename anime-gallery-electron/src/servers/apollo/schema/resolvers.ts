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
      const animes = await animesController.getAllAnimes();
      if (animes) return animes;
      else
        throw new GraphQLError(
          'App DB Error. Unrecognized Error while fetching Animes!',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          }
        );
    },
    anime: async (_: any, { id }: { id: string }) => {
      const anime = await animesController.getAnimeById(id);
      if (anime) return anime;
      else
        throw new GraphQLError(
          'App DB Error. Unrecognized Error while fetching Anime!',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          }
        );
    },
    settings: async () => {
      const appSettings = await settingsController.getAllSettings();
      if (appSettings) return appSettings;
      else
        throw new GraphQLError(
          'App Settings Error. Unrecognized Error while fetching settings!',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          }
        );
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
      const createdAnime = await animesController.createAnime(animeInput);
      if (createdAnime) return createdAnime;
      else
        throw new GraphQLError(
          'App DB Error. Unrecognized Error while creating Anime!',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          }
        );
    },
    updateAnime: async (_: any, { animeInput }: { animeInput: Anime }) => {
      const updatedAnime = await animesController.updateAnimeById(animeInput);
      if (updatedAnime) return updatedAnime;
      else
        throw new GraphQLError(
          'App DB Error. Unrecognized Error while updating Anime!',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          }
        );
    },
    deleteAnime: async (_: any, { id }: { id: string }) => {
      const affectedRows = await animesController.deleteAnimeById(id);
      if (affectedRows) return { affectedRows };
      else
        throw new GraphQLError(
          'App DB Error. Unrecognized Error while Deleting Anime!',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          }
        );
    },
    updateSettings: async (
      _: any,
      {
        settingsInput,
      }: { settingsInput: Omit<Settings, 'id' | 'createdAt' | 'updatedAt'> }
    ) => {
      const settings = await settingsController.updateSettings(settingsInput);
      if (settings) return settings;
      else
        throw new GraphQLError(
          'App Settings Error. Unrecognized Error while updating settings!',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          }
        );
    },
  },
});
