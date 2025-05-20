import { Request, Response } from 'express';
import SavedJob from '../models/SavedJob';
import Job from '../models/Job';
import { invalidateCache } from '../utils/cacheInvalidation';
import mongoose from 'mongoose';
import { getPaginationParams, preparePaginationResponse } from '../utils/pagination';

// Get all saved jobs for current user
export const getSavedJobs = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const paginationParams = getPaginationParams(req);
    
    // Build the query
    const query = { user: new mongoose.Types.ObjectId(userId) };
    
    // Get total count for pagination
    const totalDocs = await SavedJob.countDocuments(query);
    
    // Query with pagination, sorting and populate job details
    const savedJobs = await SavedJob.find(query)
      .sort({ createdAt: -1 })
      .skip(paginationParams.skip)
      .limit(paginationParams.limit)
      .populate('job');
    
    // Return with pagination metadata
    return res.json(preparePaginationResponse(savedJobs, { ...paginationParams, totalDocs }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting saved jobs:', error);
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Save a job
export const saveJob = async (req: Request, res: Response) => {
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
    
    // Check if already saved
    const existing = await SavedJob.findOne({ user: userId, job: jobId });
    if (existing) {
      return res.status(400).json({ message: 'Job already saved' });
    }
    
    // Create new saved job
    const savedJob = new SavedJob({
      user: userId,
      job: jobId,
      notes,
    });
    
    await savedJob.save();
    
    // Invalidate cache
    await invalidateCache(`user:${userId}:saved-jobs`);
    
    return res.status(201).json(savedJob);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error saving job:', error);
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Get a specific saved job
export const getSavedJob = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { savedJobId } = req.params;
    
    // Check if savedJobId is valid
    if (!mongoose.Types.ObjectId.isValid(savedJobId)) {
      return res.status(400).json({ message: 'Invalid saved job ID' });
    }
    
    // Find saved job and check ownership
    const savedJob = await SavedJob.findById(savedJobId).populate('job');
    
    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }
    
    // Check ownership
    if (savedJob.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    return res.json(savedJob);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting saved job:', error);
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Update a saved job (notes)
export const updateSavedJob = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { savedJobId } = req.params;
    const { notes } = req.body;
    
    // Check if savedJobId is valid
    if (!mongoose.Types.ObjectId.isValid(savedJobId)) {
      return res.status(400).json({ message: 'Invalid saved job ID' });
    }
    
    // Find saved job and check ownership
    const savedJob = await SavedJob.findById(savedJobId);
    
    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }
    
    // Check ownership
    if (savedJob.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Update notes
    savedJob.notes = notes;
    await savedJob.save();
    
    // Invalidate cache
    await invalidateCache(`user:${userId}:saved-jobs`);
    
    return res.json(savedJob);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating saved job:', error);
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Delete saved job
export const deleteSavedJob = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { savedJobId } = req.params;
    
    // Check if savedJobId is valid
    if (!mongoose.Types.ObjectId.isValid(savedJobId)) {
      return res.status(400).json({ message: 'Invalid saved job ID' });
    }
    
    // Find saved job and check ownership
    const savedJob = await SavedJob.findById(savedJobId);
    
    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }
    
    // Check ownership
    if (savedJob.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Delete saved job
    await SavedJob.findByIdAndDelete(savedJobId);
    
    // Invalidate cache
    await invalidateCache(`user:${userId}:saved-jobs`);
    
    return res.json({ message: 'Saved job removed' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting saved job:', error);
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Check if a job is saved by the current user
export const checkSavedJob = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { jobId } = req.params;
    
    // Check if jobId is valid
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }
    
    // Check if job is saved
    const savedJob = await SavedJob.findOne({ user: userId, job: jobId });
    
    return res.json({
      isSaved: !!savedJob,
      savedJobId: savedJob ? savedJob._id : null
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error checking if job is saved:', error);
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};
