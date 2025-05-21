import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    role: z.enum(['job_seeker', 'employer'], { 
      errorMap: () => ({ message: "Role must be either 'job_seeker' or 'employer'" }) 
    }).optional(),
  }),
});

// Job validation schemas
export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(5, { message: "Job title must be at least 5 characters long" }),
    company: z.string().min(2, { message: "Company name must be at least 2 characters long" }),
    location: z.string().optional(),
    type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote'], {
      errorMap: () => ({ message: "Job type must be one of: full-time, part-time, contract, internship, remote" })
    }),
    description: z.string().min(20, { message: "Job description must be at least 20 characters long" }),
    requirements: z.string().min(20, { message: "Job requirements must be at least 20 characters long" }),
    salary: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      currency: z.string().optional(),
    }).optional(),
    contactEmail: z.string().email({ message: "Invalid contact email format" }).optional(),
    skills: z.array(z.string()).optional(),
  }),
});

export const updateJobSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: "Job ID is required" }),
  }),
  body: z.object({
    title: z.string().min(5, { message: "Job title must be at least 5 characters long" }).optional(),
    company: z.string().min(2, { message: "Company name must be at least 2 characters long" }).optional(),
    location: z.string().optional(),
    type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote'], {
      errorMap: () => ({ message: "Job type must be one of: full-time, part-time, contract, internship, remote" })
    }).optional(),
    description: z.string().min(20, { message: "Job description must be at least 20 characters long" }).optional(),
    requirements: z.string().min(20, { message: "Job requirements must be at least 20 characters long" }).optional(),
    salary: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      currency: z.string().optional(),
    }).optional(),
    contactEmail: z.string().email({ message: "Invalid contact email format" }).optional(),
    skills: z.array(z.string()).optional(),
  }),
});

// Profile validation schemas

// Schema for creating a new profile
export const createProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    location: z.string().min(2, { message: "Location is required" }),
    yearsOfExperience: z.number().min(0, { message: "Experience must be a positive number" }),
    skills: z.array(z.string()).min(1, { message: "At least one skill is required" }),
    preferredJobType: z.enum(['remote', 'onsite', 'any'], { 
      errorMap: () => ({ message: "Job type must be one of: remote, onsite, any" })
    }),
  }),
});

// Schema for updating an existing profile
export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    skills: z.array(z.string()).optional(),
    experience: z.array(z.object({
      title: z.string().min(2, { message: "Job title must be at least 2 characters long" }),
      company: z.string().min(2, { message: "Company name must be at least 2 characters long" }),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })).optional(),
    education: z.array(z.object({
      institution: z.string().min(2, { message: "Institution name must be at least 2 characters long" }),
      degree: z.string().min(2, { message: "Degree must be at least 2 characters long" }),
      field: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().optional(),
    })).optional(),
    // Add fields specific to profile creation/update
    yearsOfExperience: z.number().min(0, { message: "Experience must be a positive number" }).optional(),
    preferredJobType: z.enum(['remote', 'onsite', 'any'], { 
      errorMap: () => ({ message: "Job type must be one of: remote, onsite, any" })
    }).optional(),
  }),
});

// Schema for fetching profile by ID
export const getProfileByIdSchema = z.object({
  params: z.object({
    userId: z.string().min(1, { message: "User ID is required" }),
  }),
});

// Saved Job validation schemas
export const saveJobSchema = z.object({
  body: z.object({
    jobId: z.string().min(1, { message: "Job ID is required" }),
    notes: z.string().optional(),
  }),
});

export const updateSavedJobSchema = z.object({
  params: z.object({
    savedJobId: z.string().min(1, { message: "Saved job ID is required" }),
  }),
  body: z.object({
    notes: z.string(),
  }),
});

export const deleteSavedJobSchema = z.object({
  params: z.object({
    savedJobId: z.string().min(1, { message: "Saved job ID is required" }),
  }),
});

export const checkSavedJobSchema = z.object({
  params: z.object({
    jobId: z.string().min(1, { message: "Job ID is required" }),
  }),
});

// Application validation schemas
export const createApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1, { message: "Job ID is required" }),
    notes: z.string().optional(),
  }),
});

export const updateApplicationSchema = z.object({
  params: z.object({
    applicationId: z.string().min(1, { message: "Application ID is required" }),
  }),
  body: z.object({
    status: z.enum(['applied', 'interviewing', 'offered', 'rejected', 'accepted'], {
      errorMap: () => ({ message: "Status must be one of: applied, interviewing, offered, rejected, accepted" })
    }).optional(),
    notes: z.string().optional(),
  }).refine(data => data.status !== undefined || data.notes !== undefined, {
    message: "At least one field (status or notes) must be provided",
  }),
});

export const deleteApplicationSchema = z.object({
  params: z.object({
    applicationId: z.string().min(1, { message: "Application ID is required" }),
  }),
});

export const getApplicationSchema = z.object({
  params: z.object({
    applicationId: z.string().min(1, { message: "Application ID is required" }),
  }),
});
