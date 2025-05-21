import api from './api';
import { jwtDecode } from 'jwt-decode';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface DecodedToken {
  id: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

// Register user
export const register = async (userData: RegisterData) => {
  try {
    console.log('Attempting to register user:', userData.email);
    const response = await api.post('/auth/register', userData);
    
    // Check if this is a mock response from our interceptor
    const isMockResponse = (response as any).mock === true;
    
    if (response.data.token) {
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // If this is a mock response, show a notification
      if (isMockResponse) {
        console.warn('Using mock authentication due to backend connectivity issues');
        // You could add a toast notification here
        localStorage.setItem('using_mock_auth', 'true');
      }
    }
    
    return {
      ...response.data,
      mockAuth: isMockResponse
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const login = async (userData: LoginData) => {
  try {
    console.log('Attempting to login user:', userData.email);
    const response = await api.post('/auth/login', userData);
    
    // Check if this is a mock response from our interceptor
    const isMockResponse = (response as any).mock === true;
    
    if (response.data.token) {
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // If this is a mock response, show a notification
      if (isMockResponse) {
        console.warn('Using mock authentication due to backend connectivity issues');
        // You could add a toast notification here
        localStorage.setItem('using_mock_auth', 'true');
      }
    }
    
    return {
      ...response.data,
      mockAuth: isMockResponse
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
export const logout = () => {
  // Remove token and mock auth flag from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('using_mock_auth');
};

// Get user information from token without making an API call
export const getUserFromToken = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  // Check if we're using mock authentication
  const usingMockAuth = localStorage.getItem('using_mock_auth') === 'true';
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      _id: decoded.id,
      name: decoded.name,
      email: decoded.email
    };
  } catch (error) {
    // If using mock auth but token is invalid, return a generic user
    if (usingMockAuth) {
      console.warn('Using mock user profile due to invalid token format');
      return {
        _id: 'mock_user_id',
        name: 'Mock User',
        email: 'mock@example.com'
      };
    }
    return null;
  }
};

// Get current user from API
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Try to get user from token first for faster response
    const tokenUser = getUserFromToken();
    if (tokenUser) return tokenUser;
    
    // If that fails, make an API call
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    return null;
  }
};

// Check if user is authenticated and token is valid
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // Check if we're using mock authentication
  const usingMockAuth = localStorage.getItem('using_mock_auth') === 'true';
  
  try {
    // Decode and validate token expiration
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    // For mock auth, we don't strictly enforce expiration
    if (decoded.exp < currentTime && !usingMockAuth) {
      // Token has expired, remove it
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch {
    // Invalid token format but allow the session if using mock auth
    if (usingMockAuth) {
      console.warn('Using mock authentication with invalid token format');
      return true;
    }
    
    // Otherwise, clean up and return false
    localStorage.removeItem('token');
    return false;
  }
};
