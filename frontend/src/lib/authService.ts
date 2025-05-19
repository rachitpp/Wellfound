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
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    // Save token to localStorage
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Login user
export const login = async (userData: LoginData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data.token) {
    // Save token to localStorage
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Logout user
export const logout = () => {
  // Remove token from localStorage
  localStorage.removeItem('token');
};

// Get user information from token without making an API call
export const getUserFromToken = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      _id: decoded.id,
      name: decoded.name,
      email: decoded.email
    };
  } catch {
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
  
  try {
    // Decode and validate token expiration
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      // Token has expired, remove it
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch {
    // Invalid token format
    localStorage.removeItem('token');
    return false;
  }
};
