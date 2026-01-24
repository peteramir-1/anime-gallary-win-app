import path from 'path';
import fs from 'fs';
import { RequestHandler } from 'express';
import { validatePathForExpress } from '../helpers/path-vallidation';

// Supported file types
const picturesMimeTypes: { [string: string]: string } = {
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
};

/**
 * Serves an image based on the provided file path.
 * Validates the file path and checks if the file exists.
 * Ensures the file type is supported before sending.
 * Streams the image file to the response.
 *
 * @param {Object} req - Express.js request object
 * @param {Object} res - Express.js response object
 * @throws {Error} if the file does not exist or the media type is unsupported
 */
export const servePicture: RequestHandler = (req, res) => {
  const filepath = validatePathForExpress(req, res);
  if (typeof filepath === 'object') return;

  // Get the file stats
  fs.stat(filepath, (err, stats) => {
    // Check if the file exists
    if (err || !stats.isFile()) {
      return res.status(404).send('File not found');
    }

    // Get the file extension and validate it
    const extension = path.extname(filepath).toLowerCase();

    // Check if the file type is supported
    if (!picturesMimeTypes[extension]) {
      return res.status(415).send('Unsupported media type');
    }

    // Create a stream and pipe it to the response
    const fileStream = fs.createReadStream(filepath);

    // Send the file
    fileStream.on('open', () => {
      res.set('Content-Type', picturesMimeTypes[extension]);
      fileStream.pipe(res);
    });

    // Handle errors
    fileStream.on('error', () => {
      res.status(500).send('Error reading the file');
    });
  });
};
