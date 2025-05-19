'use client';

import React from 'react';
import { Recommendation } from '@/lib/recommendationService';

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
    <div 
      className={`p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:translate-y-[-4px]' : ''
      } ${className}`}
      onClick={onClick}
    >
      <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white">
        {recommendation.job}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {recommendation.company}
      </p>
      
      <div className="mt-3 p-3 bg-accent-50 dark:bg-accent-900/10 rounded-lg border border-accent-100 dark:border-accent-800/20">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium text-accent-700 dark:text-accent-300">
            Match Reason:
          </span>{' '}
          {recommendation.reason}
        </p>
      </div>
    </div>
  );
};

export default RecommendationCard;