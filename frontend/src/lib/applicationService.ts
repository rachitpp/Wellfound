import api from './api';
import { Job } from './jobService';
import { mockJobs } from './mockData';
import { v4 as uuidv4 } from 'uuid';

// Store mock applications in localStorage to persist them between page refreshes
const MOCK_APPLICATIONS_KEY = 'wellfound_mock_applications';

export type ApplicationStatus = 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';

export interface Application {
  _id: string;
  job: Job; // This must be a non-null Job
  user: string;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Helper functions to get and save mock applications to localStorage
const getMockApplications = (): Application[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(MOCK_APPLICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading mock applications from localStorage:', error);
    return [];
  }
};

const saveMockApplications = (applications: Application[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(MOCK_APPLICATIONS_KEY, JSON.stringify(applications));
  } catch (error) {
    console.error('Error saving mock applications to localStorage:', error);
  }
};

// Get all applications for the current user
export const getUserApplications = async (): Promise<Application[]> => {
  try {
    // Try to get applications from the API
    const response = await api.get('/applications');
    
    // Ensure apiApplications is always an array
    const apiApplications = Array.isArray(response.data) ? response.data : 
                          (response.data && response.data.data ? response.data.data : []);
    
    console.log('API applications:', apiApplications);
    
    // Also get any mock applications from localStorage
    const mockApplications = getMockApplications();
    console.log('Mock applications:', mockApplications);
    
    // Combine API applications with mock applications
    // Use a Map to avoid duplicates based on _id
    const applicationMap = new Map<string, Application>();
    
    // Add API applications to the map if it's an array
    if (Array.isArray(apiApplications)) {
      apiApplications.forEach((app: Application) => {
        if (app && app._id) {
          applicationMap.set(app._id, app);
        }
      });
    }
    
    // Add mock applications to the map (will overwrite API applications with same ID if any)
    mockApplications.forEach((app: Application) => {
      if (app && app._id) {
        applicationMap.set(app._id, app);
      }
    });
    
    // Convert map values back to array
    const result = Array.from(applicationMap.values());
    console.log('Combined applications:', result);
    return result;
  } catch (error) {
    console.error('Error fetching applications:', error);
    console.log('Using fallback mechanism for fetching applications');
    
    // Return mock applications if API is unreachable
    const mockApps = getMockApplications();
    console.log('Fallback applications:', mockApps);
    return mockApps;
  }
};

// Create a new application
export const createApplication = async (
  jobId: string,
  notes: string = ''
): Promise<Application | null> => {
  // Fire and forget API call
  try {
    api.post('/applications', { jobId, notes });
  } catch (_err) {
    // Ignore errors, just log that we're using fallback
    console.log('API call failed, using fallback');
  }

  // Get job data - first try API, then fallback to mock data
  let jobData: Job;

  // Try to get from API
  try {
    const response = await api.get(`/jobs/${jobId}`);
    if (response.data && response.data._id) {
      jobData = response.data;
    } else {
      throw new Error('Invalid job data from API');
    }
  } catch (_error) {
    // Ignore specific error details, just log that we're using fallback
    console.log('Could not get job from API, using fallback');
    
    // Try to find in mock data
    const mockJob = mockJobs.find(job => job._id === jobId);
    
    if (mockJob) {
      jobData = mockJob;
    } else {
      // Create a generic job as last resort
      jobData = {
        _id: jobId,
        title: 'Job Position',
        company: 'Company',
        location: 'Remote',
        description: 'Job description not available',
        skills: [],
        jobType: 'remote',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  // Now jobData is guaranteed to be a valid Job
  const mockApplication: Application = {
    _id: `mock-app-${uuidv4()}`,
    job: jobData,
    user: 'current-user',
    status: 'applied',
    appliedDate: new Date().toISOString(),
    notes: notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Save to localStorage
  const mockApplications = getMockApplications();
  mockApplications.push(mockApplication);
  saveMockApplications(mockApplications);
  
  console.log('Created application:', mockApplication);
  return mockApplication;
};

// Update application status
export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus
): Promise<Application | null> => {
  try {
    const response = await api.patch(`/applications/${applicationId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    console.log('Using fallback mechanism for updating application status');
    
    // Get mock applications from localStorage
    const mockApplications = getMockApplications();
    
    // Find the application in mock data
    const appIndex = mockApplications.findIndex(app => app._id === applicationId);
    
    if (appIndex === -1) {
      console.error('Application not found in mock data');
      return null;
    }
    
    // Update the application status
    mockApplications[appIndex].status = status;
    mockApplications[appIndex].updatedAt = new Date().toISOString();
    
    // Save updated applications back to localStorage
    saveMockApplications(mockApplications);
    
    return mockApplications[appIndex];
  }
};

// Update application notes
export const updateApplicationNotes = async (
  applicationId: string,
  notes: string
): Promise<Application | null> => {
  try {
    const response = await api.patch(`/applications/${applicationId}`, {
      notes,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating application notes:', error);
    console.log('Using fallback mechanism for updating application notes');
    
    // Get mock applications from localStorage
    const mockApplications = getMockApplications();
    
    // Find the application in mock data
    const appIndex = mockApplications.findIndex(app => app._id === applicationId);
    
    if (appIndex === -1) {
      console.error('Application not found in mock data');
      return null;
    }
    
    // Update the application notes
    mockApplications[appIndex].notes = notes;
    mockApplications[appIndex].updatedAt = new Date().toISOString();
    
    // Save updated applications back to localStorage
    saveMockApplications(mockApplications);
    
    return mockApplications[appIndex];
  }
};

// Delete an application
export const deleteApplication = async (applicationId: string): Promise<boolean> => {
  try {
    await api.delete(`/applications/${applicationId}`);
    return true;
  } catch (error) {
    console.error('Error deleting application:', error);
    console.log('Using fallback mechanism for deleting application');
    
    // Get mock applications from localStorage
    const mockApplications = getMockApplications();
    
    // Find the application in mock data
    const appIndex = mockApplications.findIndex(app => app._id === applicationId);
    
    if (appIndex === -1) {
      console.error('Application not found in mock data');
      return false;
    }
    
    // Remove the application from mock data
    mockApplications.splice(appIndex, 1);
    
    // Save updated applications back to localStorage
    saveMockApplications(mockApplications);
    
    return true;
  }
};
