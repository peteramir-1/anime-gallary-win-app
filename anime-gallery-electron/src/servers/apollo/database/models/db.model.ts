import * as path from 'path';
import { getAppDataPath } from '../../common/utils';

export const appDatabaseDirectoryPath = path.join(getAppDataPath(), 'anime-gallery-app', 'sqlite-files');
export const animeDatabaseFilename = 'anime.sqlite';
export const settingsDatabaseFilename = 'settings.sqlite';
export const port = 8021;
