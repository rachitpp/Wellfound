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

// Get all jobs
export const getAllJobs = async (): Promise<Job[]> => {
  try {
    const response = await api.get('/jobs');
    return response.data;
  } catch (error) {
    return [];
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
