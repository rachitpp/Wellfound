"use client";

import { useState } from "react";
// Removed router import since we're using window.location.href
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function RegisterPage() {
  // Router removed since we're using window.location.href directly
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setRegisterError("");

    try {
      // Development bypass - skip API call and authorize directly
      console.log('Client-side registration bypass for', formData.email);
      
      // Create a mock user ID
      const mockUserId = 'user_' + Math.random().toString(36).substring(2, 10);
      
      // Store all necessary user data in localStorage
      localStorage.setItem('token', 'mock-jwt-token-for-development-only');
      localStorage.setItem('user_id', mockUserId);
      localStorage.setItem('user_name', formData.name);
      localStorage.setItem('user_email', formData.email);
      localStorage.setItem('using_mock_auth', 'true');
      
      console.log('Client-side auth enabled, redirecting to dashboard...');
      
      // Force a page reload to ensure all auth state is properly recognized
      // This is more reliable than just using the router
      window.location.href = '/dashboard';
      
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      setRegisterError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-20 right-0 w-80 h-80 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-16 w-72 h-72 bg-accent-200 dark:bg-accent-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary-100 dark:bg-primary-800 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="max-w-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 100,
        }}
      >
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-7 rounded-xl shadow-subtle border border-gray-100 dark:border-gray-700">
          <div className="mb-4 text-center">
            <motion.div
              className="mx-auto w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
            >
              <UserIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </motion.div>

            <h1 className="text-lg sm:text-xl font-serif font-bold mb-1 text-gray-900 dark:text-white">
              Create an Account
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Join our platform to find your perfect job match
            </p>
          </div>

          {registerError && (
            <motion.div
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-lg mb-3 text-xs sm:text-sm flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
              <p>{registerError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <FormInput
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              error={errors.name}
              autoComplete="name"
              icon={<UserIcon className="h-5 w-5" />}
              helperText="How you'll be known on our platform"
            />

            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              autoComplete="email"
              icon={<EnvelopeIcon className="h-5 w-5" />}
              helperText="We'll never share your email with anyone else"
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••"
              error={errors.password}
              autoComplete="new-password"
              icon={<LockClosedIcon className="h-5 w-5" />}
              helperText="Minimum 6 characters required"
            />

            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••••"
              error={errors.confirmPassword}
              autoComplete="new-password"
              icon={<LockClosedIcon className="h-5 w-5" />}
            />

            <div className="pt-1">
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={isLoading}
                className="shadow-md hover:shadow-primary-500/20"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
