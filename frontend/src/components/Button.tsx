"use client";

import React, {
  ButtonHTMLAttributes,
  forwardRef,
  AnchorHTMLAttributes,
} from "react";
import Link from "next/link";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "light";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  href?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      href,
      leftIcon,
      rightIcon,
      iconOnly = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center";

    const variantClasses = {
      primary:
        "bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-primary-500/30 focus:ring-primary-500",
      secondary:
        "bg-accent-600 hover:bg-accent-700 text-white shadow-sm hover:shadow-accent-500/30 focus:ring-accent-500",
      outline:
        "border border-gray-300 hover:border-gray-400 bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-primary-500",
      ghost:
        "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-red-500/30 focus:ring-red-500",
      success:
        "bg-success-600 hover:bg-success-700 text-white shadow-sm hover:shadow-success-500/30 focus:ring-success-500",
      light:
        "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm hover:shadow focus:ring-gray-500",
    };

    const sizeClasses = {
      xs: "text-xs px-2.5 py-1",
      sm: "text-sm px-3 py-2",
      md: "text-sm px-4 py-2.5",
      lg: "text-base px-5 py-3",
      xl: "text-lg px-8 py-4",
    };

    const iconOnlySizeClasses = {
      xs: "p-1",
      sm: "p-1.5",
      md: "p-2",
      lg: "p-2.5",
      xl: "p-3",
    };

    const widthClass = fullWidth ? "w-full" : "";

    const loadingClass = isLoading ? "opacity-70 cursor-not-allowed" : "";

    const sizeClass = iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size];

    const buttonClass = `${baseClasses} ${variantClasses[variant]} ${sizeClass} ${widthClass} ${loadingClass} ${className}`;

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {leftIcon && !isLoading && (
          <span className={`${children ? "mr-2" : ""}`}>{leftIcon}</span>
        )}
        {children}
        {rightIcon && (
          <span className={`${children ? "ml-2" : ""}`}>{rightIcon}</span>
        )}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={buttonClass}
          {...(props as unknown as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} className={buttonClass} disabled={isLoading} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
