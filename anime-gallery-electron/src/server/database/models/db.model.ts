import * as path from 'path';

const getAppDataPath = (): string => {
  return process.env.APPDATA || '';
};

export const appDatabaseDirectoryPath = path.join(
  getAppDataPath(),
  'anime-gallery-app',
  'sqlite-files'
);
export const animeDatabaseFilename = 'anime.sqlite';
export const settingsDatabaseFilename = 'settings.sqlite';
