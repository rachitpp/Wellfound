'use client';

import React, { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  fullWidth?: boolean;
  helper?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helper, fullWidth = true, className = '', ...props }, ref) => {
    return (
      <div className={`mb-5 ${fullWidth ? 'w-full' : ''}`}>
        <label 
          htmlFor={props.id || props.name} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className={`px-4 py-2.5 bg-white dark:bg-gray-800 border shadow-sm border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 block rounded-lg text-sm focus:ring-1 transition-all duration-300 ${
              error ? 'border-red-500 dark:border-red-500' : ''
            } ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {helper && !error && <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helper}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
