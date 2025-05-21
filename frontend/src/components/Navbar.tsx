"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, logout } from "@/lib/authService";

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    router.push("/auth/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 shadow-md backdrop-blur-md border-b border-gray-100 dark:border-gray-800"
          : "bg-transparent dark:bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between h-16 md:h-18">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <span className="text-xl md:text-2xl font-display font-bold gradient-text group-hover:opacity-90 transition-all duration-300 transform group-hover:scale-105">
                JobMatch
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1">
            {isAuth ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out ${
                    pathname === "/dashboard"
                      ? "text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/20 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-sm"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/jobs"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    pathname === "/jobs" || pathname.startsWith("/jobs/")
                      ? "text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  Jobs
                </Link>
                <Link
                  href="/profile"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    pathname === "/profile"
                      ? "text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  Profile
                </Link>
                <Link
                  href="/recommendations"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    pathname === "/recommendations"
                      ? "text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  Recommendations
                </Link>
                <Link
                  href="/applications"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    pathname === "/applications"
                      ? "text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  Applications
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:shadow-primary-500/30 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 ease-in-out hover:shadow-sm"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:shadow-primary-500/30 transform hover:scale-[1.02] active:scale-[0.98]"
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
              className="p-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-all duration-300 ease-in-out hover:shadow-md"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">
                {isMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6 transform transition-transform duration-300 ease-in-out"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 transform transition-transform duration-300 ease-in-out"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-subtle rounded-b-xl">
            {isAuth ? (
              <>
                <Link
                  href="/dashboard"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pathname === "/dashboard"
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href="/jobs"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pathname === "/jobs" || pathname.startsWith("/jobs/")
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  onClick={toggleMenu}
                >
                  Jobs
                </Link>
                <Link
                  href="/profile"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pathname === "/profile"
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <Link
                  href="/recommendations"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pathname === "/recommendations"
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  onClick={toggleMenu}
                >
                  Recommendations
                </Link>
                <Link
                  href="/applications"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pathname === "/applications"
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  onClick={toggleMenu}
                >
                  Applications
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow-primary-500/20 mt-3"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pathname === "/auth/login"
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full text-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow-primary-500/20 mt-3"
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
