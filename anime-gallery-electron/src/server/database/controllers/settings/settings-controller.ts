import { Database } from 'better-sqlite3';
import {
  sqliteSettingsInterface,
  Settings,
} from '../../interfaces/settings-interface';
import * as statements from './settings-sql';
import { GraphQLError } from 'graphql';

export class SettingsController {
  private booleanFields = [
    'darkMode',
    'enableMute',
    'enableVolumeScroll',
    'enableHoverScroll',
    'enableFullscreen',
    'enableNumbers',
    'enableModifiersForNumbers',
    'alwaysCaptureHotkeys',
    'enableInactiveFocus',
    'skipInitialFocus',
    'pip',
    'controls',
    'autoplay',
    'loop',
    'muted',
    'skipButton',
    'audioOnlyMode',
    'audioPosterMode',
    'remainingTimeDisplayDisplayNegative',
    'hotkeys',
  ];

  constructor(private DatabaseConnection: Database) {
    this.prepareDatabaseConnection();
  }
  private prepareDatabaseConnection(): void {
    try {
      this.DatabaseConnection.prepare(
        statements.CREATE_SETTINGS_TABLE_IF_NOT_EXISTED
      ).run();
      const res = this.DatabaseConnection.prepare(
        'SELECT id FROM Settings WHERE id = 0'
      ).get() as { id: number };
      if (!(res?.id === 0)) {
        const createdAt = new Date().toLocaleDateString('en-CA');
        this.DatabaseConnection.prepare(
          'INSERT INTO Settings(id, createdAt) VALUES(0, @createdAt);'
        ).run({ createdAt });
      }
    } catch (error) {
      throw new GraphQLError('Error in Preparing Database Connection', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          origin: error,
        },
      });
    }
  }

  public getAllSettings(): Promise<Settings> {
    return new Promise((resolve, reject) => {
      try {
        const res = this.DatabaseConnection.prepare(
          statements.GET_SETTINGS
        ).get() as sqliteSettingsInterface;
        const settings: Settings = {
          ...this.convertToApolloDataType(res),
        };
        resolve(settings);
      } catch (error) {
        reject(
          new GraphQLError('Error in Fetching Saved Data', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
            },
          })
        );
      }
    });
  }

  public async updateSettings(
    update_settings: Partial<Settings>
  ): Promise<Settings> {
    const previousSettings = await this.getAllSettings();
    return new Promise<Settings>((resolve, reject) => {
      try {
        const updatedAt = new Date().toLocaleDateString('en-CA');
        const updatedSettings: sqliteSettingsInterface & {
          updatedAt: string;
        } = {
          ...this.convertToSqliteDataType(previousSettings),
          ...this.convertToSqliteDataType(update_settings),
          updatedAt,
        };
        this.DatabaseConnection.prepare(statements.UPDATE_SETTINGS).run(
          updatedSettings
        );
        this.getAllSettings()
          .then(settings => {
            resolve(settings);
          })
          .catch(error => {
            console.error('Error in Fetching Data After Updating', error);
            throw new GraphQLError('Error in Fetching Data After Updating', {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                origin: error,
              },
            });
          });
      } catch (error) {
        reject(
          new GraphQLError('Error in Updating Data', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              origin: error,
            },
          })
        );
      }
    });
  }

  private convertToSqliteDataType(
    obj: Partial<Settings>
  ): sqliteSettingsInterface {
    return Object.fromEntries(
      Object.entries(obj).map(propertyArr => {
        const key = propertyArr[0];
        if (this.booleanFields.includes(key)) {
          return [propertyArr[0], Number(propertyArr[1])];
        }
        return [propertyArr[0], propertyArr[1]];
      })
    ) as sqliteSettingsInterface;
  }

  private convertToApolloDataType(
    obj: Partial<sqliteSettingsInterface>
  ): Settings {
    return Object.fromEntries(
      Object.entries(obj).map(propertyArr => {
        const key = propertyArr[0];
        if (this.booleanFields.includes(key)) {
          return [propertyArr[0], Boolean(propertyArr[1])];
        }
        return [propertyArr[0], propertyArr[1]];
      })
    ) as Settings;
  }
}
