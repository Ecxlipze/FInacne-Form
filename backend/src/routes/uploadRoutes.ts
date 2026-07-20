import { Router } from 'express';
import * as uploadController from '../controllers/uploadController';
import { strictLimiter } from '../middleware/security';

const router = Router();

router.post('/upload/presign', strictLimiter, uploadController.presign);
router.post('/upload/scan-callback', uploadController.scanCallback); // secret-authenticated

export default router;
