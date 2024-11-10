import { expect, test } from '@jest/globals';
import { SettingsController } from './settingsModel';
import { createDbConnection } from '../../helpers/database';
import { appDatabaseDirectoryPath } from '../../../config/db';
import * as path from 'path';
import * as fs from 'fs';
import * as BetterSqlite3 from 'better-sqlite3';

const testSettingsDatabaseFilename = 'settings-test.sqlite';
const testDatabaseFilePath = path.join(
  appDatabaseDirectoryPath,
  testSettingsDatabaseFilename
);

describe('Database Connection Functions', () => {
  test('create Database file and folder if not existed', async () => {
    await createDbConnection(
      appDatabaseDirectoryPath,
      testSettingsDatabaseFilename
    );
    expect(fs.existsSync(testDatabaseFilePath)).toBe(true);
  });
});

describe('Anime Database Controller', () => {
  let animeDatabaseConnection: BetterSqlite3.Database;
  let settingsController: SettingsController;

  beforeEach(async () => {
    animeDatabaseConnection = await createDbConnection(
      appDatabaseDirectoryPath,
      testSettingsDatabaseFilename
    );
    expect(fs.existsSync(testDatabaseFilePath)).toBe(true);
    settingsController = new SettingsController(animeDatabaseConnection);
  });

  test('Get All Settings', () => {
    const settings = settingsController.getAllSettings();
    expect(settings).toBeTruthy();
  });

  test('update Settings', () => {
    settingsController
      .updateSettings({
        theme: 'custom-theme-1',
      })
      .then(() => {
        return settingsController.getAllSettings();
      })
      .then(previousSettings => {
        expect(previousSettings.theme).toBe('custom-theme-1');
        return settingsController.updateSettings({
          theme: 'vjs-theme-city',
        });
      })
      .then((currentSettings) => {
        expect(currentSettings.theme).toBe('vjs-theme-city');
      });
  });
});
