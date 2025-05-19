import express from 'express';
import { auth } from '../middleware/auth';
import { getRecommendations } from '../controllers/recommendController';

const router = express.Router();

// @route   POST /api/recommend
// @desc    Get AI job recommendations
// @access  Private
router.post('/', auth, getRecommendations);

// @route   POST /api/recommend/test
// @desc    Test endpoint for AI job recommendations (no auth required)
// @access  Public
router.post('/test', getRecommendations);

export default router;
