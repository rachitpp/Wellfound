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
    skills: ['JavaScript', 'React', 'CSS', 'HTML', 'TypeScript'],
    description: 'Looking for an experienced frontend developer to build responsive web applications. You will be working with our design team to implement user interfaces and ensure a seamless user experience across all devices.',
    jobType: 'remote',
  },
  {
    title: 'Backend Engineer',
    company: 'DataSystems',
    location: 'San Francisco, CA',
    skills: ['Node.js', 'Express', 'MongoDB', 'TypeScript', 'GraphQL'],
    description: 'Join our team to build scalable backend services for our growing platform. You will design and implement APIs, optimize database queries, and ensure high performance of our services.',
    jobType: 'onsite',
  },
  {
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    location: 'Austin, TX',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Redux'],
    description: 'Looking for a full stack developer who can work on both frontend and backend. You will be responsible for developing and maintaining web applications from database to user interface.',
    jobType: 'hybrid',
  },
  {
    title: 'UI/UX Designer',
    company: 'CreativeMinds',
    location: 'Seattle, WA',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research', 'Prototyping'],
    description: 'Design beautiful and intuitive user interfaces for our web and mobile applications. You will conduct user research, create wireframes, and work closely with developers to implement your designs.',
    jobType: 'remote',
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Chicago, IL',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
    description: 'Help us build and maintain our cloud infrastructure and deployment pipelines. You will automate processes, monitor systems, and ensure the reliability and scalability of our infrastructure.',
    jobType: 'onsite',
  },
  {
    title: 'Data Scientist',
    company: 'AnalyticsPro',
    location: 'Boston, MA',
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis', 'TensorFlow'],
    description: 'Analyze large datasets and build machine learning models to extract insights. You will work with stakeholders to understand business problems and develop data-driven solutions.',
    jobType: 'hybrid',
  },
  {
    title: 'Mobile Developer',
    company: 'AppWorks',
    location: 'Los Angeles, CA',
    skills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Redux'],
    description: 'Develop cross-platform mobile applications using React Native. You will be responsible for implementing features, fixing bugs, and ensuring a smooth user experience on all devices.',
    jobType: 'remote',
  },
  {
    title: 'Product Manager',
    company: 'ProductHub',
    location: 'Denver, CO',
    skills: ['Product Management', 'Agile', 'User Stories', 'Roadmapping', 'Analytics'],
    description: 'Lead the development of our products from conception to launch. You will gather requirements, prioritize features, and work with cross-functional teams to deliver high-quality products.',
    jobType: 'onsite',
  },
  {
    title: 'QA Engineer',
    company: 'QualityFirst',
    location: 'Portland, OR',
    skills: ['Testing', 'Selenium', 'Jest', 'QA Automation', 'Cypress'],
    description: 'Ensure the quality of our software through manual and automated testing. You will develop test plans, create automated tests, and work with developers to fix bugs and improve quality.',
    jobType: 'hybrid',
  },
  {
    title: 'Security Engineer',
    company: 'SecureTech',
    location: 'Washington, DC',
    skills: ['Cybersecurity', 'Penetration Testing', 'Security Audits', 'OWASP'],
    description: 'Help us secure our applications and infrastructure against threats. You will conduct security assessments, implement security controls, and respond to security incidents.',
    jobType: 'onsite',
  },
  {
    title: 'Senior React Developer',
    company: 'FrontendMasters',
    location: 'Miami, FL',
    skills: ['React', 'TypeScript', 'Redux', 'Next.js', 'Tailwind CSS'],
    description: 'Join our team as a senior React developer to build modern web applications. You will mentor junior developers, architect solutions, and implement complex features using React and related technologies.',
    jobType: 'remote',
  },
  {
    title: 'Machine Learning Engineer',
    company: 'AIInnovate',
    location: 'San Jose, CA',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'Computer Vision'],
    description: 'Design and implement machine learning models for various applications. You will work on cutting-edge AI solutions, optimize algorithms, and deploy models to production.',
    jobType: 'onsite',
  },
  {
    title: 'Cloud Architect',
    company: 'CloudNative',
    location: 'Atlanta, GA',
    skills: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Microservices', 'Terraform'],
    description: 'Design and implement cloud-native solutions for our clients. You will architect scalable and resilient systems, optimize costs, and ensure best practices in cloud deployments.',
    jobType: 'hybrid',
  },
  {
    title: 'Blockchain Developer',
    company: 'ChainTech',
    location: 'New York, NY',
    skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js', 'Blockchain'],
    description: 'Develop decentralized applications and smart contracts on blockchain platforms. You will implement secure and efficient smart contracts, integrate with frontend applications, and stay up-to-date with blockchain technologies.',
    jobType: 'remote',
  },
  {
    title: 'Technical Project Manager',
    company: 'ProjectPro',
    location: 'Chicago, IL',
    skills: ['Project Management', 'Agile', 'JIRA', 'Technical Background', 'Communication'],
    description: 'Lead technical projects from planning to delivery. You will coordinate with cross-functional teams, manage project timelines, and ensure successful delivery of projects.',
    jobType: 'onsite',
  },
  {
    title: 'Data Engineer',
    company: 'DataFlow',
    location: 'Seattle, WA',
    skills: ['Python', 'SQL', 'Apache Spark', 'ETL', 'Data Warehousing'],
    description: 'Design and implement data pipelines and infrastructure. You will build scalable data solutions, optimize data processing, and ensure data quality and availability.',
    jobType: 'hybrid',
  },
  {
    title: 'AR/VR Developer',
    company: 'ImmersiveTech',
    location: 'Los Angeles, CA',
    skills: ['Unity', 'C#', '3D Modeling', 'AR/VR', 'WebXR'],
    description: 'Create immersive augmented and virtual reality experiences. You will develop AR/VR applications, optimize performance, and push the boundaries of immersive technologies.',
    jobType: 'remote',
  },
  {
    title: 'Site Reliability Engineer',
    company: 'ReliableSystems',
    location: 'Austin, TX',
    skills: ['Linux', 'Kubernetes', 'Monitoring', 'Automation', 'Incident Response'],
    description: 'Ensure the reliability and performance of our systems. You will implement monitoring solutions, automate operations, and respond to incidents to maintain high availability.',
    jobType: 'onsite',
  },
  {
    title: 'UX Researcher',
    company: 'UserInsight',
    location: 'San Francisco, CA',
    skills: ['User Research', 'Usability Testing', 'Data Analysis', 'Interviewing', 'Prototyping'],
    description: 'Conduct user research to inform product decisions. You will plan and execute user studies, analyze results, and provide actionable insights to improve user experience.',
    jobType: 'hybrid',
  },
  {
    title: 'Technical Writer',
    company: 'DocuTech',
    location: 'Portland, OR',
    skills: ['Technical Writing', 'Documentation', 'Markdown', 'API Documentation', 'Content Strategy'],
    description: 'Create clear and comprehensive technical documentation. You will work with developers to document APIs, write user guides, and ensure documentation is accurate and up-to-date.',
    jobType: 'remote',
  },
  {
    title: 'Game Developer',
    company: 'GameCraft',
    location: 'Boston, MA',
    skills: ['Unity', 'C#', 'Game Design', '3D Modeling', 'Animation'],
    description: 'Develop engaging games for various platforms. You will implement game mechanics, optimize performance, and collaborate with artists and designers to create immersive gaming experiences.',
    jobType: 'onsite',
  },
  {
    title: 'Embedded Systems Engineer',
    company: 'IoTSolutions',
    location: 'Denver, CO',
    skills: ['C/C++', 'Embedded Systems', 'IoT', 'Firmware', 'Hardware Integration'],
    description: 'Design and develop firmware for embedded systems and IoT devices. You will work with hardware engineers to integrate software with hardware components and optimize performance.',
    jobType: 'hybrid',
  },
  {
    title: 'Cybersecurity Analyst',
    company: 'SecureDefense',
    location: 'Washington, DC',
    skills: ['Security Analysis', 'Threat Detection', 'Incident Response', 'SIEM', 'Vulnerability Assessment'],
    description: 'Monitor and protect our systems from security threats. You will analyze security incidents, implement security controls, and develop security policies and procedures.',
    jobType: 'remote',
  },
  {
    title: 'Database Administrator',
    company: 'DataGuard',
    location: 'Phoenix, AZ',
    skills: ['SQL', 'PostgreSQL', 'MySQL', 'Database Optimization', 'Backup and Recovery'],
    description: 'Manage and optimize our database systems. You will ensure data availability, implement backup and recovery procedures, and optimize database performance.',
    jobType: 'onsite',
  },
  {
    title: 'Network Engineer',
    company: 'NetConnect',
    location: 'Dallas, TX',
    skills: ['Networking', 'Cisco', 'Routing', 'Switching', 'Network Security'],
    description: 'Design and implement network infrastructure. You will configure network devices, troubleshoot network issues, and ensure network security and performance.',
    jobType: 'hybrid',
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
