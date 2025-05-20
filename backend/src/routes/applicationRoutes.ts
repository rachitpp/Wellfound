import express from 'express';
import { 
  getUserApplications, 
  createApplication, 
  getApplication, 
  updateApplication, 
  deleteApplication 
} from '../controllers/applicationController';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { 
  createApplicationSchema, 
  updateApplicationSchema, 
  deleteApplicationSchema, 
  getApplicationSchema 
} from '../schemas';
import { cacheMiddleware } from '../middleware/cache';

const router = express.Router();

// Protected routes - require authentication
router.use(auth);

// GET /api/applications - Get all applications for current user
router.get('/', cacheMiddleware(60), getUserApplications);

// POST /api/applications - Create a new application
router.post('/', validate(createApplicationSchema), createApplication);

// GET /api/applications/:applicationId - Get a specific application
router.get('/:applicationId', validate(getApplicationSchema), getApplication);

// PATCH /api/applications/:applicationId - Update application status or notes
router.patch('/:applicationId', validate(updateApplicationSchema), updateApplication);

// DELETE /api/applications/:applicationId - Delete an application
router.delete('/:applicationId', validate(deleteApplicationSchema), deleteApplication);

export default router;
