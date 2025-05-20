import mongoose, { Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  skills: string[];
  description?: string;
  jobType: 'remote' | 'onsite' | 'hybrid';
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // Add index for faster queries on title
    },
    company: {
      type: String,
      required: true,
      trim: true,
      index: true, // Add index for faster queries on company
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true, // Add index for faster queries on location
    },
    skills: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, 'At least one skill is required'],
      index: true, // Add index for faster queries on skills
    },
    description: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      required: true,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'onsite',
      index: true, // Add index for faster queries on jobType
    },
    // Add salary field with index for range queries
    salary: {
      min: {
        type: Number,
        index: true,
      },
      max: {
        type: Number,
        index: true,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
  },
  { timestamps: true }
);

// Create compound indexes for common query patterns
jobSchema.index({ createdAt: -1 }); // For sorting by creation date
jobSchema.index({ title: 'text', description: 'text' }); // Text search on title and description
jobSchema.index({ jobType: 1, location: 1 }); // For filtering by jobType and location
jobSchema.index({ skills: 1, jobType: 1 }); // For skill-based job searches

export default mongoose.model<IJob>('Job', jobSchema);
