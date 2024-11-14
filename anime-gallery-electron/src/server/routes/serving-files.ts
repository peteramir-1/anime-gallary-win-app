import * as express from 'express';
import { servePictures } from '../controllers/serve-pictures';
import { Router } from 'express';

const router: Router = express.Router();

router.get('/picture', servePictures);

export default router;