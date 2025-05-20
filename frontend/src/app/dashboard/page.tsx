"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import JobCard from "@/components/JobCard";
import RecommendationCard from "@/components/RecommendationCard";
import EmptyState from "@/components/EmptyState";
import { getCurrentUser, isAuthenticated } from "@/lib/authService";
import { getCurrentProfile } from "@/lib/profileService";
import { getAllJobs } from "@/lib/jobService";
import { getRecommendations } from "@/lib/recommendationService";
import { Job } from "@/lib/jobService";
import { Recommendation } from "@/lib/recommendationService";
import {
  BriefcaseIcon,
  SparklesIcon,
  ArrowRightIcon,
  UserIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    setIsAuthChecking(false);
    
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
            console.error("Error fetching recommendations:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  // Show loading spinner while checking authentication
  if (isAuthChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <motion.div
      className="space-y-5 md:space-y-7 max-w-7xl mx-auto px-4 sm:px-6 py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
        {/* Welcome section */}
        <motion.section
          className="relative overflow-hidden w-full"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-700 rounded-2xl" />
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-300 rounded-full mix-blend-soft-light filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-300 rounded-full mix-blend-soft-light filter blur-3xl opacity-50 animate-blob animation-delay-2000" />

          <div className="relative glass-effect bg-white/10 m-0.5 p-5 md:p-7 rounded-2xl z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div>
                <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                  Welcome back,{" "}
                  <span className="text-accent-300">{userName || "User"}</span>!
                </h1>
                <p className="text-white/90 text-base md:text-lg max-w-lg">
                  {hasProfile
                    ? "Here's your personalized job dashboard with recommendations tailored to your profile."
                    : "Complete your profile to get personalized job recommendations based on your skills and preferences."}
                </p>
              </div>

              {!hasProfile && (
                <div className="flex-shrink-0">
                  <Button
                    href="/profile"
                    variant="light"
                    size="lg"
                    rightIcon={<ArrowRightIcon className="h-5 w-5" />}
                    className="shadow-lg shadow-black/10 hover:shadow-xl"
                  >
                    Complete Your Profile
                  </Button>
                </div>
              )}
            </div>

            {hasProfile && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                <div className="bg-white/10 rounded-lg p-3 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-md">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white/80 text-xs md:text-sm font-medium">
                      Profile Status
                    </h3>
                    <p className="text-white text-sm md:text-base font-medium">Complete</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-md">
                    <DocumentTextIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white/80 text-xs md:text-sm font-medium">
                      Job Recommendations
                    </h3>
                    <p className="text-white text-sm md:text-base font-medium">
                      {recommendations.length} Available
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-md">
                    <ClipboardDocumentCheckIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white/80 text-xs md:text-sm font-medium">
                      Activity Status
                    </h3>
                    <p className="text-white text-sm md:text-base font-medium">Active</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Main dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7">
          {/* Recent Jobs */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-xl shadow-subtle border border-gray-100 dark:border-gray-700 h-full flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <BriefcaseIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-base md:text-lg font-serif font-semibold text-gray-900 dark:text-white">
                  Recent Job Listings
                </h2>
              </div>
              <Link
                href="/jobs"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-xs md:text-sm flex items-center gap-1 transition-colors duration-300 py-1 px-2 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20"
              >
                View All
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-5">
                <div className="relative w-10 h-10">
                  <div className="absolute top-0 h-10 w-10 rounded-full border-t-2 border-b-2 border-primary-500 animate-spin"></div>
                  <div className="absolute top-1 left-1 h-8 w-8 rounded-full border-r-2 border-l-2 border-accent-500 animate-spin"></div>
                </div>
              </div>
            ) : recentJobs.length > 0 ? (
              <div className="space-y-3 flex-grow">
                {recentJobs.map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                  >
                    <JobCard
                      job={job}
                      onClick={() => router.push(`/jobs/${job._id}`)}
                      className="card-hover"
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                message="No job listings available at the moment."
                icon={<BriefcaseIcon className="h-6 w-6 text-gray-400" />}
                className="p-4"
              />
            )}
          </motion.div>

          {/* Recommendations */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-xl shadow-subtle border border-gray-100 dark:border-gray-700 h-full flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                  <SparklesIcon className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                </div>
                <h2 className="text-base md:text-lg font-serif font-semibold text-gray-900 dark:text-white">
                  Your Job Matches
                </h2>
              </div>
              {hasProfile && recommendations.length > 0 && (
                <Link
                  href="/recommendations"
                  className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-medium text-xs md:text-sm flex items-center gap-1 transition-colors duration-300 py-1 px-2 rounded-md hover:bg-accent-50 dark:hover:bg-accent-900/20"
                >
                  View All
                  <ArrowRightIcon className="h-3 w-3" />
                </Link>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-5">
                <div className="relative w-10 h-10">
                  <div className="absolute top-0 h-10 w-10 rounded-full border-t-2 border-b-2 border-accent-500 animate-spin"></div>
                  <div className="absolute top-1 left-1 h-8 w-8 rounded-full border-r-2 border-l-2 border-primary-500 animate-spin"></div>
                </div>
              </div>
            ) : !hasProfile ? (
              <EmptyState
                message="Complete your profile to get AI-powered job recommendations."
                icon={
                  <SparklesIcon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                }
                actionLabel="Create Profile"
                actionHref="/profile"
                className="p-4"
              />
            ) : recommendations.length > 0 ? (
              <div className="space-y-3 flex-grow">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                  >
                    <RecommendationCard
                      recommendation={rec}
                      className="card-hover"
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                message="No recommendations available yet."
                icon={<SparklesIcon className="h-6 w-6 text-gray-400" />}
                className="p-4"
              />
            )}
          </motion.div>
        </div>
    </motion.div>
  );
}
