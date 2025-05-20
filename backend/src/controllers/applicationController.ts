import { Request, Response } from 'express';
import Application from '../models/Application';
import Job from '../models/Job';
import { invalidateCache } from '../utils/cacheInvalidation';
import mongoose from 'mongoose';
import { getPaginationParams, preparePaginationResponse } from '../utils/pagination';

// Get all applications for current user
export const getUserApplications = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const paginationParams = getPaginationParams(req);
    
    // Build the base query
    const query = { user: new mongoose.Types.ObjectId(userId) };
    
    // Add status filter if provided
    if (req.query.status && typeof req.query.status === 'string') {
      const validStatuses = ['applied', 'interviewing', 'offered', 'rejected', 'accepted'];
      if (validStatuses.includes(req.query.status)) {
        (query as Record<string, any>)['status'] = req.query.status;
      }
    }
    
    // Get total count for pagination
    const totalDocs = await Application.countDocuments(query);
    
    // Query with pagination, sorting and populate job details
    const applications = await Application.find(query)
      .sort({ updatedAt: -1 })
      .skip(paginationParams.skip)
      .limit(paginationParams.limit)
      .populate('job');
    
    // Return with pagination metadata
    return res.json(preparePaginationResponse(applications, { ...paginationParams, totalDocs }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting user applications:', error);
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Create a new application
export const createApplication = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { jobId, notes } = req.body;
    
    // Check if jobId is valid
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if already applied
    const existing = await Application.findOne({ user: userId, job: jobId });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    
    // Create new application
    const application = new Application({
      user: userId,
      job: jobId,
      status: 'applied',
      appliedDate: new Date(),
      notes,
    });
    
    await application.save();
    
    // Invalidate cache
    await invalidateCache(`user:${userId}:applications`);
    
    return res.status(201).json(application);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating application:', error);
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Get a specific application
export const getApplication = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { applicationId } = req.params;
    
    // Check if applicationId is valid
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    
    // Find application and check ownership
    const application = await Application.findById(applicationId).populate('job');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check ownership
    if (application.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    return res.json(application);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting application:', error);
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Update application status or notes
export const updateApplication = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { applicationId } = req.params;
    const { status, notes } = req.body;
    
    // Check if applicationId is valid
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    
    // Find application and check ownership
    const application = await Application.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check ownership
    if (application.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Update fields if provided
    if (status) {
      const validStatuses = ['applied', 'interviewing', 'offered', 'rejected', 'accepted'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      application.status = status;
    }
    
    if (notes !== undefined) {
      application.notes = notes;
    }
    
    await application.save();
    
    // Invalidate cache
    await invalidateCache(`user:${userId}:applications`);
    
    return res.json(application);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating application:', error);
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Delete application
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { applicationId } = req.params;
    
    // Check if applicationId is valid
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    
    // Find application and check ownership
    const application = await Application.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check ownership
    if (application.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Delete application
    await Application.findByIdAndDelete(applicationId);
    
    // Invalidate cache
    await invalidateCache(`user:${userId}:applications`);
    
    return res.json({ message: 'Application deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting application:', error);
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};
