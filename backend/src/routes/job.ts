import express from 'express';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { cacheMiddleware } from '../middleware/cache';
import { getAllJobs, getJobById, createJob } from '../controllers/jobController';
import { createJobSchema } from '../schemas';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs
// @access  Public
// Cache job listings for 5 minutes (300 seconds)
router.get('/', cacheMiddleware(300), getAllJobs);

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
// Cache individual job details for 10 minutes (600 seconds)
router.get('/:id', cacheMiddleware(600), getJobById);

// @route   POST /api/jobs
// @desc    Create a new job (admin only)
// @access  Private
router.post('/', auth, validate(createJobSchema), createJob);

export default router;
