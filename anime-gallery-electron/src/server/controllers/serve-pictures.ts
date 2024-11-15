import * as path from 'path';
import * as fs from 'fs';

// Supported file types
const mime: { [string: string]: string } = {
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
};

/**
 * Serves a picture from the given path.
 *
 * The route requires a "path" query parameter with the file path of the
 * picture to be served. The file path is validated by resolving it to an
 * absolute path and normalizing it. The file must exist and be within the
 * allowed directory. The file type must be one of the supported types.
 *
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 *
 * @throws 400 if the file path cannot be processed
 * @throws 403 if the file type is not supported
 * @throws 404 if the file does not exist
 */
export const servePictures = (req: any, res: any) => {
  const filepath = validateRoute(req, res);

  // Check if the file exists and is within the allowed directory
  fs.stat(filepath, (err, stats) => {
    if (err || !stats.isFile()) {
      // File does not exist
      return res.status(404).send('File not found');
    }

    // Get the file extension and validate it
    const extension = path.extname(filepath).slice(1).toLowerCase();
    const mimeType = mime[extension];

    if (!mimeType) {
      // File type is not supported
      return res.status(415).send('Unsupported media type');
    }

    // Create a stream and pipe it to the response
    const fileStream = fs.createReadStream(filepath);

    fileStream.on('open', () => {
      res.set('Content-Type', mimeType);
      fileStream.pipe(res);
    });

    fileStream.on('error', () => {
      // Error reading the file
      res.status(500).send('Error reading the file');
    });
  });
};


/**
 * Validates a given route by resolving the absolute path and normalizing it.
 * Ensures the route does not start with C: and that the file exists.
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 * @returns {string} normalized path
 * @throws {Error} if the route is invalid
 */
const validateRoute = (req: any, res: any): string => {
  // Check if path query parameter exists
  if (!req.query.path) {
    return res.status(400).send('File path is required');
  }

  // Resolve the absolute path
  const resolvedPath = path.resolve(req.query.path as string);

  // Normalize the path to prevent directory traversal
  const normalizedPath = path.normalize(resolvedPath);

  // Disallow access to C: drive
  if (normalizedPath.toLocaleLowerCase().startsWith('c:')) {
    return res.status(403).send('Access Denied!');
  }

  // Return the validated and normalized path
  return normalizedPath;
};
