"use client";

import React, { useState } from "react";
import { Job } from "@/lib/jobService";
import { motion } from "framer-motion";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import {
  BuildingOffice2Icon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  className?: string;
  showDescription?: boolean;
  showPostedDate?: boolean;
  isSaved?: boolean;
  onSaveToggle?: (jobId: string, saved: boolean) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onClick,
  className = "",
  showDescription = false,
  showPostedDate = true,
  isSaved = false,
  onSaveToggle,
}) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleSaveJob = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setSaving(true);

    try {
      // This is a placeholder - we'll implement the actual API calls next
      setSaved(!saved);

      if (onSaveToggle) {
        onSaveToggle(job._id, !saved);
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className={`p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-lg card-hover ${className}`}
      onClick={onClick}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-3 flex-shrink-0">
              <BuildingOffice2Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white mb-1">
              {job.title}
            </h3>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm gap-3 mt-1">
            <span className="flex items-center gap-1">
              <BuildingOffice2Icon className="h-4 w-4 text-gray-400" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4 text-gray-400" />
              {job.location}
            </span>
          </div>
        </div>
        <button
          onClick={handleSaveJob}
          disabled={saving}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={saved ? "Unsave job" : "Save job"}
        >
          {saved ? (
            <HeartIconSolid className="h-6 w-6 text-accent-500" />
          ) : (
            <HeartIconOutline className="h-6 w-6 text-gray-400 hover:text-accent-500" />
          )}
        </button>
      </div>

      {showDescription && job.description && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {job.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {job.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium px-2.5 py-1 rounded-lg"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
        <span className="text-sm text-white bg-primary-600 px-3 py-1 rounded-lg flex items-center">
          {job.jobType}
        </span>
        {showPostedDate && job.createdAt && (
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default JobCard;
