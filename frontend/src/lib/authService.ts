import api from './api';
import { jwtDecode } from 'jwt-decode';

// We now handle types directly in the function signatures
// These type definitions have been removed as they were unused

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
  
  if (usingMockAuth) {
    // For client-side auth, use the values stored in localStorage directly
    const name = localStorage.getItem('user_name') || 'User';
    const email = localStorage.getItem('user_email') || 'user@example.com';
    const id = localStorage.getItem('user_id') || 'user_' + Math.random().toString(36).substring(2, 10);
    
    console.log('Using client-side auth - user:', name, email);
    
    return {
      _id: id,
      name: name,
      email: email
    };
  }
  
  try {
    // For real JWT tokens, decode them properly
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      _id: decoded.id,
      name: decoded.name,
      email: decoded.email
    };
  } catch (error: unknown) {
    console.warn('Error decoding token:', error);
    // Fallback to a generic user if all else fails
    return {
      _id: 'fallback_user_id',
      name: 'User',
      email: 'user@example.com'
    };
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
  
  // If using client-side authentication, always return true
  const usingMockAuth = localStorage.getItem('using_mock_auth') === 'true';
  if (usingMockAuth) {
    console.log('Using client-side authentication mode');
    return true;
  }
  
  try {
    // Only validate real tokens
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      // Token has expired, remove it
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error: unknown) {
    console.warn('Error validating token:', error);
    
    // Clean up and return false
    localStorage.removeItem('token');
    return false;
  }
};
