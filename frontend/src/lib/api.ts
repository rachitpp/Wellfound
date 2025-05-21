import axios from 'axios';

// Create axios instance with base URL
// Define both production and development URLs
const PRODUCTION_API_URL = 'https://wellfound-backend.onrender.com/api';
const DEFAULT_API_URL = 'http://localhost:3300/api';
const FALLBACK_API_URLS = [
  PRODUCTION_API_URL, // Try production URL first in fallbacks
  'http://localhost:3000/api',
  'http://localhost:5000/api',
  'http://localhost:8000/api'
];

// Function to check if a URL is reachable
const checkApiUrl = async (url: string): Promise<boolean> => {
  try {
    await axios.get(`${url}/health`, { timeout: 2000 });
    return true;
  } catch {
    // Ignore the error, just return false if we can't reach the URL
    return false;
  }
};

// Determine if we're in a production environment
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

// Use the configured URL, or choose based on environment
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
  (isProduction ? PRODUCTION_API_URL : DEFAULT_API_URL);

// Create axios instance with base URL
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Log configuration for debugging
console.log('API base URL:', apiUrl);

// Try fallback URLs if the main one fails
if (typeof window !== 'undefined') {
  (async () => {
    // Only run this in the browser
    if (!await checkApiUrl(apiUrl)) {
      console.warn(`API at ${apiUrl} is not reachable, trying fallbacks...`);
      
      for (const fallbackUrl of FALLBACK_API_URLS) {
        if (await checkApiUrl(fallbackUrl)) {
          console.log(`Using fallback API URL: ${fallbackUrl}`);
          api.defaults.baseURL = fallbackUrl;
          break;
        }
      }
    }
  })();
}

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (only in browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.warn('Network error encountered, using fallback mechanisms:', error);
      
      // Instead of rejecting with an error, we'll return a special response
      // that indicates we're offline, but won't break the application
      return Promise.resolve({
        data: null,
        status: 0,
        statusText: 'offline',
        headers: {},
        config: error.config || {},
        offline: true, // Custom flag to indicate offline status
      });
    }
    
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response.status === 401) {
      // Clear token if it exists
      if (typeof window !== 'undefined' && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        // Redirect to login page if we're in the browser
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
