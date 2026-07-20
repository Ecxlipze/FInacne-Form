import { Router } from 'express';
import * as applicationController from '../controllers/applicationController';
import { strictLimiter } from '../middleware/security';

const router = Router();

router.get('/form/config', applicationController.formConfig);

router.post('/application/save', applicationController.save);
router.post('/application/resume-link', applicationController.sendResumeLink);
router.post('/application/resume', applicationController.resume);
router.post('/application/submit', strictLimiter, applicationController.submit);

export default router;
