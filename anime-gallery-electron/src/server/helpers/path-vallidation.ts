import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';

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

  // Resolve the absolute path
  const resolvedPath = path.resolve(requestPath as string);

  // Normalize the path to prevent directory traversal
  const normalizedPath = path.normalize(resolvedPath);

  // Disallow access to C: drive
  if (normalizedPath.toLocaleLowerCase().startsWith('c:')) {
    return res.status(403).send('Access Denied!');
  }

  // Check if the file exists
  if (!fs.existsSync(normalizedPath)) {
    return res.status(404).send('Video file not found');
  }

  // Return the validated and normalized path
  return normalizedPath;
};
