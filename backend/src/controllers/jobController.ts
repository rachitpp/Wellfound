import { Request, Response } from 'express';
import Job from '../models/Job';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error in get all jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error in get job by ID:', error);
    if ((error as any).kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new job (admin only)
// @route   POST /api/jobs
// @access  Private
export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, company, location, skills, description, jobType } = req.body;

    // Create new job
    const newJob = new Job({
      title,
      company,
      location,
      skills: Array.isArray(skills) ? skills : skills.split(',').map((skill: string) => skill.trim()),
      description,
      jobType,
    });

    const job = await newJob.save();
    res.json(job);
  } catch (error) {
    console.error('Error in create job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
