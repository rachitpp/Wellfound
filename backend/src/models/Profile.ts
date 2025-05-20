import mongoose, { Document } from 'mongoose';

export interface IProfile extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  location: string;
  yearsOfExperience: number;
  skills: string[];
  preferredJobType: 'remote' | 'onsite' | 'any';
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Index user field for faster lookups by user ID
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // Index name field for faster name searches
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true, // Index location for faster location-based filtering
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
      index: true, // Index years of experience for range queries
    },
    skills: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, 'At least one skill is required'],
      index: true, // Index skills array for faster skill-based searches
    },
    preferredJobType: {
      type: String,
      required: true,
      enum: ['remote', 'onsite', 'any'],
      default: 'any',
      index: true, // Index preferredJobType for faster job type filtering
    },
  },
  { timestamps: true }
);

// Create compound indexes for common query patterns
profileSchema.index({ createdAt: -1 }); // For sorting by creation date
profileSchema.index({ name: 'text' }); // Text search on profile names
profileSchema.index({ skills: 1, preferredJobType: 1 }); // For skill and job type based searches
profileSchema.index({ yearsOfExperience: 1, skills: 1 }); // For experience and skill based queries

// Ensure unique profile per user
profileSchema.index({ user: 1 }, { unique: true });

export default mongoose.model<IProfile>('Profile', profileSchema);
