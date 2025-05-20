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
      "font-medium rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center relative overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]";

    const variantClasses = {
      primary:
        "bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg hover:shadow-primary-500/30 focus:ring-primary-500 after:absolute after:inset-0 after:bg-white/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity",
      secondary:
        "bg-accent-600 hover:bg-accent-700 text-white shadow-md hover:shadow-lg hover:shadow-accent-500/30 focus:ring-accent-500 after:absolute after:inset-0 after:bg-white/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity",
      outline:
        "border-2 border-gray-300 hover:border-gray-400 bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-primary-500 hover:shadow-md",
      ghost:
        "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg hover:shadow-red-500/30 focus:ring-red-500 after:absolute after:inset-0 after:bg-white/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity",
      success:
        "bg-success-600 hover:bg-success-700 text-white shadow-md hover:shadow-lg hover:shadow-success-500/30 focus:ring-success-500 after:absolute after:inset-0 after:bg-white/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity",
      light:
        "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-md hover:shadow-lg focus:ring-gray-500",
    };

    const sizeClasses = {
      xs: "text-xs px-2 py-1 font-medium",
      sm: "text-xs px-3 py-1.5 font-medium",
      md: "text-sm px-4 py-2 font-medium",
      lg: "text-sm px-5 py-2.5 font-semibold",
      xl: "text-base px-6 py-3 font-semibold",
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
