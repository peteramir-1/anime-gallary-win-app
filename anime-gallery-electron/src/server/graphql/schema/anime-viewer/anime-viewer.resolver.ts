import { GraphQLError } from 'graphql';
import { AnimeViewerModel } from '../../models/anime-viewer/anime-viewer.model';

export const animeViewerResolver = {
  Query: {
    animesFromFolder: async (
      _: any,
      { mainFolderPath }: { mainFolderPath: string }
    ) => {
      try {
        const animeViewerModel = new AnimeViewerModel(mainFolderPath);
        await animeViewerModel.readMainFolder();
        return animeViewerModel.animes;
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
  },
};
