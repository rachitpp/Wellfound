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
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300';
  
  const hoverClasses = hover 
    ? 'hover:translate-y-[-8px] hover:shadow-md cursor-pointer' 
    : '';
  
  const borderClasses = bordered 
    ? 'border border-gray-200 dark:border-gray-700' 
    : '';
  
  const shadowClasses = raised 
    ? 'shadow-md' 
    : 'shadow-sm';
  
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