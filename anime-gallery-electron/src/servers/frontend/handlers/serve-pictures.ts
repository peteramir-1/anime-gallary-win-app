import * as path from 'path';
import * as fs from 'fs';

const mime: { [string: string]: string } = {
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
};

export const servePictures = (req: any, res: any) => {
  if (req.query.path) {
    try {
        console.log(req.query.path)
        console.log(req.params.path)
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
