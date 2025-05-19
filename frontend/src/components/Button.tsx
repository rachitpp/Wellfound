'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  href?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false, 
    isLoading = false,
    href,
    leftIcon,
    rightIcon,
    className = '',
    ...props 
  }, ref) => {
    const baseClasses = 'font-medium rounded-lg transition-all duration-300 focus:outline-none inline-flex items-center justify-center';
    
    const variantClasses = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow',
      secondary: 'bg-accent-600 hover:bg-accent-700 text-white shadow-sm hover:shadow',
      outline: 'border border-gray-300 hover:border-gray-400 bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800',
      ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
      danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow',
    };
    
    const sizeClasses = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-5 py-2.5',
      xl: 'text-lg px-8 py-3.5',
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    const loadingClass = isLoading ? 'opacity-70 cursor-not-allowed' : '';
    
    const buttonClass = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${loadingClass} ${className}`;
    
    const content = (
      <>
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </>
    );
    
    if (href) {
      return (
        <Link 
          href={href} 
          className={buttonClass}
          {...(props as any)}
        >
          {content}
        </Link>
      );
    }
    
    return (
      <button 
        ref={ref} 
        className={buttonClass} 
        disabled={isLoading} 
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;