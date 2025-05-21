import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { email, password, name, role = 'job_seeker' } = req.body;

    // Check if required fields are present
    if (!email || !password || !name) {
      console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name });
      return res.status(400).json({ 
        message: 'Missing required fields', 
        details: { 
          email: email ? undefined : 'Email is required',
          password: password ? undefined : 'Password is required',
          name: name ? undefined : 'Name is required'
        } 
      });
    }

    // Check if user already exists
    let user;
    try {
      user = await User.findOne({ email });
      if (user) {
        console.log('User already exists with email:', email);
        return res.status(400).json({ message: 'User already exists' });
      }
    } catch (dbError) {
      console.error('Database error checking for existing user:', dbError);
      return res.status(500).json({ 
        message: 'Database error', 
        details: 'Could not check if user exists'
      });
    }

    // Create new user
    try {
      user = new User({
        email,
        password,
        name,
        role
      });

      await user.save();
      console.log('User created successfully with ID:', user.id);
    } catch (saveError) {
      console.error('Error saving user to database:', saveError);
      return res.status(500).json({ 
        message: 'Database error', 
        details: 'Could not create user account'
      });
    }

    // Create and return JWT token
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    // Use Promise-based JWT sign instead of callback to handle errors better
    try {
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'default_jwt_secret',
        { expiresIn: '7d' }
      );
      
      return res.json({ 
        token, 
        user: { id: user.id, name: user.name, email: user.email } 
      });
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return res.status(500).json({ 
        message: 'Authentication error', 
        details: 'Could not generate authentication token'
      });
    }
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ 
      message: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login request received for email:', req.body.email);
    const { email, password } = req.body;

    // Check if user exists
    let user;
    try {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } catch (dbError) {
      console.error('Database error finding user:', dbError);
      return res.status(500).json({ 
        message: 'Database error', 
        details: 'Could not verify user credentials'
      });
    }

    // Check password
    try {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } catch (passwordError) {
      console.error('Password comparison error:', passwordError);
      return res.status(500).json({ 
        message: 'Authentication error', 
        details: 'Could not verify password'
      });
    }

    // Create and return JWT token
    const payload = {
      id: user.id,
    };

    // Use Promise-based JWT sign instead of callback to handle errors better
    try {
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'default_jwt_secret',
        { expiresIn: '7d' }
      );
      
      console.log('User logged in successfully:', user.id);
      return res.json({ token });
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return res.status(500).json({ 
        message: 'Authentication error', 
        details: 'Could not generate authentication token'
      });
    }
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ 
      message: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // User is already attached to req by auth middleware
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error in get me:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
