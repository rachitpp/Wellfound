'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Recommendation } from '@/lib/recommendationService';
import {
  BuildingOffice2Icon,
  MapPinIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onClick?: () => void;
  className?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onClick,
  className = '',
}) => {
  return (
    <motion.div
      className={`p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:border-primary-200 dark:hover:border-primary-700 ${onClick ? 'cursor-pointer' : ''} ${className}`}
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
              {recommendation.job}
            </h3>
          </div>
          <div className="flex flex-wrap items-center text-gray-800 dark:text-gray-100 text-xs sm:text-sm font-medium gap-2 mt-1.5">
            <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded">
              <BuildingOffice2Icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-800 dark:text-gray-200" />
              {recommendation.company}
            </span>
            <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded">
              <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-800 dark:text-gray-200" />
              AI Recommendation
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-800 dark:text-gray-100 font-medium leading-relaxed bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg">
        <div className="flex items-center gap-1 mb-1">
          <BoltIcon className="h-4 w-4 text-accent-500" />
          <span className="font-semibold text-accent-700 dark:text-accent-300">Match Reason:</span>
        </div>
        <div className="line-clamp-3">
          {recommendation.reason || "This job matches your skills and experience."}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs sm:text-sm text-white bg-accent-600 px-2 sm:px-3 py-1 rounded flex items-center shadow-sm hover:shadow transition-shadow duration-300 font-semibold">
          AI Match
        </span>
        <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 font-medium flex items-center gap-1 bg-gray-50 dark:bg-gray-700/30 px-2 sm:px-2.5 py-1 rounded">
          <span className="text-accent-600 dark:text-accent-400">★★★★★</span>
          <span className="hidden xs:inline">Perfect Match</span>
        </span>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;