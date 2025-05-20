'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SkeletonJobCard from '@/components/SkeletonJobCard';
import { getUserApplications, updateApplicationStatus, Application, ApplicationStatus } from '@/lib/applicationService';
import { isAuthenticated } from '@/lib/authService';

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Check authentication and fetch applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        router.push('/auth/login');
        return;
      }
      
      setIsAuthChecking(false);
      
      try {
        const data = await getUserApplications();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [router]);

  // Function to handle status changes
  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      const updatedApplication = await updateApplicationStatus(applicationId, newStatus);
      if (updatedApplication) {
        setApplications(prev =>
          prev.map(app =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  // Memoize the applications by status for better performance
  const applicationsByStatus = useMemo(() => {
    // Ensure applications is an array before filtering
    const applicationsArray = Array.isArray(applications) ? applications : [];
    
    return {
      applied: applicationsArray.filter(app => app.status === 'applied'),
      interviewing: applicationsArray.filter(app => app.status === 'interviewing'),
      offered: applicationsArray.filter(app => app.status === 'offered'),
      accepted: applicationsArray.filter(app => app.status === 'accepted'),
      rejected: applicationsArray.filter(app => app.status === 'rejected')
    };
  }, [applications]);

  // Status color mapping for visual indicators
  const statusColors = {
    applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    interviewing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    offered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    accepted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  };

  // Application card component
  const ApplicationCard = ({ application }: { application: Application }) => (
    <motion.div
      key={application._id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-gray-100 dark:border-gray-700 p-4 md:p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-medium text-gray-900 dark:text-white">
            {application.job.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {application.job.company} • {application.job.location}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[application.status]}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              Applied on {new Date(application.appliedDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={application.status}
            onChange={(e) => handleStatusChange(application._id, e.target.value as ApplicationStatus)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
            <option value="accepted">Accepted</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  // Show loading spinner while checking authentication
  if (isAuthChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white">My Applications</h1>
          <div className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
            {applications.length} application{applications.length !== 1 ? 's' : ''}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonJobCard key={i} />
            ))}
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-8">
            {/* Active Applications Section */}
            <div>
              <h2 className="text-lg md:text-xl font-serif font-semibold text-gray-900 dark:text-white mb-3">Active Applications</h2>
              <div className="grid gap-4">
                {applicationsByStatus.applied.length > 0 ? (
                  applicationsByStatus.applied.map(app => <ApplicationCard key={app._id} application={app} />)
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 py-4">No active applications.</p>
                )}
              </div>
            </div>

            {/* Interviewing Section */}
            {applicationsByStatus.interviewing.length > 0 && (
              <div>
                <h2 className="text-lg md:text-xl font-serif font-semibold text-gray-900 dark:text-white mb-3">Interviewing</h2>
                <div className="grid gap-4">
                  {applicationsByStatus.interviewing.map(app => <ApplicationCard key={app._id} application={app} />)}
                </div>
              </div>
            )}

            {/* Offers Section */}
            {applicationsByStatus.offered.length > 0 && (
              <div>
                <h2 className="text-lg md:text-xl font-serif font-semibold text-gray-900 dark:text-white mb-3">Offers</h2>
                <div className="grid gap-4">
                  {applicationsByStatus.offered.map(app => <ApplicationCard key={app._id} application={app} />)}
                </div>
              </div>
            )}

            {/* Accepted Section */}
            {applicationsByStatus.accepted.length > 0 && (
              <div>
                <h2 className="text-lg md:text-xl font-serif font-semibold text-gray-900 dark:text-white mb-3">Accepted</h2>
                <div className="grid gap-4">
                  {applicationsByStatus.accepted.map(app => <ApplicationCard key={app._id} application={app} />)}
                </div>
              </div>
            )}

            {/* Rejected Section */}
            {applicationsByStatus.rejected.length > 0 && (
              <div>
                <h2 className="text-lg md:text-xl font-serif font-semibold text-gray-900 dark:text-white mb-3">Rejected</h2>
                <div className="grid gap-4">
                  {applicationsByStatus.rejected.map(app => <ApplicationCard key={app._id} application={app} />)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 md:py-10 bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg md:text-xl font-medium text-gray-900 dark:text-white mb-2">No applications yet</h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-5">
              Track your job applications by clicking &quot;Apply&quot; on any job listing
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow-primary-500/20"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
