import { AnimesController } from '../database/controllers/animes/animes-controller';
import { SettingsController } from '../database/controllers/settings/settings-controller';
import { Anime } from '../database/interfaces/anime.interface';
import { Settings } from '../database/interfaces/settings-interface';

export const getResolvers = (
  animesController: AnimesController,
  settingsController: SettingsController
): any => ({
  Query: {
    animes: async () => animesController.getAllAnimes(),
    anime: async (_: any, { id }: { id: string }) =>
      animesController.getAnimeById(id),
    settings: async () => settingsController.getAllSettings(),
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
    ) => settingsController.updateSettings(settingsInput),
  },
});
