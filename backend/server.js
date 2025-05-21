// Simple test server to isolate issues
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3300;

// Enable all CORS requests for testing
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));

// Body parser
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Simplified Wellfound API server',
    status: 'Running',
    env: {
      nodeVersion: process.version,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasMongoUri: !!process.env.MONGODB_URI
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Debug MongoDB connection
app.get('/db-status', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    status: dbStateMap[dbState] || 'unknown',
    mongoUri: process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.substring(0, 20) + '...' : 
      'Not provided',
    connectionDetails: {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    }
  });
});

// Create User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true });

// Password hashing
userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error('Hashing error:', error);
    next(error);
  }
});

// Create User model
const User = mongoose.model('User', userSchema);

// Simple registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { email, password, name } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        provided: { email: !!email, password: !!password, name: !!name }
      });
    }

    // Check if user exists
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
    } catch (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ message: 'Database query error', details: error.message });
    }
    
    // Create user
    try {
      const user = new User({ email, password, name });
      await user.save();
      
      // Create JWT
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'test_secret',
        { expiresIn: '7d' }
      );
      
      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
      
    } catch (error) {
      console.error('User creation error:', error);
      return res.status(500).json({ 
        message: 'Failed to create user', 
        details: error.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
      });
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      details: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
});

// GET version of register for browser testing
app.get('/api/register', (req, res) => {
  res.json({
    message: 'Registration requires a POST request with email, password, and name',
    example: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'test@example.com', 
        password: 'password123', 
        name: 'Test User' 
      })
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    error: 'Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobmatch-app');
    console.log('MongoDB Connected');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
