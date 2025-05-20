import api from './api';
import { Job } from './jobService';

export interface SavedJob {
  _id: string;
  job: Job;
  user: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Get all saved jobs for current user
export const getSavedJobs = async (): Promise<SavedJob[]> => {
  try {
    const response = await api.get('/saved-jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return [];
  }
};

// Save a job
export const saveJob = async (jobId: string, notes: string = ''): Promise<SavedJob | null> => {
  try {
    const response = await api.post('/saved-jobs', { jobId, notes });
    return response.data;
  } catch (error) {
    console.error('Error saving job:', error);
    return null;
  }
};

// Unsave/remove a job
export const unsaveJob = async (savedJobId: string): Promise<boolean> => {
  try {
    await api.delete(`/saved-jobs/${savedJobId}`);
    return true;
  } catch (error) {
    console.error('Error removing saved job:', error);
    return false;
  }
};

// Check if a job is saved
export const checkIfJobSaved = async (jobId: string): Promise<string | null> => {
  try {
    const savedJobs = await getSavedJobs();
    const savedJob = savedJobs.find(saved => saved.job._id === jobId);
    return savedJob ? savedJob._id : null;
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    return null;
  }
};
