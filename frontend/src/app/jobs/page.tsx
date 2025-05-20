"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import JobCard from "@/components/JobCard";
import SkeletonJobCard from "@/components/SkeletonJobCard";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { getAllJobs } from "@/lib/jobService";
import { Job } from "@/lib/jobService";
import { saveJob, unsaveJob, checkIfJobSaved } from "@/lib/savedJobService";
import { isAuthenticated } from "@/lib/authService";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [savedJobIds, setSavedJobIds] = useState<{ [key: string]: boolean }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5; // Number of jobs to display per page

  // Get all unique skills from jobs using memoization
  const allSkills = useMemo(() => {
    return jobs
      .reduce((skills, job) => {
        job.skills.forEach((skill) => {
          if (!skills.includes(skill)) {
            skills.push(skill);
          }
        });
        return skills;
      }, [] as string[])
      .sort();
  }, [jobs]);

  // Get all unique locations
  // const allLocations = useMemo(() => {
  //   return Array.from(new Set(jobs.map((job) => job.location))).sort();
  // }, [jobs]);

  // Get all unique companies
  // const allCompanies = useMemo(() => {
  //   return Array.from(new Set(jobs.map((job) => job.company))).sort();
  // }, [jobs]);

  const fetchJobs = useCallback(async () => {
    try {
      setError(null); // Clear any previous errors
      const jobsData = await getAllJobs();
      
      // Validate job data
      if (!jobsData || !Array.isArray(jobsData)) {
        console.error('Invalid job data returned from API:', jobsData);
        setError('Received invalid data from the server. Using fallback data.');
        return;
      }
      
      if (jobsData.length === 0) {
        console.warn('No jobs returned from API');
      } else {
        console.log(`Successfully fetched ${jobsData.length} jobs`);
      }
      
      // Filter out any invalid job entries
      const validJobs = jobsData.filter(job => {
        if (!job || typeof job !== 'object' || !job._id) {
          console.warn('Found invalid job in API response:', job);
          return false;
        }
        return true;
      });
      
      setJobs(validJobs);

      // Check which jobs are saved
      const savedStatuses: { [key: string]: boolean } = {};
      for (const job of validJobs) {
        try {
          if (!job._id) continue;
          const isSaved = await checkIfJobSaved(job._id);
          if (isSaved) {
            savedStatuses[job._id] = true;
          }
        } catch (saveError) {
          console.error(`Error checking saved status for job ${job._id}:`, saveError);
          // Continue with other jobs even if one fails
        }
      }
      setSavedJobIds(savedStatuses);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error fetching jobs:", error);
      setError(`Failed to load jobs: ${error.message}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuthAndFetchJobs = async () => {
      try {
        // Check authentication first
        const authenticated = isAuthenticated();
        console.log('Authentication status:', authenticated);
        
        if (!authenticated) {
          router.push('/auth/login');
          return;
        }
        
        setIsAuthChecking(false);
        await fetchJobs();
      } catch (error) {
        console.error('Error in auth check or job fetch:', error);
        setIsAuthChecking(false);
      }
    };

    checkAuthAndFetchJobs();
  }, [fetchJobs, router]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedJobType, selectedSkill]);

  // Use memoization for filtered jobs
  const filteredJobs = useMemo(() => {
    // Log initial state for debugging
    console.log('Filtering jobs:', {
      totalJobs: jobs.length,
      searchTerm,
      selectedJobType,
      selectedSkill
    });

    // If no jobs, return empty array
    if (!jobs.length) return [];

    let filtered = [...jobs];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.location.toLowerCase().includes(term) ||
          job.skills.some((skill) => skill.toLowerCase().includes(term))
      );
      console.log(`After search term filter: ${filtered.length} jobs remaining`);
    }

    if (selectedJobType !== "all") {
      filtered = filtered.filter((job) => job.jobType === selectedJobType);
      console.log(`After job type filter: ${filtered.length} jobs remaining`);
    }

    if (selectedSkill) {
      filtered = filtered.filter((job) => job.skills.includes(selectedSkill));
      console.log(`After skill filter: ${filtered.length} jobs remaining`);
    }

    return filtered;
  }, [jobs, searchTerm, selectedJobType, selectedSkill]);

  // Calculate pagination values
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));

  // Get current page jobs
  const currentJobs = useMemo(() => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    return filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  }, [filteredJobs, currentPage, jobsPerPage]);

  // Handle page change
  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of job listings
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleJobTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedJobType(e.target.value);
    },
    []
  );

  const handleSkillChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedSkill(e.target.value);
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedJobType("all");
    setSelectedSkill("");
    setCurrentPage(1); // Reset to first page when clearing filters
  }, []);

  const toggleSaveJob = useCallback(
    async (jobId: string) => {
      try {
        if (savedJobIds[jobId]) {
          // Job is already saved, so unsave it
          const success = await unsaveJob(jobId);
          if (success) {
            setSavedJobIds((prev) => {
              const updated = { ...prev };
              delete updated[jobId];
              return updated;
            });
            console.log(`Successfully unsaved job ${jobId}`);
          } else {
            console.error(`Failed to unsave job ${jobId}`);
          }
        } else {
          // Job is not saved, so save it
          const savedJob = await saveJob(jobId);
          if (savedJob) {
            setSavedJobIds((prev) => ({
              ...prev,
              [jobId]: true,
            }));
            console.log(`Successfully saved job ${jobId}`);
          } else {
            console.error(`Failed to save job ${jobId}`);
          }
        }
      } catch (err) {
        console.error('Error toggling job save status:', err);
        // Show a toast or notification to the user
      }
    },
    [savedJobIds, setSavedJobIds]
  );

  const handleSaveToggle = useCallback(
    async (jobId: string) => {
      try {
        // toggleSaveJob checks the current saved state internally
        await toggleSaveJob(jobId);
      } catch (error) {
        console.error("Error toggling job save status:", error);
      }
    },
    [toggleSaveJob]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
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
    <motion.div
      className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white">
            Job Listings
          </h1>
          <p className="mt-1 text-base md:text-lg text-gray-600 dark:text-gray-300">
            Find your next opportunity from our curated list of jobs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            leftIcon={
              <AdjustmentsHorizontalIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            }
            className="whitespace-nowrap"
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-xl shadow-subtle border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex-1 space-y-1">
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BriefcaseIcon className="h-4 w-4 text-gray-400" />
                    <BriefcaseIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    value={selectedJobType}
                    onChange={handleJobTypeChange}
                    className="pl-9 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Job Types</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Skills
                </label>
                <select
                  value={selectedSkill}
                  onChange={handleSkillChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Skills</option>
                  {allSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"} found
                {filteredJobs.length > jobsPerPage && ` • ${totalPages} pages`}
              </div>
              <Button
                onClick={handleClearFilters}
                variant="ghost"
                size="xs"
                leftIcon={<XMarkIcon className="h-3 w-3" />}
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>
        )}

        {/* Job listings */}
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(6)].map((_, i) => (
              <SkeletonJobCard key={i} />
            ))}
          </div>
        ) : error ? (
          <motion.div variants={itemVariants}>
            <EmptyState
              title="Error Loading Jobs"
              message={error}
              icon={<XMarkIcon className="h-8 w-8 text-accent-500" />}
              actionLabel="Try Again"
              onAction={() => {
                setIsLoading(true);
                fetchJobs();
              }}
              className="bg-white dark:bg-gray-800 shadow-subtle border border-accent-100 dark:border-accent-900 rounded-xl p-8"
            />
          </motion.div>
        ) : filteredJobs.length > 0 ? (
          <>
            <motion.div className="grid gap-4" variants={containerVariants}>
              {currentJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                >
                  <JobCard
                    job={job}
                    onClick={() => router.push(`/jobs/${job._id}`)}
                    showDescription={true}
                    isSaved={!!savedJobIds[job._id]}
                    onSaveToggle={() => handleSaveToggle(job._id)}
                    className="card-hover"
                  />
                </motion.div>
              ))}
            </motion.div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="py-2"
                />
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Showing {Math.min(filteredJobs.length, (currentPage - 1) * jobsPerPage + 1)} - {Math.min(filteredJobs.length, currentPage * jobsPerPage)} of {filteredJobs.length} jobs
                </div>
              </motion.div>
            )}
          </>
        ) : jobs.length === 0 ? (
          <motion.div variants={itemVariants}>
            <EmptyState
              title="Loading Jobs"
              message="Please wait while we connect to the job database. If this persists, there might be a connection issue."
              icon={<BriefcaseIcon className="h-8 w-8 text-primary-400" />}
              className="bg-white dark:bg-gray-800 shadow-subtle border border-gray-100 dark:border-gray-700 rounded-xl p-8"
            />
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <EmptyState
              title="No matching jobs"
              message="No jobs found matching your criteria. Try adjusting your filters or try a different search term."
              icon={<MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />}
              actionLabel="Clear Filters"
              onAction={handleClearFilters}
              className="bg-white dark:bg-gray-800 shadow-subtle border border-gray-100 dark:border-gray-700 rounded-xl p-8"
            />
          </motion.div>
        )}
    </motion.div>
  );
}
