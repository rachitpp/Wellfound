import express from 'express';
import { auth } from '../middleware/auth';
import { cacheRecommendations } from '../middleware/cache';
import { getRecommendations } from '../controllers/recommendController';

const router = express.Router();

// @route   POST /api/recommend
// @desc    Get AI job recommendations
// @access  Private
// Cache recommendations for 12 hours (43200 seconds) to avoid excessive AI API calls
router.post('/', auth, cacheRecommendations(43200), getRecommendations);

// @route   POST /api/recommend/test
// @desc    Test endpoint for AI job recommendations (no auth required)
// @access  Public
// Cache test recommendations for 30 minutes (1800 seconds)
router.post('/test', cacheRecommendations(1800), getRecommendations);

export default router;
