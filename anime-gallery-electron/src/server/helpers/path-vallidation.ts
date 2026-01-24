import path from 'path';
import fs from 'fs';
import si from 'systeminformation';
import isPathInside from 'is-path-inside';
import { Request, Response } from 'express';

let SAFE_ROOTS: string[] = [];

/**
 * Initialize safe roots once on app startup
 * Allows all drives except the system drive
 */
export async function initSafeRoots(): Promise<void> {
  const disks = await si.fsSize();
  const systemDrive = (process.env.SystemDrive || 'C:').toUpperCase();

  SAFE_ROOTS = disks
    .map(d => d.mount)
    .filter(Boolean)
    .map(m => (m.endsWith(path.sep) ? m : m + path.sep))
    .filter(m => !m.toUpperCase().startsWith(systemDrive))
    .map(m => fs.realpathSync(m));
}

/**
 * Validates a given path against all safe roots.
 * Prevents path traversal and excludes the system drive.
 */
export const validatePath = (
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

  // Ensure path is inside at least one safe root
  const isAllowed = SAFE_ROOTS.some(root => isPathInside(normalizedPath, root));

  if (!isAllowed) {
    return res.status(403).send('Access Denied!');
  }

  // Ensure file exists
  if (!fs.existsSync(normalizedPath)) {
    return res.status(404).send('Video file not found');
  }

  return normalizedPath;
};
