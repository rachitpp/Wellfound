import express from 'express';
import { auth } from '../middleware/auth';
import { getAllJobs, getJobById, createJob } from '../controllers/jobController';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', getAllJobs);

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', getJobById);

// @route   POST /api/jobs
// @desc    Create a new job (admin only)
// @access  Private
router.post('/', auth, createJob);

export default router;
