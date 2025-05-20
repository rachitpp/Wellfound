import express from 'express';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { register, login, getCurrentUser } from '../controllers/authController';
import { registerSchema, loginSchema } from '../schemas';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validate(registerSchema), register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validate(loginSchema), login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getCurrentUser);

export default router;
