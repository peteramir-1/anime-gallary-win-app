import express, { Router } from 'express';
import { servePictures } from '../controllers/serve-pictures';
import { serveVideo } from '../controllers/serve-videos';

const router: Router = express.Router();

router.get('/picture', servePictures);

router.get('/video', serveVideo);

export default router;
