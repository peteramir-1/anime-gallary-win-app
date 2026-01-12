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
    readonly: false,
    fileMustExist: false,
  };
