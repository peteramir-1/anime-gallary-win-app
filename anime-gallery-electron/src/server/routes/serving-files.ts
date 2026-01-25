import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { servePictureController } from '../controllers/serve-pictures';
import { serveVideoController } from '../controllers/serve-videos';

const router: Router = express.Router();

const servingFilesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for this router
});

router.use(servingFilesLimiter);

router.get('/picture', new servePictureController().serve);

router.get('/video', new serveVideoController().serve);

export default router;
