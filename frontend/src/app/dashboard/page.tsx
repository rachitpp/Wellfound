'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import JobCard from '@/components/JobCard';
import RecommendationCard from '@/components/RecommendationCard';
import EmptyState from '@/components/EmptyState';
import { getCurrentUser } from '@/lib/authService';
import { getCurrentProfile } from '@/lib/profileService';
import { getAllJobs } from '@/lib/jobService';
import { getRecommendations } from '@/lib/recommendationService';
import { Job } from '@/lib/jobService';
import { Recommendation } from '@/lib/recommendationService';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [hasProfile, setHasProfile] = useState(false);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get current user
        const user = await getCurrentUser();
        if (user) {
          setUserName(user.name);
        }

        // Check if user has profile
        const profile = await getCurrentProfile();
        setHasProfile(!!profile);

        // Get recent jobs
        const jobs = await getAllJobs();
        setRecentJobs(jobs.slice(0, 3)); // Show only 3 recent jobs

        // Get recommendations if profile exists
        if (profile) {
          try {
            const recs = await getRecommendations();
            setRecommendations(recs);
          } catch (error) {
            console.error('Error fetching recommendations:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="space-y-10">
        {/* Welcome section */}
        <section className="bg-gradient-to-r from-primary-600 to-accent-700 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
          <div className="relative z-10">
            <h1 className="font-serif text-3xl font-bold mb-3">Welcome back, {userName || 'User'}!</h1>
            <p className="text-white/90 text-lg">
              {hasProfile
                ? 'Here\'s your personalized job dashboard.'
                : 'Complete your profile to get personalized job recommendations.'}
            </p>
            {!hasProfile && (
              <Button 
                href="/profile"
                variant="secondary"
                size="lg"
                className="mt-6 shadow-lg shadow-accent-600/20"
              >
                Complete Your Profile
              </Button>
            )}
          </div>
        </section>

        {/* Main dashboard content */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Recent Jobs */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">Recent Job Listings</h2>
              <Link href="/jobs" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center transition-colors duration-300">
                View All Jobs
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : recentJobs.length > 0 ? (
              <div className="space-y-5">
                {recentJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onClick={() => router.push(`/jobs/${job._id}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                message="No job listings available at the moment."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
            )}
          </div>

          {/* Recommendations */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">Your Job Matches</h2>
              <Link href="/recommendations" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center transition-colors duration-300">
                View All Matches
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : !hasProfile ? (
              <EmptyState 
                message="Complete your profile to get AI-powered job recommendations."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                }
                actionLabel="Create Profile"
                actionHref="/profile"
                className="p-8 shadow-sm"
              />
            ) : recommendations.length > 0 ? (
              <div className="space-y-5">
                {recommendations.map((rec, index) => (
                  <RecommendationCard
                    key={index}
                    recommendation={rec}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                message="No recommendations available yet."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
