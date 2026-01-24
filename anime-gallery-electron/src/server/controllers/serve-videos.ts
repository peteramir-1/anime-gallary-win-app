import fs from 'fs';
import path from 'path';
import rangeParser from 'range-parser';
import { RequestHandler } from 'express';
import { validatePathForExpress } from '../helpers/path-vallidation';

// Supported file types
const videosMime: { [string: string]: string } = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',
  '.flv': 'video/x-flv',
  '.mov': 'video/quicktime',
};

/**
 * Serves a video stream based on user-provided path.
 * Handles range requests for video streaming.
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 * @throws {Error} if the route is invalid or the file does not exist
 */
export const serveVideo: RequestHandler = (req, res) => {
  try {
    // validate path
    const filepath = validatePathForExpress(req, res);
    if (typeof filepath === 'object') return undefined;

    // Get the file extension
    const extension = path.extname(filepath).toLowerCase();

    // get file stats
    fs.stat(filepath, (err, stats) => {
      // check if file exists
      if (err || !stats.isFile()) {
        return res.status(404).send('File not found');
      }

      // check if file type is supported
      if (!videosMime[extension]) {
        return res.status(415).send('Unsupported media type');
      }

      // Set the correct Content-Type header
      res.setHeader('Content-Type', videosMime[extension]);

      // Get the file size
      const fileSize = stats.size;

      // Get the range header
      const headerRange = req.headers.range;

      // If no range header, send the entire file
      if (!headerRange) {
        res.status(200);
        const videoStream = fs.createReadStream(filepath);
        videoStream.pipe(res);
        return;
      }

      // Handle range requests for video streaming
      // Parse range header to determine the start and end of the video stream
      const ranges = rangeParser(fileSize, headerRange);

      // Check if the range header is valid
      if (ranges === -1) {
        return res.status(416).send('Requested Range Not Satisfiable');
      }

      // Check if the range header is valid
      if (ranges === -2) {
        return res.status(416).send('Result is invalid');
      }

      // Set the start and end of the video stream
      const start = ranges[0].start;
      const end = ranges[0].end > fileSize - 1 ? fileSize - 1 : ranges[0].end;
      const chunkSize = end - start + 1;

      // Set response headers for video streaming
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4', // Change based on your video file format
      });

      // Stream the video chunk
      const videoStream = fs.createReadStream(filepath, { start, end });
      videoStream.pipe(res);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
