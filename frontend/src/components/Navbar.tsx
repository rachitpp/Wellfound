"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, logout } from "@/lib/authService";

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    router.push("/auth/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white sticky top-0 z-50 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <div className="container-custom">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-serif font-bold bg-gradient-to-r from-primary-600 to-accent-600 text-transparent bg-clip-text">
                JobMatch
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuth ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    pathname === "/dashboard"
                      ? "text-primary-600 dark:text-primary-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/jobs"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    pathname === "/jobs"
                      ? "text-primary-600 dark:text-primary-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
                >
                  Jobs
                </Link>
                <Link
                  href="/profile"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    pathname === "/profile"
                      ? "text-primary-600 dark:text-primary-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
                >
                  Profile
                </Link>
                <Link
                  href="/recommendations"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    pathname === "/recommendations"
                      ? "text-primary-600 dark:text-primary-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
                >
                  Recommendations
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    pathname === "/auth/login"
                      ? "text-primary-600 dark:text-primary-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            {isAuth ? (
              <>
                <Link
                  href="/dashboard"
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-300 ${
                    pathname === "/dashboard"
                      ? "text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href="/jobs"
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-300 ${
                    pathname === "/jobs"
                      ? "text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={toggleMenu}
                >
                  Jobs
                </Link>
                <Link
                  href="/profile"
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-300 ${
                    pathname === "/profile"
                      ? "text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <Link
                  href="/recommendations"
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-300 ${
                    pathname === "/recommendations"
                      ? "text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={toggleMenu}
                >
                  Recommendations
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-300 ${
                    pathname === "/auth/login"
                      ? "text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full text-center px-3 py-2 rounded-lg text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow mt-2"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
