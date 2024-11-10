import { getAnimes, readFolders } from '../../models/anime-viewer/anime-viewer.model';

export const animeViewerResolver = {
  Query: {
    animesFromFolder: async (
      _: any,
      { mainFolderPath }: { mainFolderPath: string }
    ) => {
      const folders = readFolders(mainFolderPath);
      return getAnimes(folders);
    },
  },
};
