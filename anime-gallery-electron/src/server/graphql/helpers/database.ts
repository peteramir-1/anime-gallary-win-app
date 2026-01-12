import fs from 'fs';
import BetterSqlite3 from 'better-sqlite3';
import path from 'path';
import { DatabaseConfigs } from '../../config/db';

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
