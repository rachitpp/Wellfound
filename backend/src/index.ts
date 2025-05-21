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

// Define allowed frontend URL
const FRONTEND_URL = 'https://wellfound-1.onrender.com';

// CORS Configuration
const corsOptions = {
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400
};

// ✅ Apply CORS before any other routes or middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests globally

// Helmet for basic security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'unsafe-none' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", FRONTEND_URL],
      frameSrc: ["'self'", FRONTEND_URL],
      imgSrc: ["'self'", 'data:', FRONTEND_URL],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", FRONTEND_URL],
      styleSrc: ["'self'", "'unsafe-inline'", FRONTEND_URL],
    },
  },
}));

// Rate limiter to protect from abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Body parser
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/jobmatch-app")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Route handlers
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/applications", applicationRoutes);

// API root info
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

// Health checks
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
