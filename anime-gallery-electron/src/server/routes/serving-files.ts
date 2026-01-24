import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { servePicture } from '../controllers/serve-pictures';
import { serveVideo } from '../controllers/serve-videos';

const router: Router = express.Router();

const servingFilesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for this router
});

router.use(servingFilesLimiter);

router.get('/picture', servePicture);

router.get('/video', serveVideo);

export default router;
