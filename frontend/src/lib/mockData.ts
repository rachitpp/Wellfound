import { Job } from './jobService';

/**
 * Mock job data to use as a fallback when the API is unreachable
 * This ensures users always see some job listings
 */
export const mockJobs: Job[] = [
  {
    _id: 'mock-1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'New York, NY',
    skills: ['JavaScript', 'React', 'CSS', 'HTML', 'TypeScript'],
    description: 'Looking for an experienced frontend developer to build responsive web applications. You will be working with our design team to implement user interfaces and ensure a seamless user experience across all devices.',
    jobType: 'remote',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-2',
    title: 'Backend Engineer',
    company: 'DataSystems',
    location: 'San Francisco, CA',
    skills: ['Node.js', 'Express', 'MongoDB', 'TypeScript', 'GraphQL'],
    description: 'Join our team to build scalable backend services for our growing platform. You will design and implement APIs, optimize database queries, and ensure high performance of our services.',
    jobType: 'onsite',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-3',
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    location: 'Austin, TX',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Redux'],
    description: 'Looking for a full stack developer who can work on both frontend and backend. You will be responsible for developing and maintaining web applications from database to user interface.',
    jobType: 'hybrid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-4',
    title: 'UI/UX Designer',
    company: 'CreativeMinds',
    location: 'Seattle, WA',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research', 'Prototyping'],
    description: 'Design beautiful and intuitive user interfaces for our web and mobile applications. You will conduct user research, create wireframes, and work closely with developers to implement your designs.',
    jobType: 'remote',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-5',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Chicago, IL',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
    description: 'Help us build and maintain our cloud infrastructure and deployment pipelines. You will automate processes, monitor systems, and ensure the reliability and scalability of our infrastructure.',
    jobType: 'onsite',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-6',
    title: 'Data Scientist',
    company: 'AnalyticsPro',
    location: 'Boston, MA',
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis', 'TensorFlow'],
    description: 'Analyze large datasets and build machine learning models to extract insights. You will work with stakeholders to understand business problems and develop data-driven solutions.',
    jobType: 'hybrid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Mock saved job IDs to use as a fallback
 */
export const mockSavedJobIds: { [key: string]: boolean } = {
  'mock-1': true,
  'mock-3': true,
  'mock-5': true,
};
