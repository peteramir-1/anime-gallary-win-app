import fs from 'fs';
import rangeParser from 'range-parser';
import { RequestHandler } from 'express';
import { mediaMimeTypes, ServeMediaExpressController } from './serve-media';

// Supported file types
export class serveVideoController extends ServeMediaExpressController {
  protected mediaMimeTypes: mediaMimeTypes = {
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
   * Uses the async validatePathForExpress and fs.promises APIs.
   */
  serve: RequestHandler = async (req, res) => {
    try {
      // Validate path using the new async validator which may already send an HTTP response.
      const validated = await this.validatePath(req, res);
      if (typeof validated !== 'string') {
        // validatePathForExpress already handled the response (error), so stop processing.
        return;
      }
      const filePath = validated;

      // Validate File type support
      if (!this.isFileSupported(filePath)) {
        return res.status(415).send('Unsupported media type');
      }

      // Use promises API for stat to avoid mixing callback and async styles
      let stats: fs.Stats;
      try {
        stats = await fs.promises.stat(filePath);
      } catch {
        return res.status(404).send('File not found');
      }

      if (!stats.isFile()) {
        return res.status(404).send('File not found');
      }

      const fileSize = stats.size;
      const headerRange = req.headers.range;

      // No range header: stream entire file
      if (!headerRange) {
        res.status(200);
        res.setHeader('Content-Type', this.fileMime(filePath));
        const stream = fs.createReadStream(filePath);
        stream.on('error', err => {
          console.error('Stream error:', err);
          if (!res.headersSent) res.status(500).send('Internal Server Error');
          else res.destroy();
        });
        stream.pipe(res);
        return;
      }

      // Parse range header
      const ranges = rangeParser(fileSize, headerRange as string);

      if (ranges === -1) {
        return res.status(416).send('Requested Range Not Satisfiable');
      }
      if (ranges === -2) {
        return res.status(416).send('Result is invalid');
      }

      // Use the first range
      const start = ranges[0].start;
      const end = ranges[0].end > fileSize - 1 ? fileSize - 1 : ranges[0].end;
      const chunkSize = end - start + 1;

      // Set headers and stream the requested chunk
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunkSize),
        'Content-Type': this.fileMime(filePath),
      });

      const stream = fs.createReadStream(filePath, { start, end });
      stream.on('error', err => {
        console.error('Stream error:', err);
        try {
          if (!res.headersSent) res.status(500).send('Internal Server Error');
          else res.destroy();
        } catch {
          // ignore
        }
      });
      stream.pipe(res);
    } catch (error) {
      console.error('Error in serveVideo:', error);
      // If validatePathForExpress already sent a response, avoid sending another
      if (!res.headersSent) {
        res.status(500).send('Internal Server Error');
      }
    }
  };
}
