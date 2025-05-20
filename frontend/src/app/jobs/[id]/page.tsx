"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getJobById, Job } from "@/lib/jobService";
import { createApplication } from "@/lib/applicationService";
import Button from "@/components/Button";
import { isAuthenticated } from "@/lib/authService";
import {
  ArrowLeftIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  ClockIcon,
  BriefcaseIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || ""; // safely extract id
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState("");
  const [applicationError, setApplicationError] = useState("");
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          router.push("/auth/login");
          return;
        }
        setIsAuthChecking(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id || isAuthChecking) return;

      try {
        setIsLoading(true);
        const jobData = await getJobById(id);
        setJob(jobData);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details. The job may not exist or has been removed.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, isAuthChecking]);

  const handleBackClick = () => {
    router.back();
  };

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
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-5">
      <motion.button
        onClick={handleBackClick}
        className="mb-3 flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200 font-medium text-sm"
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
        Back to Jobs
      </motion.button>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <motion.div
          className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-base font-medium mb-1.5">Error Loading Job</h3>
          <p className="mb-3 text-sm">{error}</p>
          <Link href="/jobs" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm">
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1.5" />
            Return to job listings
          </Link>
        </motion.div>
      ) : job ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-gray-700"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="p-4 md:p-5 border-b border-gray-100 dark:border-gray-700" variants={itemVariants}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                    <BuildingOffice2Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-white">{job.title}</h1>
                    <p className="text-base text-gray-700 dark:text-gray-300 mt-0.5 font-medium">{job.company}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center text-gray-800 dark:text-gray-100 text-xs font-medium gap-2 mt-3">
                  <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
                    <MapPinIcon className="h-3.5 w-3.5 text-gray-700 dark:text-gray-200" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
                    <BriefcaseIcon className="h-3.5 w-3.5 text-gray-700 dark:text-gray-200" />
                    {job.jobType}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
                    <ClockIcon className="h-3.5 w-3.5 text-gray-700 dark:text-gray-200" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <div className="p-4 md:p-5">
            <motion.div className="mb-5" variants={itemVariants}>
              <h2 className="text-base font-display font-bold text-gray-900 dark:text-white mb-2">Job Description</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                <p className="whitespace-pre-line text-sm font-medium">{job.description}</p>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div className="mb-5" variants={itemVariants}>
              <h2 className="text-base font-display font-bold text-gray-900 dark:text-white mb-2">Required Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 rounded text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Application */}
            <motion.div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700" variants={itemVariants}>
              {!applicationSuccess ? (
                <div>
                  <h2 className="text-base font-display font-bold text-gray-900 dark:text-white mb-3">Apply for this Position</h2>
                  <div className="max-w-3xl mx-auto bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
                    <label htmlFor="notes" className="block text-xs font-semibold text-gray-800 dark:text-gray-100 mb-1.5">
                      Application Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium"
                      placeholder="Introduce yourself and explain why you're a good fit for this position..."
                      value={applicationNotes}
                      onChange={(e) => setApplicationNotes(e.target.value)}
                    ></textarea>

                    <div className="flex flex-col sm:flex-row gap-2 justify-end mt-4">
                      <Link
                        href="/recommendations"
                        className="inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        View Similar Jobs
                      </Link>
                      {applicationError && (
                        <div className="mb-3 text-red-600 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded">
                          {applicationError}
                        </div>
                      )}
                      <Button
                        variant="primary"
                        size="md"
                        isLoading={isApplying}
                        onClick={async () => {
                          if (!job) return;

                          // Reset any previous errors
                          setApplicationError("");
                          setIsApplying(true);
                          
                          try {
                            const result = await createApplication(job._id, applicationNotes);
                            if (result) {
                              // Application was successfully created (either via API or fallback)
                              setApplicationSuccess(true);
                              // Clear any previous error
                              setApplicationError("");
                            } else {
                              // Only show error if both API and fallback mechanism failed
                              setApplicationError("Failed to submit application. Please try again later.");
                            }
                          } catch (error) {
                            // The error is already handled in the applicationService with fallback
                            // Only log it here but don't show to user unless result is null
                            console.error("Error applying for job:", error);
                          } finally {
                            setIsApplying(false);
                          }
                        }}
                      >
                        {isApplying ? "Submitting..." : "Apply Now"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  className="text-center py-6 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h3>
                  <p className="text-gray-800 dark:text-gray-100 mb-5 max-w-md mx-auto text-sm font-medium">
                    Your application has been successfully submitted. We&apos;ll notify you when the employer responds.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline" size="sm" onClick={() => router.push("/applications")}>
                      View Applications
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => router.push("/jobs")}>
                      Browse More Jobs
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
