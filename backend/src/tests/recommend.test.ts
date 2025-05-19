import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';
import User from '../models/User';
import Profile from '../models/Profile';
import Job from '../models/Job';
import jwt from 'jsonwebtoken';
import { getJobRecommendations } from '../utils/aiService';

// Mock AI Service API
jest.mock('../utils/aiService');

describe('Recommendation API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobmatch_test');
    
    // Create a test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    
    userId = user._id.toString();
    
    // Create a token
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'default_jwt_secret', {
      expiresIn: '1h',
    });
    
    // Create a profile for the user
    await Profile.create({
      user: userId,
      name: 'Test User',
      location: 'Test City',
      yearsOfExperience: 5,
      skills: ['JavaScript', 'React', 'Node.js'],
      preferredJobType: 'remote',
    });
    
    // Create some test jobs
    await Job.create([
      {
        title: 'Frontend Developer',
        company: 'Test Company',
        location: 'Test City',
        skills: ['JavaScript', 'React', 'CSS'],
        jobType: 'remote',
      },
      {
        title: 'Backend Developer',
        company: 'Another Company',
        location: 'Another City',
        skills: ['Node.js', 'Express', 'MongoDB'],
        jobType: 'onsite',
      },
    ]);
  });

  afterAll(async () => {
    // Clean up test database
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Job.deleteMany({});
    
    // Disconnect from test database
    await mongoose.disconnect();
  });

  it('should return job recommendations', async () => {
    // Mock the OpenAI API response
    (getJobRecommendations as jest.Mock).mockResolvedValue([
      {
        job: 'Frontend Developer',
        company: 'Test Company',
        reason: 'Matches your React and JavaScript skills',
      },
    ]);
    
    // Make request to the API
    const response = await request(app)
      .post('/api/recommend')
      .set('Authorization', `Bearer ${token}`)
      .send();
    
    // Check response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('recommendations');
    expect(response.body.recommendations).toBeInstanceOf(Array);
    expect(response.body.recommendations.length).toBeGreaterThan(0);
    expect(response.body.recommendations[0]).toHaveProperty('job');
    expect(response.body.recommendations[0]).toHaveProperty('company');
    expect(response.body.recommendations[0]).toHaveProperty('reason');
  });

  it('should return 401 if not authenticated', async () => {
    const response = await request(app)
      .post('/api/recommend')
      .send();
    
    expect(response.status).toBe(401);
  });
});
