import path from 'path';
import fs from 'fs';
import si from 'systeminformation';
import isPathInside from 'is-path-inside';
import { Request, Response } from 'express';

const SAFE_ROOTS: string[] = [];
const BLOCKED = [
  // Root Directory System Folders
  '$Recycle.bin', // Recyle bin data for the drive
  'System Volume Information', // System Restore points and indexing
  'ProgramData', // Shared application data for all users
  'Windows', // Windows main Folder
  'Program Files', // Programs Folder
  'Recovery', // Windows Recovery Environment (WinRE) data
  'MSOCache', // Microsoft Office local installation source
  '$WinREAgent', // Created during Windows updates for recovery

  // User Profile Hidden Folders
  'AppData', // User-specific app settings (Local, LocalLow, Roaming)

  // Hidden System Files (Root)
  'pagefile.sys', // Virtual memory paging file
  'hiberfil.sys', // Hibernation state data
  'swapfile.sys', // Virtual memory for universal apps
  'bootmgr', // Windows Boot Manager
  'BOOTNXT', // Boot loader component,
];

/**
 * Initialize safe roots once on app startup
 * Allows all drives except the system drive
 */
export async function initSafeRoots(): Promise<void> {
  const disks = await si.fsSize();
  const systemDrive = (process.env.SystemDrive || 'C:').toUpperCase();

  SAFE_ROOTS.push(
    ...disks
      .map(d => d.mount)
      .filter(Boolean)
      .map(m => (m.endsWith(path.sep) ? m : m + path.sep))
      .filter(m => !m.toUpperCase().startsWith(systemDrive))
      .map(m => fs.realpathSync(m))
  );
}

/**
 * Validates a given path against all safe roots.
 * Prevents path traversal and excludes the system drive.
 */
export const validatePathForExpress = (
  req: Request,
  res: Response
): string | Response => {
  // Ensure safe roots have been initialized
  if (!SAFE_ROOTS.length) {
    return res.status(500).send('Safe roots not initialized');
  }

  const requestPath = req.query.path;

  if (typeof requestPath !== 'string') {
    return res.status(400).send('File path is required');
  }

  // Disallow UNC paths
  if (path.isAbsolute(requestPath) && requestPath.startsWith('\\\\')) {
    return res.status(403).send('Network paths not allowed');
  }

  let normalizedPath: string;
  try {
    // Resolve + normalize user input
    normalizedPath = fs.realpathSync(path.resolve(requestPath));
  } catch {
    return res.status(404).send('Video file not found');
  }

  if (
    BLOCKED.some(b => normalizedPath.toLowerCase().includes(b.toLowerCase()))
  ) {
    return res.status(403).send('Access Denied!');
  }

  // Ensure path is inside at least one safe root
  const isAllowed = SAFE_ROOTS.some(
    root => root === normalizedPath || isPathInside(normalizedPath, root)
  );

  if (!isAllowed) {
    return res.status(403).send('Access Denied!');
  }

  // Ensure file exists
  if (!fs.existsSync(normalizedPath)) {
    return res.status(404).send('Video file not found');
  }

  return normalizedPath;
};

type Result<T> = { success: true; data: T } | { success: false; error: string };

export function validatePathText(requestPath: string): Result<string> {
  if (!SAFE_ROOTS.length) {
    return { success: false, error: 'Safe roots not initialized' };
  }

  if (!requestPath) {
    return { success: false, error: 'File path is required' };
  }

  let normalizedPath: string;
  try {
    normalizedPath = fs.realpathSync(path.resolve(requestPath));
  } catch (err: unknown) {
    return { success: false, error: 'File not found' };
  }

  if (
    BLOCKED.some(b => normalizedPath.toLowerCase().includes(b.toLowerCase()))
  ) {
    return { success: false, error: 'Access Denied!' };
  }

  const isAllowed = SAFE_ROOTS.some(
    root => root === normalizedPath || isPathInside(normalizedPath, root)
  );

  if (!isAllowed) {
    return { success: false, error: 'Access denied!' };
  }

  if (!fs.existsSync(normalizedPath)) {
    return { success: false, error: 'File not found' };
  }

  return { success: true, data: normalizedPath };
}
