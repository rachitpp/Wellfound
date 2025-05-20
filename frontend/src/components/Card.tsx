'use client';

import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  bordered?: boolean;
  raised?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  bordered = true,
  raised = false,
  onClick,
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out';
  
  const hoverClasses = hover 
    ? 'hover:translate-y-[-8px] hover:shadow-lg cursor-pointer after:absolute after:inset-0 after:bg-gradient-to-r after:from-primary-500/5 after:to-accent-500/5 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 relative' 
    : '';
  
  const borderClasses = bordered 
    ? 'border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700' 
    : '';
  
  const shadowClasses = raised 
    ? 'shadow-md hover:shadow-lg' 
    : 'shadow-sm hover:shadow-md';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${borderClasses} ${shadowClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;