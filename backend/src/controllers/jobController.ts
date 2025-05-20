import { Request, Response } from 'express';
import Job from '../models/Job';
import { invalidateJobCache } from '../utils/cacheInvalidation';
import { getPaginationParams, getPaginationMetadata, createFilter, parseSortParams } from '../utils/pagination';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    // Check if pagination is explicitly requested
    const wantsPagination = req.query.paginate === 'true' || req.query.page || req.query.limit;
    
    // Get pagination parameters
    const { page, limit, skip } = getPaginationParams(req);
    
    // Define allowed fields for filtering
    const allowedFields: Record<string, string | { field: string; type?: 'string' | 'number' | 'boolean' | 'array' | 'date' }> = {
      title: { field: 'title', type: 'string' },
      title_like: { field: 'title', type: 'string' },
      company: { field: 'company', type: 'string' },
      company_like: { field: 'company', type: 'string' },
      location: { field: 'location', type: 'string' },
      location_like: { field: 'location', type: 'string' },
      type: { field: 'jobType', type: 'string' },
      minSalary: { field: 'salary.min', type: 'number' },
      maxSalary: { field: 'salary.max', type: 'number' },
      skills: { field: 'skills', type: 'array' },
      skills_all: { field: 'skills', type: 'array' },
      createdAt_gt: { field: 'createdAt', type: 'date' },
      createdAt_lt: { field: 'createdAt', type: 'date' },
    };
    
    // Create filter from query parameters
    const filter = createFilter(allowedFields, req.query);
    
    // Define allowed fields for sorting
    const sortableFields = ['title', 'company', 'location', 'createdAt', 'updatedAt', 'salary.min', 'salary.max'];
    
    // Parse sort parameters
    const sort = parseSortParams(req.query.sort as string, sortableFields);
    
    // Execute query with filter and sorting (with or without pagination)
    let query = Job.find(filter).sort(sort);
    
    // Only apply pagination if explicitly requested
    if (wantsPagination) {
      query = query.skip(skip).limit(limit);
    }
    
    const jobs = await query;
    
    // For backward compatibility, return just the array if pagination is not requested
    if (!wantsPagination) {
      return res.json(jobs);
    }
    
    // Get total count for pagination metadata
    const totalDocs = await Job.countDocuments(filter);
    
    // Generate pagination metadata
    const pagination = getPaginationMetadata(totalDocs, page, limit);
    
    // Return paginated response
    res.json({
      results: jobs,
      pagination
    });
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
    
    // Invalidate job cache after creating a new job
    await invalidateJobCache();
    
    res.json(job);
  } catch (error) {
    console.error('Error in create job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
