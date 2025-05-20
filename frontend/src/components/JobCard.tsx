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
  onSaveToggle?: () => void;
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
        onSaveToggle();
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className={`p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:border-primary-200 dark:hover:border-primary-700 cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-2 flex-shrink-0 shadow-sm">
              <BuildingOffice2Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg md:text-xl font-display font-bold text-gray-900 dark:text-white mb-0.5 leading-tight">
              {job.title}
            </h3>
          </div>
          <div className="flex items-center text-gray-800 dark:text-gray-100 text-sm font-medium gap-2 mt-1.5">
            <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded">
              <BuildingOffice2Icon className="h-4 w-4 text-gray-800 dark:text-gray-200" />
              {job.company}
            </span>
            <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded">
              <MapPinIcon className="h-4 w-4 text-gray-800 dark:text-gray-200" />
              {job.location}
            </span>
          </div>
        </div>
        <button
          onClick={handleSaveJob}
          disabled={saving}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-sm group cursor-pointer"
          aria-label={saved ? "Unsave job" : "Save job"}
        >
          {saved ? (
            <HeartIconSolid className="h-5 w-5 text-accent-500 transform group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <HeartIconOutline className="h-5 w-5 text-gray-500 group-hover:text-accent-500 transform group-hover:scale-110 transition-all duration-300" />
          )}
        </button>
      </div>

      {showDescription && job.description && (
        <p className="mt-3 text-sm text-gray-800 dark:text-gray-100 font-medium line-clamp-2 leading-relaxed bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg">
          {job.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mt-3">
        {job.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="bg-primary-50 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 text-sm font-semibold px-2.5 py-0.5 rounded shadow-sm transition-all duration-200 hover:bg-primary-100 dark:hover:bg-primary-800/40"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="text-sm text-gray-800 dark:text-gray-100 font-medium flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-3 flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="text-sm text-white bg-primary-600 px-3 py-1 rounded flex items-center shadow-sm hover:shadow transition-shadow duration-300 font-semibold">
          {job.jobType}
        </span>
        {showPostedDate && job.createdAt && (
          <span className="text-sm text-gray-800 dark:text-gray-100 font-medium flex items-center gap-1 bg-gray-50 dark:bg-gray-700/30 px-2.5 py-1 rounded">
            <ClockIcon className="h-4 w-4" />
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default JobCard;
