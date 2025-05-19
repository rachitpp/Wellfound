import { Request, Response } from 'express';
import Profile from '../models/Profile';

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
      return res.json(profile);
    }

    // Create new profile
    profile = new Profile(profileFields);
    await profile.save();
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
    if ((error as any).kind === 'ObjectId') {
      return res.status(404).json({ message: 'Profile not found' });
    }
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
