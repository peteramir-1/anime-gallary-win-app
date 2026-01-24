import path from 'path';
import fs from 'fs';
import { RequestHandler } from 'express';
import { validatePathForExpress } from '../helpers/path-vallidation';

// Supported file types
const picturesMimeTypes: { [ext: string]: string } = {
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

/**
 * Serves an image based on the provided file path.
 * Uses the async validatePathForExpress which may already send an HTTP response.
 */
export const servePicture: RequestHandler = async (req, res) => {
  try {
    // Validate path using the new async validator which may already send an HTTP response.
    const validated = await validatePathForExpress(req, res);
    if (typeof validated !== 'string') {
      // validatePathForExpress already handled the response (error), so stop processing.
      return;
    }
    const filepath = validated;

    // Use promises API for stat to avoid mixing callback and async styles
    let stats: fs.Stats;
    try {
      stats = await fs.promises.stat(filepath);
    } catch {
      if (!res.headersSent) return res.status(404).send('File not found');
      return;
    }

    if (!stats.isFile()) {
      if (!res.headersSent) return res.status(404).send('File not found');
      return;
    }

    // Get the file extension and validate it
    const extension = path.extname(filepath).toLowerCase();
    const mime = picturesMimeTypes[extension];
    if (!mime) {
      if (!res.headersSent)
        return res.status(415).send('Unsupported media type');
      return;
    }

    // Stream the file to the response
    const stream = fs.createReadStream(filepath);

    stream.on('open', () => {
      // Set content type and pipe
      if (!res.headersSent) {
        res.setHeader('Content-Type', mime);
      }
      stream.pipe(res);
    });

    stream.on('error', err => {
      console.error('File stream error:', err);
      try {
        if (!res.headersSent) res.status(500).send('Error reading the file');
        else res.destroy();
      } catch {
        // ignore
      }
    });
  } catch (err) {
    console.error('servePicture error:', err);
    if (!res.headersSent) res.status(500).send('Internal Server Error');
  }
};
