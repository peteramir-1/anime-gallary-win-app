import fs from 'fs';
import { Request, RequestHandler, Response } from 'express';
import { mediaMimeTypes, ServeMediaExpressController } from './serve-media';

export class servePictureController extends ServeMediaExpressController {
  mediaMimeTypes: mediaMimeTypes = {
    '.gif': 'image/gif',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
  };

  serve: RequestHandler = async (req: Request, res: Response) => {
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
        if (!res.headersSent)
          return res.status(415).send('Unsupported media type');
        return;
      }

      // Use promises API for stat to avoid mixing callback and async styles
      let stats: fs.Stats;
      try {
        stats = await fs.promises.stat(filePath);
      } catch {
        if (!res.headersSent) return res.status(404).send('File not found');
        return;
      }

      if (!stats.isFile()) {
        if (!res.headersSent) return res.status(404).send('File not found');
        return;
      }

      // Stream the file to the response
      const stream = fs.createReadStream(filePath);

      stream.on('open', () => {
        // Set content type and pipe
        if (!res.headersSent) {
          res.setHeader('Content-Type', this.fileMime(filePath));
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
}
