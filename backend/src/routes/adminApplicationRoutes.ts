import { Router } from 'express';
import * as ctrl from '../controllers/adminApplicationController';
import * as uploadCtrl from '../controllers/uploadController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// All admin application routes require a valid access token.
router.use(requireAuth);

// Read — any authenticated admin (viewer and up).
router.get('/dashboard', ctrl.dashboard);
router.get('/applications', ctrl.list);
router.get('/applications/:id', ctrl.detail);
router.get('/applications/:id/documents', uploadCtrl.listDocuments);
router.get('/uploads/:uploadId/download', uploadCtrl.downloadDocument);

// Review actions — reviewers and super admins only.
router.patch('/applications/:id/status', requireRole('reviewer', 'super_admin'), ctrl.changeStatus);
router.post('/applications/:id/notes', requireRole('reviewer', 'super_admin'), ctrl.addNote);

// Erasure — super admin only.
router.delete('/applications/:id', requireRole('super_admin'), ctrl.remove);

export default router;
