import express from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { register, login, getCurrentUser } from '../controllers/authController';
import { registerSchema, loginSchema } from '../schemas';

const router = express.Router();

// @route   GET /api/auth/health
// @desc    Health check endpoint for auth service
// @access  Public
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Auth service is running',
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV || 'development',
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasMongoUri: !!process.env.MONGODB_URI
    }
  });
});

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validate(registerSchema), register);

// @route   POST /api/auth/debug-register
// @desc    Debug registration endpoint (bypasses validation)
// @access  Public
router.post('/debug-register', (req, res) => {
  try {
    // Log the request body
    console.log('Debug registration request received:', req.body);
    
    // Check MongoDB connection
    const dbState = mongoose.connection.readyState;
    const dbStateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Return detailed information about the environment and request
    return res.status(200).json({
      message: 'Debug registration endpoint',
      requestReceived: true,
      bodyReceived: req.body,
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoDbState: dbStateMap[dbState as number] || 'unknown'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in debug registration:', error);
    return res.status(500).json({
      message: 'Debug endpoint error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validate(loginSchema), login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getCurrentUser);

export default router;
