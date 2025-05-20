'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import JobCard from '@/components/JobCard';
import SkeletonJobCard from '@/components/SkeletonJobCard';
import EmptyState from '@/components/EmptyState';
import { getSavedJobs, unsaveJob, SavedJob } from '@/lib/savedJobService';

export default function SavedJobsPage() {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const jobs = await getSavedJobs();
        setSavedJobs(jobs);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleUnsaveJob = async (savedJobId: string) => {
    try {
      const success = await unsaveJob(savedJobId);
      if (success) {
        setSavedJobs((prev) => prev.filter((job) => job._id !== savedJobId));
      }
    } catch (error) {
      console.error('Error removing saved job:', error);
    }
  };

  return (
    <ProtectedRoute>
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
          Saved Jobs
        </h1>

        {isLoading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonJobCard key={i} />
            ))}
          </div>
        ) : savedJobs.length > 0 ? (
          <div className="grid gap-6">
            {savedJobs.map((savedJob) => (
              <JobCard
                key={savedJob._id}
                job={savedJob.job}
                onClick={() => router.push(`/jobs/${savedJob.job._id}`)}
                showDescription={true}
                isSaved={true}
                onSaveToggle={() => handleUnsaveJob(savedJob._id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No saved jobs"
            message="You haven't saved any jobs yet. Browse available jobs and save the ones you're interested in."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            }
            actionLabel="Browse Jobs"
            onAction={() => router.push('/jobs')}
          />
        )}
      </motion.div>
    </ProtectedRoute>
  );
}
