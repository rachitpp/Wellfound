import { Request, Response } from 'express';
import Profile from '../models/Profile';
import { invalidateProfileCache } from '../utils/cacheInvalidation';
import { getPaginationParams, getPaginationMetadata, createFilter, parseSortParams } from '../utils/pagination';

// @desc    Create or update user profile
// @route   POST /api/profile
// @access  Private
export const createOrUpdateProfile = async (req: Request, res: Response) => {
  try {
    const { name, location, yearsOfExperience, skills, preferredJobType } = req.body;

    // Build profile object
    const profileFields = {
      user: req.userId,
      name,
      location,
      yearsOfExperience,
      skills: Array.isArray(skills) ? skills : skills.split(',').map((skill: string) => skill.trim()),
      preferredJobType,
    };

    // Check if profile exists
    let profile = await Profile.findOne({ user: req.userId });

    if (profile) {
      // Update profile
      profile = await Profile.findOneAndUpdate(
        { user: req.userId },
        { $set: profileFields },
        { new: true }
      );
      // Invalidate cache for this profile
      if (req.userId) {
        await invalidateProfileCache(req.userId);
      }
      return res.json(profile);
    }

    // Create new profile
    profile = new Profile(profileFields);
    await profile.save();
    
    // Invalidate cache for this profile
    if (req.userId) {
      await invalidateProfileCache(req.userId);
    }
    res.json(profile);
  } catch (error) {
    console.error('Error in create/update profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get profile by user ID
// @route   GET /api/profile/:userId
// @access  Public
export const getProfileByUserId = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error in get profile by ID:', error);
    return res.status(404).json({ message: 'Profile not found' });
  }
};

// @desc    Get all profiles (with pagination, filtering, and sorting)
// @route   GET /api/profile/all
// @access  Public
export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    // Get pagination parameters
    const { page, limit, skip } = getPaginationParams(req);
    
    // Define allowed fields for filtering
    const allowedFields: Record<string, string | { field: string; type?: 'string' | 'number' | 'boolean' | 'array' | 'date' }> = {
      name: { field: 'name', type: 'string' },
      name_like: { field: 'name', type: 'string' },
      location: { field: 'location', type: 'string' },
      location_like: { field: 'location', type: 'string' },
      yearsOfExperience_gt: { field: 'yearsOfExperience', type: 'number' },
      yearsOfExperience_lt: { field: 'yearsOfExperience', type: 'number' },
      skills: { field: 'skills', type: 'array' },
      skills_all: { field: 'skills', type: 'array' },
      createdAt_gt: { field: 'createdAt', type: 'date' },
      createdAt_lt: { field: 'createdAt', type: 'date' },
      preferredJobType: { field: 'preferredJobType', type: 'string' },
    };
    
    // Create filter from query parameters
    const filter = createFilter(allowedFields, req.query);
    
    // Define allowed fields for sorting
    const sortableFields = ['name', 'location', 'yearsOfExperience', 'createdAt', 'updatedAt'];
    
    // Parse sort parameters
    const sort = parseSortParams(req.query.sort as string, sortableFields);
    
    // Execute query with filter, pagination, and sorting
    const profiles = await Profile.find(filter)
      .select('-user') // Exclude sensitive user reference
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination metadata
    const totalDocs = await Profile.countDocuments(filter);
    
    // Generate pagination metadata
    const pagination = getPaginationMetadata(totalDocs, page, limit);
    
    // Return paginated response
    res.json({
      results: profiles,
      pagination
    });
  } catch (error) {
    console.error('Error in get all profiles:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user's profile
// @route   GET /api/profile
// @access  Private
export const getCurrentProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findOne({ user: req.userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error in get current profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
