'use client';

import React from 'react';
import { Job } from '@/lib/jobService';

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  className?: string;
  showDescription?: boolean;
  showPostedDate?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onClick,
  className = '',
  showDescription = false,
  showPostedDate = true,
}) => {
  return (
    <div
      className={`p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-4px] ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white">
        {job.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {job.company} • {job.location}
      </p>

      {showDescription && job.description && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {job.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        {job.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium px-2.5 py-1 rounded-lg"
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

      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-lg">
          {job.jobType}
        </span>
        {showPostedDate && job.createdAt && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Posted: {new Date(job.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobCard;