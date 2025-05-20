'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SkeletonJobCard from '@/components/SkeletonJobCard';
import { getUserApplications, Application } from '@/lib/applicationService';
import { isAuthenticated } from '@/lib/authService';

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Check authentication and fetch applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Check if user is authenticated
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          router.push('/auth/login');
          return;
        }
        
        setIsAuthChecking(false);
        
        // Fetch applications
        const data = await getUserApplications();
        console.log('Fetched applications:', data);
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [router]);

  const activeStatusStyle = 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
  
  const activeIcon = (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
    </svg>
  );

  const ApplicationCard = ({ application }: { application: Application }) => (
    <motion.div
      key={application._id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 p-4 md:p-5 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 pt-2">
        <div className="flex-grow">
          <div className="flex items-start gap-3">
            <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex-shrink-0 mt-1">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                {application.job.company.charAt(0)}
              </span>
            </div>
            
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {application.job.title}
              </h3>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {application.job.company} • {application.job.location}
              </p>
              
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium ${activeStatusStyle}`}>
                  {activeIcon}
                  Active Application
                </span>
                <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(application.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              
              {application.notes && (
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md border border-gray-200 dark:border-gray-600">
                  <p className="line-clamp-2">{application.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link 
            href={`/jobs/${application.job._id}`}
            className="text-sm text-center font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 py-2 px-4 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border border-primary-200 dark:border-primary-800"
          >
            View Job Details
          </Link>
        </div>
      </div>
    </motion.div>
  );

  if (isAuthChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <motion.div
        className="space-y-4 sm:space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* The section with the Applications title and description has been removed */}

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonJobCard key={i} />
            ))}
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-6">
            {/* Two sections side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Stats section */}
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col justify-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{applications.length}</div>
                <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Active Applications</div>
              </div>
              
              {/* Section header */}
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 h-full flex items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-base sm:text-lg md:text-xl font-serif font-bold text-gray-900 dark:text-white">Your Applications</h2>
                </div>
              </div>
            </div>
            
            {/* Applications list */}
            <div className="grid gap-3 sm:gap-4">
              {applications.map(app => <ApplicationCard key={app._id} application={app} />)}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 md:py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 mx-auto mb-6 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">No applications yet</h3>
            <p className="text-base font-medium text-gray-700 dark:text-gray-300 max-w-md mx-auto mb-6">
              Track your job applications by clicking &quot;Apply&quot; on any job listing. Start building your career today!
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center px-5 py-3 bg-primary-600 text-white text-base font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow-primary-500/20"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
