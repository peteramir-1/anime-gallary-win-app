import express, { Router } from 'express';
import { servePictures } from '../controllers/serve-pictures';

const router: Router = express.Router();

router.get('/picture', servePictures);

export default router;
