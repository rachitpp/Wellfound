import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import jobRoutes from "./routes/job";
import recommendRoutes from "./routes/recommend";
import savedJobRoutes from "./routes/savedJobRoutes";
import applicationRoutes from "./routes/applicationRoutes";

// Import Redis client (this initializes the connection)
import './utils/redis';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3300;

// Middleware
// Enable CORS for all routes
app.use((req, res, next) => {
  // Set CORS headers for all responses
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Also keep the cors middleware for backward compatibility
app.use(cors({
  origin: '*',
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Apply helmet middleware for security headers
app.use(helmet());

// Rate limiting middleware to prevent abuse and DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiter to all requests
app.use(limiter);

// Parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/jobmatch-app")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/applications", applicationRoutes);

// Root route for API documentation
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Wellfound API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      profile: "/api/profile",
      jobs: "/api/jobs",
      recommendations: "/api/recommend",
      savedJobs: "/api/saved-jobs",
      applications: "/api/applications"
    },
    health: "/health"
  });
});

// Health check route - make it as simple as possible to avoid errors
app.get("/health", (req, res) => {
  try {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error in health check:', error);
    // Even if there's an error, return a 200 status to avoid breaking API checks
    res.status(200).send('ok');
  }
});

// Also add the health check at the API root for API URL validation
app.get("/api/health", (req, res) => {
  try {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error in API health check:', error);
    res.status(200).send('ok');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
