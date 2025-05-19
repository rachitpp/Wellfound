'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Card from '@/components/Card';
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
      <div className="space-y-8">
        {/* Welcome section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {userName || 'User'}!</h1>
          <p className="opacity-90">
            {hasProfile
              ? 'Here\'s your personalized job dashboard.'
              : 'Complete your profile to get personalized job recommendations.'}
          </p>
          {!hasProfile && (
            <Link 
              href="/profile" 
              className="inline-block mt-4 bg-white text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-50"
            >
              Complete Your Profile
            </Link>
          )}
        </section>

        {/* Main dashboard content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Job Listings</h2>
              <Link href="/jobs" className="text-blue-600 hover:underline text-sm">
                View All Jobs
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <Card
                    key={job._id}
                    title={job.title}
                    subtitle={`${job.company} • ${job.location}`}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/jobs/${job._id}`)}
                  >
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="text-xs text-gray-500">+{job.skills.length - 3} more</span>
                      )}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm text-gray-500 capitalize">{job.jobType}</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-4">No job listings available.</p>
            )}
          </div>

          {/* Recommendations */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Job Matches</h2>
              <Link href="/recommendations" className="text-blue-600 hover:underline text-sm">
                View All Matches
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : !hasProfile ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-600 mb-4">
                  Complete your profile to get AI-powered job recommendations.
                </p>
                <Link
                  href="/profile"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
                >
                  Create Profile
                </Link>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <Card
                    key={index}
                    title={rec.job}
                    subtitle={rec.company}
                  >
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Why it's a match:</span> {rec.reason}
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-4">No recommendations available yet.</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
