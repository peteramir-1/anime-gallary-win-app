import express, { Router } from 'express';
import { servePicture } from '../controllers/serve-pictures';
import { serveVideo } from '../controllers/serve-videos';

const router: Router = express.Router();

router.get('/picture', servePicture);

router.get('/video', serveVideo);

export default router;
