import { Request, Response } from 'express';
import Job from '../models/Job';
import Profile from '../models/Profile';
import { getJobRecommendations } from '../utils/aiService';

// @desc    Get AI job recommendations
// @route   POST /api/recommend
// @access  Private
export const getRecommendations = async (req: Request, res: Response) => {
  try {
    // For the test endpoint, we'll return mock data without checking for profile or authentication
    if (req.originalUrl.includes('/test')) {
      console.log('Using test endpoint with mock data');
      const mockRecommendations = [
        {
          job: 'Senior Frontend Developer',
          company: 'TechCorp',
          reason: 'Your React and TypeScript skills match perfectly with this position.'
        },
        {
          job: 'Full Stack Engineer',
          company: 'InnovateTech',
          reason: 'Your experience with both frontend and backend technologies makes you a great fit.'
        },
        {
          job: 'UI/UX Developer',
          company: 'DesignHub',
          reason: 'Your design skills combined with coding abilities are exactly what they need.'
        }
      ];
      return res.json({ recommendations: mockRecommendations });
    }

    // Regular endpoint with authentication
    // Get user profile
    const profile = await Profile.findOne({ user: req.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Please create a profile first.' });
    }

    // Get all jobs
    const jobs = await Job.find();
    
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found in the database.' });
    }

    // Get AI recommendations
    const recommendations = await getJobRecommendations(profile, jobs);
    
    // Return recommendations
    res.json({ recommendations });
  } catch (error) {
    console.error('Error in get recommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
