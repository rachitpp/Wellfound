import api from './api';

export interface ProfileData {
  name: string;
  location: string;
  yearsOfExperience: number;
  skills: string[];
  preferredJobType: 'remote' | 'onsite' | 'any';
}

export interface Profile extends ProfileData {
  _id: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

// Create or update profile
export const createOrUpdateProfile = async (profileData: ProfileData) => {
  const response = await api.post('/profile', profileData);
  return response.data;
};

// Get current user's profile
export const getCurrentProfile = async (): Promise<Profile | null> => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    return null;
  }
};

// Get profile by user ID
export const getProfileByUserId = async (userId: string): Promise<Profile | null> => {
  try {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};
