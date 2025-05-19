'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import JobCard from '@/components/JobCard';
import EmptyState from '@/components/EmptyState';
import { getAllJobs } from '@/lib/jobService';
import { Job } from '@/lib/jobService';

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('');

  // Get all unique skills from jobs
  const allSkills = jobs.reduce((skills, job) => {
    job.skills.forEach(skill => {
      if (!skills.includes(skill)) {
        skills.push(skill);
      }
    });
    return skills;
  }, [] as string[]).sort();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await getAllJobs();
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    // Filter jobs based on search term, job type, and selected skill
    let filtered = [...jobs];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        job => 
          job.title.toLowerCase().includes(term) || 
          job.company.toLowerCase().includes(term) || 
          job.location.toLowerCase().includes(term) ||
          job.skills.some(skill => skill.toLowerCase().includes(term))
      );
    }
    
    if (selectedJobType !== 'all') {
      filtered = filtered.filter(job => job.jobType === selectedJobType);
    }
    
    if (selectedSkill) {
      filtered = filtered.filter(job => job.skills.includes(selectedSkill));
    }
    
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedJobType, selectedSkill]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleJobTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedJobType(e.target.value);
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSkill(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedJobType('all');
    setSelectedSkill('');
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Job Listings</h1>
        
        {/* Search and filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedJobType}
                onChange={handleJobTypeChange}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Job Types</option>
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
              
              <select
                value={selectedSkill}
                onChange={handleSkillChange}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Skills</option>
                {allSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              
              <Button
                onClick={handleClearFilters}
                variant="outline"
                size="md"
              >
                Clear Filters
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </div>
        </div>
        
        {/* Job listings */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onClick={() => router.push(`/jobs/${job._id}`)}
                showDescription={true}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching jobs"
            message="No jobs found matching your criteria."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            actionLabel="Clear Filters"
            onAction={handleClearFilters}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
