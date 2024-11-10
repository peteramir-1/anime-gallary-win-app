import { GraphQLError } from 'graphql';
import { Settings } from '../../interfaces/settings-interface';
import { TContext } from '../../../app.interfaces';

export const settingsResolver = {
  Query: {
    settings: async (_: any, __: any, context: TContext) => {
      try {
        const appSettings = await context.settingsDbModel.getAllSettings();
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
  },
  Mutation: {
    updateSettings: async (
      _: any,
      {
        settingsInput,
      }: { settingsInput: Omit<Settings, 'id' | 'createdAt' | 'updatedAt'> },
      context: TContext
    ) => {
      try {
        const settings = await context.settingsDbModel.updateSettings(
          settingsInput
        );
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
};
