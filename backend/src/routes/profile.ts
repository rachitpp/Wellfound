import express from 'express';
import { auth } from '../middleware/auth';
import { createOrUpdateProfile, getProfileByUserId, getCurrentProfile } from '../controllers/profileController';

const router = express.Router();

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, createOrUpdateProfile);

// @route   GET /api/profile/:userId
// @desc    Get profile by user ID
// @access  Public
router.get('/:userId', getProfileByUserId);

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', auth, getCurrentProfile);

export default router;
