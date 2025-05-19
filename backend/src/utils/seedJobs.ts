import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job';

// Load environment variables
dotenv.config();

// Sample job data
const jobData = [
  {
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'New York, NY',
    skills: ['JavaScript', 'React', 'CSS', 'HTML'],
    description: 'Looking for an experienced frontend developer to build responsive web applications.',
    jobType: 'remote',
  },
  {
    title: 'Backend Engineer',
    company: 'DataSystems',
    location: 'San Francisco, CA',
    skills: ['Node.js', 'Express', 'MongoDB', 'TypeScript'],
    description: 'Join our team to build scalable backend services for our growing platform.',
    jobType: 'onsite',
  },
  {
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    location: 'Austin, TX',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
    description: 'Looking for a full stack developer who can work on both frontend and backend.',
    jobType: 'hybrid',
  },
  {
    title: 'UI/UX Designer',
    company: 'CreativeMinds',
    location: 'Seattle, WA',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research'],
    description: 'Design beautiful and intuitive user interfaces for our web and mobile applications.',
    jobType: 'remote',
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Chicago, IL',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    description: 'Help us build and maintain our cloud infrastructure and deployment pipelines.',
    jobType: 'onsite',
  },
  {
    title: 'Data Scientist',
    company: 'AnalyticsPro',
    location: 'Boston, MA',
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis'],
    description: 'Analyze large datasets and build machine learning models to extract insights.',
    jobType: 'hybrid',
  },
  {
    title: 'Mobile Developer',
    company: 'AppWorks',
    location: 'Los Angeles, CA',
    skills: ['React Native', 'JavaScript', 'iOS', 'Android'],
    description: 'Develop cross-platform mobile applications using React Native.',
    jobType: 'remote',
  },
  {
    title: 'Product Manager',
    company: 'ProductHub',
    location: 'Denver, CO',
    skills: ['Product Management', 'Agile', 'User Stories', 'Roadmapping'],
    description: 'Lead the development of our products from conception to launch.',
    jobType: 'onsite',
  },
  {
    title: 'QA Engineer',
    company: 'QualityFirst',
    location: 'Portland, OR',
    skills: ['Testing', 'Selenium', 'Jest', 'QA Automation'],
    description: 'Ensure the quality of our software through manual and automated testing.',
    jobType: 'hybrid',
  },
  {
    title: 'Security Engineer',
    company: 'SecureTech',
    location: 'Washington, DC',
    skills: ['Cybersecurity', 'Penetration Testing', 'Security Audits'],
    description: 'Help us secure our applications and infrastructure against threats.',
    jobType: 'onsite',
  },
];

// Connect to MongoDB and seed data
async function seedJobs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobmatch');
    console.log('Connected to MongoDB');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert new jobs
    await Job.insertMany(jobData);
    console.log('Successfully seeded job data');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
}

// Run the seed function
seedJobs();
