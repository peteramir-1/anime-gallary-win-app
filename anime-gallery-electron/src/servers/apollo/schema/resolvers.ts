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
    animes: async () => animesController.getAllAnimes(),
    anime: async (_: any, { id }: { id: string }) =>
      animesController.getAnimeById(id),
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
    ) => animesController.createAnime(animeInput),
    updateAnime: async (_: any, { animeInput }: { animeInput: Anime }) =>
      animesController.updateAnimeById(animeInput),
    deleteAnime: async (_: any, { id }: { id: string }) => ({
      affectedRows: animesController.deleteAnimeById(id),
    }),
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
