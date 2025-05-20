"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      helperText,
      error,
      icon,
      fullWidth = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const inputClasses = `px-4 py-3 rounded-xl border-2 ${
      error
        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
        : "border-gray-200 dark:border-gray-700 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-primary-400/30 dark:focus:border-primary-400"
    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out ${
      icon ? "pl-11" : ""
    } ${fullWidth ? "w-full" : ""} ${className}`;

    return (
      <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-display tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              props.id || props.name
                ? `${props.id || props.name}-helper ${
                    props.id || props.name
                  }-error`
                : undefined
            }
            {...props}
          />
        </div>
        {helperText && !error && (
          <p
            id={
              props.id || props.name
                ? `${props.id || props.name}-helper`
                : undefined
            }
            className="mt-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg inline-block"
          >
            {helperText}
          </p>
        )}
        {error && (
          <p
            id={
              props.id || props.name
                ? `${props.id || props.name}-error`
                : undefined
            }
            className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 px-3 py-1.5 rounded-lg inline-block font-medium"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
