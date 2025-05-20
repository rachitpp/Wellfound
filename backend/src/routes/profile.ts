import express from 'express';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { cacheMiddleware } from '../middleware/cache';
import { createOrUpdateProfile, getProfileByUserId, getCurrentProfile, getAllProfiles } from '../controllers/profileController';
import { createProfileSchema, updateProfileSchema, getProfileByIdSchema } from '../schemas';

const router = express.Router();

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, validate(createProfileSchema), createOrUpdateProfile);

// @route   GET /api/profile/all
// @desc    Get all profiles with pagination, filtering, and sorting
// @access  Public
// Cache profiles list for 5 minutes (300 seconds)
router.get('/all', cacheMiddleware(300), getAllProfiles);

// @route   GET /api/profile/:userId
// @desc    Get profile by user ID
// @access  Public
// Cache public profiles for 10 minutes (600 seconds)
router.get('/:userId', validate(getProfileByIdSchema), cacheMiddleware(600), getProfileByUserId);

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private
// Cache the current user's profile for 5 minutes (300 seconds)
router.get('/', auth, cacheMiddleware(300), getCurrentProfile);

export default router;
