import api from './api';

export interface Recommendation {
  job: string;
  company: string;
  reason: string;
}

// Get AI job recommendations
export const getRecommendations = async (): Promise<Recommendation[]> => {
  try {
    // Using the test endpoint that doesn't require authentication
    const response = await api.post('/recommend/test');
    
    // Check if the response has the expected structure
    if (response.data && Array.isArray(response.data.recommendations)) {
      return response.data.recommendations;
    } else if (response.data && Array.isArray(response.data)) {
      // Handle case where recommendations might be directly in the response
      return response.data;
    } else {
      console.error('Unexpected response format:', response.data);
      throw new Error('Received invalid recommendations format from server');
    }
  } catch (error: any) {
    console.error('Error getting recommendations:', error);
    
    // Handle specific error cases
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        throw new Error('Authentication required. Please log in to view recommendations.');
      } else if (error.response.status === 404) {
        throw new Error('Recommendation service not available. Please try again later.');
      }
    }
    
    // Rethrow the error with a more specific message
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to get recommendations');
    }
  }
};
