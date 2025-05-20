'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import RecommendationCard from '@/components/RecommendationCard';
import JobCard from '@/components/JobCard';
import { getCurrentProfile } from '@/lib/profileService';
import { getRecommendations } from '@/lib/recommendationService';
import { getAllJobs } from '@/lib/jobService';
import { Recommendation } from '@/lib/recommendationService';
import { Job } from '@/lib/jobService';
import { isAuthenticated } from '@/lib/authService';

export default function RecommendationsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  // We don't need this state since we're redirecting if not authenticated
  // const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check authentication first
      if (!isAuthenticated()) {
        router.push('/auth/login');
        return;
      }
      setIsAuthChecking(false);

      try {
        // Load jobs data first
        const jobsData = await getAllJobs();
        setJobs(jobsData);
        console.log('Loaded jobs data:', jobsData.length, 'jobs');
        
        // Then check profile
        const profileData = await getCurrentProfile();
        if (profileData) {
          setHasProfile(true);
          
          // Finally load recommendations
          try {
            const recs = await getRecommendations();
            console.log('Loaded recommendations:', recs);
            setRecommendations(recs);
          } catch (error: Error | unknown) {
            console.error('Error fetching recommendations:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (errorMessage.includes('Authentication required')) {
              router.push('/auth/login');
              setError('Your session has expired. Please log in again.');
            } else {
              setError(errorMessage || 'Failed to load recommendations. Please try again later.');
            }
          }
        } else {
          setHasProfile(false);
        }
      } catch (error: unknown) {
        console.error('Error in recommendations page:', error);
        // Check for authentication errors
        const errorObj = error as { response?: { status?: number } };
        if (errorObj.response && (errorObj.response.status === 401 || errorObj.response.status === 403)) {
          router.push('/auth/login');
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Failed to load data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleGenerateRecommendations = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      // Make sure we have jobs data
      if (jobs.length === 0) {
        const jobsData = await getAllJobs();
        setJobs(jobsData);
      }
      
      // Get recommendations
      const recs = await getRecommendations();
      console.log('Generated new recommendations:', recs);
      setRecommendations(recs);
    } catch (error: unknown) {
      console.error('Error generating recommendations:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage || 'Failed to generate recommendations. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Find the full job details based on job title and company with fuzzy matching
  const findMatchingJob = (title: string, company: string): Job | undefined => {
    // First try exact match
    let match = jobs.find(job => 
      job.title.toLowerCase() === title.toLowerCase() && 
      job.company.toLowerCase() === company.toLowerCase()
    );
    
    if (match) return match;
    
    // Try partial match on title and company
    match = jobs.find(job => 
      job.title.toLowerCase().includes(title.toLowerCase()) && 
      job.company.toLowerCase().includes(company.toLowerCase())
    );
    
    if (match) return match;
    
    // Try matching just by title
    match = jobs.find(job => 
      job.title.toLowerCase() === title.toLowerCase() ||
      job.title.toLowerCase().includes(title.toLowerCase()) ||
      title.toLowerCase().includes(job.title.toLowerCase())
    );
    
    return match;
  };

  // Show loading spinner while checking authentication
  if (isAuthChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white">Your Job Recommendations</h1>
        
        {hasProfile && (
          <Button
            onClick={handleGenerateRecommendations}
            disabled={isGenerating}
            isLoading={isGenerating}
            variant="primary"
            size="sm"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          >
            Refresh Recommendations
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : !hasProfile ? (
        <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <div className="mb-5 flex justify-center">
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-semibold mb-3 text-gray-900 dark:text-white">Complete Your Profile</h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-5">
            To get personalized job recommendations, you need to create your professional profile first.
            Add your skills, experience, and job preferences to help our AI find the best matches for you.
          </p>
          <Button
            href="/profile"
            variant="primary"
            size="md"
          >
            Create Profile
          </Button>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
          <Button
            onClick={handleGenerateRecommendations}
            variant="outline"
            size="sm"
            className="mt-3"
            isLoading={isGenerating}
          >
            Try again
          </Button>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid gap-4">
          {recommendations.map((rec, index) => {
            // Ensure recommendation has all required fields
            const recommendation = {
              job: rec.job || 'Unknown Job',
              company: rec.company || 'Unknown Company',
              reason: rec.reason || 'This job matches your skills and experience.'
            };
            
            const matchingJob = findMatchingJob(recommendation.job, recommendation.company);
            
            return (
              <div key={index} className="space-y-3">
                <RecommendationCard
                  recommendation={recommendation}
                  onClick={matchingJob ? () => router.push(`/jobs/${matchingJob._id}`) : undefined}
                />
                
                {matchingJob && (
                  <div className="ml-4 border-l-2 border-primary-300 dark:border-primary-700 pl-3">
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                      Job Details:
                    </div>
                    <JobCard
                      job={matchingJob}
                      onClick={() => router.push(`/jobs/${matchingJob._id}`)}
                      showDescription={false}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Recommendations Yet"
          message="We don't have any job recommendations for you yet. Click the button below to generate your personalized job matches."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
          actionLabel={isGenerating ? 'Generating...' : 'Generate Recommendations'}
          onAction={handleGenerateRecommendations}
          className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
        />
      )}
    </div>
  );
}
