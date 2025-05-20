import express from 'express';
import { getSavedJobs, saveJob, getSavedJob, updateSavedJob, deleteSavedJob, checkSavedJob } from '../controllers/savedJobController';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { saveJobSchema, updateSavedJobSchema, deleteSavedJobSchema, checkSavedJobSchema } from '../schemas';
import { cacheMiddleware } from '../middleware/cache';

const router = express.Router();

// Protected routes - require authentication
router.use(auth);

// GET /api/saved-jobs - Get all saved jobs for current user
router.get('/', cacheMiddleware(60), getSavedJobs);

// POST /api/saved-jobs - Save a job
router.post('/', validate(saveJobSchema), saveJob);

// GET /api/saved-jobs/:savedJobId - Get a specific saved job
router.get('/:savedJobId', getSavedJob);

// PUT /api/saved-jobs/:savedJobId - Update saved job notes
router.put('/:savedJobId', validate(updateSavedJobSchema), updateSavedJob);

// DELETE /api/saved-jobs/:savedJobId - Delete a saved job
router.delete('/:savedJobId', validate(deleteSavedJobSchema), deleteSavedJob);

// GET /api/saved-jobs/check/:jobId - Check if a job is saved by the current user
router.get('/check/:jobId', validate(checkSavedJobSchema), checkSavedJob);

export default router;
