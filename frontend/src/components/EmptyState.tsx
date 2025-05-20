'use client';

import React, { ReactNode } from 'react';
import Button from './Button';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  actionLabel,
  actionHref,
  onAction,
  className = '',
}) => {
  return (
    <div className={`py-10 px-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md animate-fade-in ${className}`}>
      {icon && (
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md animate-pulse-slow p-5 border-2 border-white dark:border-gray-600">
            {icon}
          </div>
        </div>
      )}
      
      {title && (
        <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
      )}
      
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      
      {(actionLabel && (actionHref || onAction)) && (
        <Button
          href={actionHref}
          onClick={onAction}
          variant="primary"
          size="md"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;