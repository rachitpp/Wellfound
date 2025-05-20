import api from './api';
import { mockJobs } from './mockData';

// Flag to track if we're in fallback mode
let usingJobsFallback = false;

// Maximum number of API retry attempts
const MAX_RETRY_ATTEMPTS = 2;

export interface JobData {
  title: string;
  company: string;
  location: string;
  skills: string[];
  description?: string;
  jobType: 'remote' | 'onsite' | 'hybrid';
}

export interface Job extends JobData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  pagination: {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

// Get all jobs
export const getAllJobs = async (page?: number, limit?: number): Promise<Job[]> => {
  // If we're already in fallback mode, return mock data immediately
  if (usingJobsFallback) {
    console.log('Using fallback job data (already in fallback mode)');
    return mockJobs;
  }
  
  // Try to fetch jobs from the API with retry logic
  let retryCount = 0;
  
  while (retryCount <= MAX_RETRY_ATTEMPTS) {
    try {
      // Only add pagination parameters if explicitly provided
      const params = page ? { page, limit: limit || 10 } : {};
      
      // Use a shorter timeout for faster failure detection
      console.log('Fetching jobs from API (attempt ' + (retryCount + 1) + ')');
      console.log('Request URL:', '/jobs', 'Params:', params);
      
      const response = await api.get('/jobs', { 
        params,
        timeout: 5000 // 5 second timeout
      });
      
      console.log('API Response status:', response.status);

      // Handle both response formats: array or paginated object
      const data = response.data;
      console.log('Response data type:', typeof data, Array.isArray(data) ? 'is array' : 'not array');
      
      // If response is an array, return it directly
      if (Array.isArray(data)) {
        console.log(`Received ${data.length} jobs as array`);
        // Reset fallback flag on successful API call
        usingJobsFallback = false;
        return data;
      }
      
      // If response is a paginated object, return the results array
      if (data && Array.isArray(data.results)) {
        console.log(`Received ${data.results.length} jobs in paginated format`);
        // Reset fallback flag on successful API call
        usingJobsFallback = false;
        return data.results;
      }
      
      // Log unexpected format
      console.warn('Unexpected response format:', data);
      
      // If we got here, the format was unexpected but not an error
      // Try again if we have retries left
      retryCount++;
      
      if (retryCount > MAX_RETRY_ATTEMPTS) {
        console.warn(`Giving up after ${MAX_RETRY_ATTEMPTS + 1} attempts, using fallback data`);
        usingJobsFallback = true;
        return mockJobs;
      }
      
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error fetching jobs:', error);
      
      // Log detailed error information for debugging
      const err = error as { message?: string; response?: { status?: number; data?: unknown } };
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      
      // Increment retry counter
      retryCount++;
      
      // If we've exhausted our retries, use fallback data
      if (retryCount > MAX_RETRY_ATTEMPTS) {
        console.warn(`Giving up after ${MAX_RETRY_ATTEMPTS + 1} attempts, using fallback data`);
        usingJobsFallback = true;
        return mockJobs;
      }
      
      // Wait a bit before retrying (with exponential backoff)
      const backoffTime = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
      console.log(`Retrying in ${backoffTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  
  // This should never be reached due to the return in the retry loop,
  // but TypeScript needs a return statement here
  return mockJobs;
};

// Get paginated jobs (with pagination metadata)
export const getPaginatedJobs = async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Job>> => {
  // If we're in fallback mode, return mock data in paginated format
  if (usingJobsFallback) {
    console.log('Using fallback paginated job data');
    return { 
      results: mockJobs, 
      pagination: { 
        page, 
        limit, 
        totalDocs: mockJobs.length, 
        totalPages: Math.ceil(mockJobs.length / limit), 
        hasNextPage: page * limit < mockJobs.length, 
        hasPrevPage: page > 1, 
        nextPage: page * limit < mockJobs.length ? page + 1 : null, 
        prevPage: page > 1 ? page - 1 : null 
      } 
    };
  }
  
  try {
    const response = await api.get('/jobs', { 
      params: { page, limit, paginate: true },
      timeout: 5000 // 5 second timeout
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching paginated jobs:', err);
    
    // Switch to fallback mode
    usingJobsFallback = true;
    
    // Return mock data in paginated format
    return { 
      results: mockJobs, 
      pagination: { 
        page, 
        limit, 
        totalDocs: mockJobs.length, 
        totalPages: Math.ceil(mockJobs.length / limit), 
        hasNextPage: page * limit < mockJobs.length, 
        hasPrevPage: page > 1, 
        nextPage: page * limit < mockJobs.length ? page + 1 : null, 
        prevPage: page > 1 ? page - 1 : null 
      } 
    };
  }
};

// Get job by ID
export const getJobById = async (jobId: string): Promise<Job | null> => {
  // If we're in fallback mode, look for the job in mock data
  if (usingJobsFallback) {
    console.log('Using fallback mode to get job by ID:', jobId);
    const mockJob = mockJobs.find(job => job._id === jobId);
    return mockJob || null;
  }
  
  try {
    const response = await api.get(`/jobs/${jobId}`, {
      timeout: 5000 // 5 second timeout
    });
    return response.data;
  } catch (err) {
    console.error(`Error fetching job with ID ${jobId}:`, err);
    
    // Switch to fallback mode
    usingJobsFallback = true;
    
    // Try to find the job in mock data
    const mockJob = mockJobs.find(job => job._id === jobId);
    return mockJob || null;
  }
};

// Create a new job (admin only)
export const createJob = async (jobData: JobData): Promise<Job | null> => {
  try {
    const response = await api.post('/jobs', jobData, {
      timeout: 5000 // 5 second timeout
    });
    return response.data;
  } catch (err) {
    console.error('Error creating job:', err);
    return null;
  }
};
