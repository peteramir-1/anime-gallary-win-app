import * as path from 'path';
import * as fs from 'fs';

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
  if (req.query.path) {
    try {
        const file = path.join(req.query.path);
        const extension = path.extname(file).slice(1);
        if (!Object.keys(mime).includes(extension)) {
            return res.status(403).end('Forbidden');
        }
        const type = mime[extension];
        const s = fs.createReadStream(file);
        s.on('open', () => {
          res.set('Content-Type', type);
          s.pipe(res);
        });
        s.on('error', () => {
          res.set('Content-Type', 'text/plain');
          res.status(404).end('Not found');
        });
    } catch {
        res.status(400).end('file path cannot been processed');
    }
  }
};
