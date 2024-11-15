import path from 'path';
import fs from 'fs';

const mime: { [string: string]: string } = {
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
};

/**
 * Serves a picture from the given path.
 *
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 *
 * @throws 400 if the file path cannot be processed
 * @throws 403 if the file type is not supported
 * @throws 404 if the file does not exist
 */
export const servePictures = (req: any, res: any) => {
  const filePath = req.query.path;

  // Check if path query parameter exists
  if (!filePath) {
    return res.status(400).send('File path is required');
  }

  // Resolve the file path and ensure it's an absolute path
  const resolvedPath = path.resolve(filePath);

  // Check if the file exists and is within the allowed directory
  fs.stat(resolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send('File not found');
    }

    // Get the file extension and validate it
    const extension = path.extname(resolvedPath).slice(1).toLowerCase();
    const mimeType = mime[extension];

    if (!mimeType) {
      return res.status(415).send('Unsupported media type');
    }

    // Create a stream and pipe it to the response
    const fileStream = fs.createReadStream(resolvedPath);
    
    fileStream.on('open', () => {
      res.set('Content-Type', mimeType);
      fileStream.pipe(res);
    });

    fileStream.on('error', () => {
      res.status(500).send('Error reading the file');
    });
  });
};
