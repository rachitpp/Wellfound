import mongoose, { Document } from 'mongoose';

export interface IApplication extends Document {
  user: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';
  appliedDate: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['applied', 'interviewing', 'offered', 'rejected', 'accepted'],
      default: 'applied',
      index: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Create compound index for unique user-job applications
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', applicationSchema);
