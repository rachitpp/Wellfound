import api from './api';
import { Job } from './jobService';

export type ApplicationStatus = 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';

export interface Application {
  _id: string;
  job: Job;
  user: string;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Get all applications for the current user
export const getUserApplications = async (): Promise<Application[]> => {
  try {
    const response = await api.get('/applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
};

// Create a new application
export const createApplication = async (
  jobId: string,
  notes: string = ''
): Promise<Application | null> => {
  try {
    const response = await api.post('/applications', {
      jobId,
      notes,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating application:', error);
    return null;
  }
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
    return null;
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
    return null;
  }
};

// Delete an application
export const deleteApplication = async (applicationId: string): Promise<boolean> => {
  try {
    await api.delete(`/applications/${applicationId}`);
    return true;
  } catch (error) {
    console.error('Error deleting application:', error);
    return false;
  }
};
