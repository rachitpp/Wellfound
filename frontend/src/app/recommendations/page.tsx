'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import { getCurrentProfile } from '@/lib/profileService';
import { getRecommendations } from '@/lib/recommendationService';
import { getAllJobs } from '@/lib/jobService';
import { Recommendation } from '@/lib/recommendationService';
import { Job } from '@/lib/jobService';

export default function RecommendationsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        setError('Please log in to view recommendations');
        return;
      }

      setIsAuthenticated(true);

      try {
        const profileData = await getCurrentProfile();
        if (profileData) {
          setHasProfile(true);
          
          try {
            const recs = await getRecommendations();
            setRecommendations(recs);
          } catch (error: any) {
            console.error('Error fetching recommendations:', error);
            if (error.message.includes('Authentication required')) {
              setIsAuthenticated(false);
              localStorage.removeItem('token'); // Clear invalid token
              setError('Your session has expired. Please log in again.');
            } else {
              setError(error.message || 'Failed to load recommendations. Please try again later.');
            }
          }
        } else {
          setHasProfile(false);
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setIsAuthenticated(false);
          localStorage.removeItem('token'); // Clear invalid token
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Failed to load profile data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleGenerateRecommendations = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const recs = await getRecommendations();
      setRecommendations(recs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError('Failed to generate recommendations. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Find the full job details based on job title and company
  const findMatchingJob = (title: string, company: string): Job | undefined => {
    return jobs.find(job => 
      job.title.toLowerCase() === title.toLowerCase() && 
      job.company.toLowerCase() === company.toLowerCase()
    );
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Your Job Recommendations</h1>
          
          {hasProfile && (
            <button
              onClick={handleGenerateRecommendations}
              disabled={isGenerating}
              className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                isGenerating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Recommendations
                </>
              )}
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : !hasProfile ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Complete Your Profile</h2>
            <p className="text-gray-600 mb-6">
              To get personalized job recommendations, you need to create your professional profile first.
              Add your skills, experience, and job preferences to help our AI find the best matches for you.
            </p>
            <Link
              href="/profile"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
            >
              Create Profile
            </Link>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <button
              onClick={handleGenerateRecommendations}
              className="mt-4 text-blue-600 hover:underline"
              disabled={isGenerating}
            >
              Try again
            </button>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid gap-6">
            {recommendations.map((rec, index) => {
              const matchingJob = findMatchingJob(rec.job, rec.company);
              
              return (
                <Card
                  key={index}
                  title={rec.job}
                  subtitle={rec.company}
                  className={matchingJob ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
                  onClick={matchingJob ? () => router.push(`/jobs/${matchingJob._id}`) : undefined}
                >
                  <div className="mt-3">
                    <h3 className="font-medium text-gray-900">Why it's a match:</h3>
                    <p className="text-gray-700 mt-1">{rec.reason}</p>
                  </div>
                  
                  {matchingJob && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mt-2">
                        {matchingJob.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {matchingJob.skills.length > 5 && (
                          <span className="text-xs text-gray-500">+{matchingJob.skills.length - 5} more</span>
                        )}
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-sm text-gray-500 capitalize">{matchingJob.jobType}</span>
                        <span className="text-sm text-gray-500">{matchingJob.location}</span>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">No Recommendations Yet</h2>
            <p className="text-gray-600 mb-6">
              We don't have any job recommendations for you yet. Click the button below to generate your personalized job matches.
            </p>
            <button
              onClick={handleGenerateRecommendations}
              disabled={isGenerating}
              className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                isGenerating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? 'Generating...' : 'Generate Recommendations'}
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
