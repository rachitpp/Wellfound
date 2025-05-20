"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getJobById } from "@/lib/jobService";
import { Job } from "@/lib/jobService";
import { createApplication } from "@/lib/applicationService";
import Button from "@/components/Button";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await getJobById(params.id);
        setJob(jobData);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError(
          "Failed to load job details. The job may not exist or has been removed."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const handleBackClick = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <div>
        <button
          onClick={handleBackClick}
          className="mb-6 flex items-center text-blue-600 hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Jobs
        </button>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <Link
              href="/jobs"
              className="mt-4 text-blue-600 hover:underline block"
            >
              Return to job listings
            </Link>
          </div>
        ) : job ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {job.title}
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">{job.company}</p>
                  <div className="flex items-center mt-2 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {job.location}
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full capitalize">
                    {job.jobType}
                  </span>
                  <span className="text-sm text-gray-500 mt-2">
                    Posted on {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="prose max-w-none">
                {job.description ? (
                  <p className="text-gray-700 whitespace-pre-line">
                    {job.description}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    No detailed description provided.
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200">
              {!applicationSuccess ? (
                <div className="space-y-6">
                  <div className="max-w-2xl mx-auto">
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Application Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Add any notes to your application..."
                      value={applicationNotes}
                      onChange={(e) => setApplicationNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/recommendations"
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      View Similar Jobs
                    </Link>
                    <Button
                      variant="primary"
                      size="md"
                      isLoading={isApplying}
                      onClick={async () => {
                        if (!job) return;

                        setIsApplying(true);
                        try {
                          const result = await createApplication(
                            job._id,
                            applicationNotes
                          );
                          if (result) {
                            setApplicationSuccess(true);
                          }
                        } catch (error) {
                          console.error("Error applying for job:", error);
                        } finally {
                          setIsApplying(false);
                        }
                      }}
                    >
                      {isApplying
                        ? "Submitting Application..."
                        : "Apply for This Job"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your application has been successfully submitted.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => router.push("/applications")}
                    >
                      View My Applications
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => router.push("/jobs")}
                    >
                      Browse More Jobs
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </ProtectedRoute>
  );
}
