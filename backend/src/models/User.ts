import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['job_seeker', 'employer'],
      default: 'job_seeker',
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    // Add more detailed logging
    console.log('Hashing password for user:', this.email);
    
    // Ensure password is a string
    if (typeof this.password !== 'string') {
      console.error('Password is not a string:', typeof this.password);
      throw new Error('Password must be a string');
    }
    
    // Generate salt with a lower cost factor if in production to avoid timeouts
    const saltRounds = process.env.NODE_ENV === 'production' ? 8 : 10;
    const salt = await bcrypt.genSalt(saltRounds);
    
    // Hash the password with a timeout
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully');
    next();
  } catch (error: any) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
