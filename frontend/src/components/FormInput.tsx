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
    const inputClasses = `px-4 py-3 rounded-xl border ${
      error
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400"
    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200 ${
      icon ? "pl-11" : ""
    } ${fullWidth ? "w-full" : ""} ${className}`;

    return (
      <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
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
            className="mt-1 text-sm text-red-600 dark:text-red-400"
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
