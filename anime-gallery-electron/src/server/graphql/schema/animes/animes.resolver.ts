import { GraphQLError } from 'graphql';
import { Anime } from '../../interfaces/anime.interface';
import { TContext } from '../../../app.interfaces';

export const animeResolver = {
  Query: {
    animes: async (_: any, __: any, context: TContext) => {
      try {
        const animes = await context.animesDbModel.getAllAnimes();
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
    anime: async (_: any, { id }: { id: string }, context: TContext) => {
      try {
        const anime = await context.animesDbModel.getAnimeById(id);
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
  },
  Mutation: {
    createAnime: async (
      _: any,
      { animeInput }: { animeInput: Omit<Anime, 'id'> },
      context: TContext
    ) => {
      try {
        const createdAnime = await context.animesDbModel.createAnime(
          animeInput
        );
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
    updateAnime: async (
      _: any,
      { animeInput }: { animeInput: Anime },
      context: TContext
    ) => {
      try {
        const updatedAnime = await context.animesDbModel.updateAnimeById(
          animeInput
        );
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
    deleteAnime: async (_: any, { id }: { id: string }, context: TContext) => {
      try {
        const affectedRows = await context.animesDbModel.deleteAnimeById(id);
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
  },
};
