import path from 'path';
import { appPath } from '../config/env';

export const appDatabaseDirectoryPath = path.join(
    appPath,
    'anime-gallery-app',
    'sqlite-files'
  ),
  animesDatabaseFilename = 'animes.sqlite',
  settingsDatabaseFilename = 'settings.sqlite',
  /**
   * @type BetterSqlite3.Options
   */
  DatabaseConfigs = {
    nativeBinding: ((): string => {
      /**
       * Code For Development -->
       * Please uncomment it if you want to work
       * in development mode and comment it for
       * production version.
       */
      if (process.env.mode?.trim() === 'development') {
        return path.join(
          'node_modules',
          'better-sqlite3',
          'build',
          'Release',
          'better_sqlite3.node'
        );
      }
      // #########################
      const commonPath = [
        'node_modules',
        'better-sqlite3',
        'build',
        'Release',
        'better_sqlite3.node',
      ];
      if (!!require.main?.path) {
        return path.join(...[require.main?.path || '', '..', ...commonPath]);
      } else {
        return path.join(
          ...[__dirname, '..', '..', '..', '..', '..', ...commonPath]
        );
      }
    })(),
    readonly: false,
    fileMustExist: false,
  };
