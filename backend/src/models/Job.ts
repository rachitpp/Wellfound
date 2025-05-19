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
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, 'At least one skill is required'],
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
    },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>('Job', jobSchema);
