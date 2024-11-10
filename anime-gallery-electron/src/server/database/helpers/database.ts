import * as fs from 'fs';
import * as BetterSqlite3 from 'better-sqlite3';
import * as path from 'path';

/**
 * @type BetterSqlite3.Options
 */
const DatabaseConfigs = {
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

/**
 * @description This creates Database BetterSqlite3 Connection between
 * a database file and javascript
 * @param {string} dbDir
 * @param {string} dbFilename
 * @returns BetterSqlite3.Database
 */
export const createDbConnection = async (
  dbDir: string,
  dbFilename: string
): Promise<BetterSqlite3.Database> => {
  // Create database Directory if not existed
  fs.existsSync(path.join(dbDir, dbFilename)) ||
    (await fs.promises.mkdir(dbDir, { recursive: true }));

  // Returing Database Connection to which
  // a database controller requires
  return new BetterSqlite3(path.join(dbDir, dbFilename), DatabaseConfigs);
};