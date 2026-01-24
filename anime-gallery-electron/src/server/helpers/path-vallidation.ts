import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';

const SAFE_ROOT = fs.realpathSync(process.env.MEDIA_ROOT || process.cwd());

/**
 * Validates a given route by resolving the absolute path and normalizing it.
 * Ensures the route does not start with C: and that the file exists.
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 * @returns {string} normalized path
 * @throws {Error} if the route is invalid
 */
export const validatePath = (req: Request, res: Response): string | Response => {
  const requestPath = req.query.path;

  // Check if path query parameter exists
  if (!requestPath) {
    return res.status(400).send('File path is required');
  }

  // Resolve the absolute path relative to the safe root
  const resolvedPath = path.resolve(SAFE_ROOT, String(requestPath));

  // Normalize and resolve symlinks to prevent directory traversal
  let normalizedPath: string;
  try {
    normalizedPath = fs.realpathSync(resolvedPath);
  } catch {
    return res.status(404).send('Video file not found');
  }

  // Disallow access to C: drive explicitly (in addition to SAFE_ROOT restriction)
  if (normalizedPath.toLocaleLowerCase().startsWith('c:')) {
    return res.status(403).send('Access Denied!');
  }

  // Ensure the normalized path is within the safe root directory
  const safeRootWithSep = SAFE_ROOT.endsWith(path.sep) ? SAFE_ROOT : SAFE_ROOT + path.sep;
  if (
    normalizedPath !== SAFE_ROOT &&
    !normalizedPath.startsWith(safeRootWithSep)
  ) {
    return res.status(403).send('Access Denied!');
  }

  // Check if the file exists
  if (!fs.existsSync(normalizedPath)) {
    return res.status(404).send('Video file not found');
  }

  // Return the validated and normalized path
  return normalizedPath;
};
