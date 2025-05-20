import api from './api';
import { Job } from './jobService';
import { mockSavedJobIds, mockJobs } from './mockData';

export interface SavedJob {
  _id: string;
  job: Job;
  user: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Mock saved jobs data for fallback
const mockSavedJobsData: SavedJob[] = [
  {
    _id: 'mock-saved-1',
    job: {
      _id: 'mock-1',
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'New York, NY',
      skills: ['JavaScript', 'React', 'CSS'],
      description: 'Frontend developer role',
      jobType: 'remote',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    user: 'current-user',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Flag to track if we're in fallback mode
let usingSavedJobsFallback = false;

// Get all saved jobs for current user
export const getSavedJobs = async (): Promise<SavedJob[]> => {
  // If we've already determined we need to use fallback data, don't try the API again
  if (usingSavedJobsFallback) {
    return mockSavedJobsData;
  }
  
  try {
    // Use a shorter timeout for this request to fail faster if the API is down
    const response = await api.get('/saved-jobs', { timeout: 3000 });
    
    // Ensure we always return an array
    if (!response || !response.data) {
      console.warn('Saved jobs API returned no data');
      usingSavedJobsFallback = true;
      return mockSavedJobsData;
    }
    
    if (!Array.isArray(response.data)) {
      console.warn('Saved jobs API did not return an array:', response.data);
      usingSavedJobsFallback = true;
      return mockSavedJobsData;
    }
    
    // Reset fallback flag if we successfully got data
    usingSavedJobsFallback = false;
    return response.data;
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    console.warn('Using mock saved jobs data as fallback');
    usingSavedJobsFallback = true;
    return mockSavedJobsData;
  }
};

// Save a job
export const saveJob = async (jobId: string, notes: string = ''): Promise<SavedJob | null> => {
  // If we're in fallback mode, simulate saving a job
  if (usingSavedJobsFallback) {
    console.log('Using fallback mode to save job:', jobId);
    
    // Check if this job is already in our mock saved jobs
    const existingIndex = mockSavedJobsData.findIndex(saved => saved.job._id === jobId);
    if (existingIndex >= 0) {
      // Job already saved in mock data
      return mockSavedJobsData[existingIndex];
    }
    
    // Find the job in our mock jobs
    const mockJob = mockJobs.find(job => job._id === jobId);
    if (!mockJob) {
      // Create a basic mock job if we can't find it
      const newMockJob: Job = {
        _id: jobId,
        title: 'Mock Job',
        company: 'Mock Company',
        location: 'Remote',
        skills: ['JavaScript'],
        description: 'This is a mock job created when the API was unavailable',
        jobType: 'remote',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Create a new saved job entry
      const newSavedJob: SavedJob = {
        _id: `mock-saved-${Date.now()}`,
        job: newMockJob,
        user: 'current-user',
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to our mock data
      mockSavedJobsData.push(newSavedJob);
      return newSavedJob;
    } else {
      // Create a new saved job with the existing mock job
      const newSavedJob: SavedJob = {
        _id: `mock-saved-${Date.now()}`,
        job: mockJob,
        user: 'current-user',
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to our mock data
      mockSavedJobsData.push(newSavedJob);
      return newSavedJob;
    }
  }
  
  // Try the real API first
  try {
    const response = await api.post('/saved-jobs', { jobId, notes }, { timeout: 3000 });
    return response.data;
  } catch (error) {
    console.error('Error saving job:', error);
    
    // Switch to fallback mode and try again
    console.warn('Switching to fallback mode for saving jobs');
    usingSavedJobsFallback = true;
    return saveJob(jobId, notes);
  }
};

// Unsave/remove a job
export const unsaveJob = async (savedJobId: string): Promise<boolean> => {
  // If we're in fallback mode, simulate unsaving a job
  if (usingSavedJobsFallback) {
    console.log('Using fallback mode to unsave job:', savedJobId);
    
    // Find the index of the saved job in our mock data
    const index = mockSavedJobsData.findIndex(saved => 
      saved._id === savedJobId || saved.job._id === savedJobId
    );
    
    // If found, remove it
    if (index >= 0) {
      mockSavedJobsData.splice(index, 1);
      return true;
    }
    
    return false;
  }
  
  // Try the real API first
  try {
    await api.delete(`/saved-jobs/${savedJobId}`, { timeout: 3000 });
    return true;
  } catch (error) {
    console.error('Error removing saved job:', error);
    
    // Switch to fallback mode and try again
    console.warn('Switching to fallback mode for unsaving jobs');
    usingSavedJobsFallback = true;
    return unsaveJob(savedJobId);
  }
};

// Check if a job is saved
export const checkIfJobSaved = async (jobId: string): Promise<string | null> => {
  if (!jobId) {
    console.warn('checkIfJobSaved called with invalid jobId');
    return null;
  }
  
  try {
    const savedJobs = await getSavedJobs();
    
    // Ensure savedJobs is an array before using find
    if (!Array.isArray(savedJobs)) {
      console.warn('getSavedJobs did not return an array:', savedJobs);
      // Use mock data as fallback
      console.warn('Using mock saved job data as fallback due to invalid response');
      return mockSavedJobIds[jobId] ? jobId : null;
    }
    
    // Safely check if job is saved
    const savedJob = savedJobs.find(saved => {
      // Handle potential null/undefined values
      if (!saved || !saved.job) return false;
      return saved.job._id === jobId;
    });
    
    return savedJob ? savedJob._id : null;
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    
    // Use mock saved job IDs as fallback when API is unreachable
    console.warn('Using mock saved job data as fallback due to API error');
    return mockSavedJobIds[jobId] ? jobId : null;
  }
};
