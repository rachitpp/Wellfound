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
    <div className={`py-8 px-6 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
      {icon && (
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}
      
      {title && (
        <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
      )}
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">
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