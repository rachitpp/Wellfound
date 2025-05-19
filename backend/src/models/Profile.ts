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
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    skills: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, 'At least one skill is required'],
    },
    preferredJobType: {
      type: String,
      required: true,
      enum: ['remote', 'onsite', 'any'],
      default: 'any',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>('Profile', profileSchema);
