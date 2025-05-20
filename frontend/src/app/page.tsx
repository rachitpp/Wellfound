import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -z-10"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-96 overflow-hidden -z-10">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary-300 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 right-10 w-80 h-80 bg-accent-300 dark:bg-accent-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-primary-200 dark:bg-primary-800 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-center md:text-left">
              <div className="animate-fade-in">
                <span className="inline-block px-4 py-1.5 mb-5 text-sm font-semibold rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200">
                  AI-Powered Job Matching
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-6 tracking-tight leading-tight text-gray-900 dark:text-white">
                  Find Your <span className="gradient-text">Perfect Job</span>{" "}
                  Match
                </h1>
                <p className="text-lg md:text-xl mb-8 text-gray-800 dark:text-gray-100 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">
                  Our AI-powered platform analyzes your skills and preferences
                  to recommend job opportunities tailored specifically for you.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                  <Link
                    href="/auth/register"
                    className="btn-secondary inline-flex items-center justify-center px-8 py-3.5 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/jobs"
                    className="btn-outline bg-white/90 dark:bg-transparent text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 inline-flex items-center justify-center px-8 py-3.5 text-lg rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Browse Jobs
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative animate-float">
                <div className="glass-effect rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-white/70">AI Job Matcher</div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/10 p-4 rounded-xl">
                      <div className="text-xs text-white/70 mb-2">Skills</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-primary-600/80 px-2 py-1 rounded-lg text-white">
                          React
                        </span>
                        <span className="text-xs bg-primary-600/80 px-2 py-1 rounded-lg text-white">
                          TypeScript
                        </span>
                        <span className="text-xs bg-primary-600/80 px-2 py-1 rounded-lg text-white">
                          Node.js
                        </span>
                        <span className="text-xs bg-primary-600/80 px-2 py-1 rounded-lg text-white">
                          MongoDB
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl">
                      <div className="text-xs text-white/70 mb-2">
                        Top Match
                      </div>
                      <div className="text-base font-medium text-white">
                        Senior Frontend Developer at TechCorp
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex-1 bg-white/20 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-accent-500 h-full rounded-full"
                            style={{ width: "95%" }}
                          ></div>
                        </div>
                        <span className="text-xs text-white ml-2">95%</span>
                      </div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl">
                      <div className="text-xs text-white/70 mb-2">
                        Location Preference
                      </div>
                      <div className="text-sm text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent-500 rounded-full"></span>
                        Remote
                        <span className="w-2 h-2 bg-primary-500 rounded-full ml-2"></span>
                        San Francisco
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <div className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full text-sm font-semibold mb-5">
              How It Works
            </div>
            <h2 className="heading-lg text-gray-900 dark:text-white mb-5 font-extrabold">
              Find Your Dream Job in Three Simple Steps
            </h2>
            <p className="text-lg text-gray-800 dark:text-gray-100 max-w-2xl mx-auto font-medium">
              Our platform uses advanced AI to match your profile with the
              perfect job opportunities tailored to your skills and preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-subtle hover:shadow-elevated p-5 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700 card-hover">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white mb-4 sm:mb-5 md:mb-7 shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/30 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                Create Your Profile
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-200 font-medium">
                Sign up and build your professional profile with your skills,
                experience, and job preferences to help our AI understand your career
                goals.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-subtle hover:shadow-elevated p-5 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700 card-hover">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white mb-4 sm:mb-5 md:mb-7 shadow-lg shadow-accent-500/20 group-hover:shadow-accent-500/30 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">
                Browse Job Listings
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-100 font-medium">
                Explore our curated job listings from top companies across
                various industries and locations. Filter by skills, experience
                level, and job type.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-subtle hover:shadow-elevated p-5 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700 card-hover">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center text-white mb-4 sm:mb-5 md:mb-7 shadow-lg shadow-success-500/20 group-hover:shadow-success-500/30 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white group-hover:text-success-600 dark:group-hover:text-success-400 transition-colors duration-300">
                Get AI Recommendations
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-100 font-medium">
                Our AI analyzes your profile and suggests the best job matches
                with personalized reasons for each recommendation, helping you
                find the perfect fit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-primary-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-inner mx-4 sm:mx-8 md:mx-12 lg:mx-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            <div className="space-y-3">
              <div className="text-5xl font-display font-extrabold gradient-text animate-pulse-slow">
                10k+
              </div>
              <p className="text-gray-800 dark:text-gray-100 font-semibold">
                Active Users
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-display font-extrabold gradient-text animate-pulse-slow">
                5k+
              </div>
              <p className="text-gray-800 dark:text-gray-100 font-semibold">
                Job Listings
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-display font-extrabold gradient-text animate-pulse-slow">
                95%
              </div>
              <p className="text-gray-800 dark:text-gray-100 font-semibold">
                Match Accuracy
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-display font-extrabold gradient-text animate-pulse-slow">
                3k+
              </div>
              <p className="text-gray-800 dark:text-gray-100 font-semibold">
                Successful Hires
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-xl mb-8 mx-4 sm:mx-8 md:mx-12 lg:mx-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-700 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

        <div className="container-custom relative z-10 py-6 sm:py-8 md:py-10 text-center">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-display font-extrabold text-white mb-3 sm:mb-4 tracking-tight">
            Ready to find your dream job?
          </h2>
          <p className="text-white mb-4 sm:mb-5 md:mb-6 max-w-xl mx-auto text-sm sm:text-base font-medium">
            Join thousands of professionals who have found their perfect career match through our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              href="/auth/register"
              className="bg-white text-primary-700 hover:bg-gray-100 inline-flex items-center justify-center px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 text-sm rounded-xl shadow-md hover:shadow-lg hover:shadow-white/20 transition-all duration-300 ease-in-out font-medium transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign Up Now
            </Link>
            <Link
              href="/jobs"
              className="glass-effect text-white inline-flex items-center justify-center px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 text-sm rounded-xl hover:bg-white/20 transition-all duration-300 ease-in-out font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
