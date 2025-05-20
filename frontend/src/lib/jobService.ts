import api from './api';

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
  try {
    // Only add pagination parameters if explicitly provided
    const params = page ? { page, limit: limit || 10 } : {};
    const response = await api.get('/jobs', { params });

    // Handle both response formats: array or paginated object
    const data = response.data;
    
    // If response is an array, return it directly
    if (Array.isArray(data)) {
      return data;
    }
    
    // If response is a paginated object, return the results array
    if (data && Array.isArray(data.results)) {
      return data.results;
    }
    
    // Fallback to empty array if response format is unexpected
    return [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

// Get paginated jobs (with pagination metadata)
export const getPaginatedJobs = async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Job>> => {
  try {
    const response = await api.get('/jobs', { 
      params: { page, limit, paginate: true } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching paginated jobs:', error);
    return { results: [], pagination: { page, limit, totalDocs: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false, nextPage: null, prevPage: null } };
  }
};

// Get job by ID
export const getJobById = async (jobId: string): Promise<Job | null> => {
  try {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

// Create a new job (admin only)
export const createJob = async (jobData: JobData): Promise<Job | null> => {
  try {
    const response = await api.post('/jobs', jobData);
    return response.data;
  } catch (error) {
    return null;
  }
};
