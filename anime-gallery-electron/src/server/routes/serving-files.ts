import * as express from 'express';
import { servePictures } from '../controllers/serve-pictures';

const router = express.Router();

router.get('/picture', servePictures);

export default router;
