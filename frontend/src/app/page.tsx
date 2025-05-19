import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white py-20 rounded-2xl overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Find Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-100">
                  Perfect Job
                </span>{" "}
                Match with AI
              </h1>
              <p className="text-xl mb-8 text-indigo-100 max-w-lg mx-auto md:mx-0">
                Our AI-powered platform analyzes your skills and preferences to
                recommend the best job opportunities tailored just for you.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <Link
                  href="/auth/register"
                  className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="/jobs"
                  className="btn-outline bg-white/10 text-white border-white/30 hover:bg-white/20 inline-flex items-center justify-center px-6 py-3 text-lg"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-400 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-10 -right-4 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 right-20 w-72 h-72 bg-emerald-400 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-white/70">AI Job Matcher</div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-xs text-indigo-200 mb-1">Skills</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-indigo-700/50 px-2 py-1 rounded">
                          React
                        </span>
                        <span className="text-xs bg-indigo-700/50 px-2 py-1 rounded">
                          TypeScript
                        </span>
                        <span className="text-xs bg-indigo-700/50 px-2 py-1 rounded">
                          Node.js
                        </span>
                        <span className="text-xs bg-indigo-700/50 px-2 py-1 rounded">
                          MongoDB
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-xs text-indigo-200 mb-1">
                        Top Match
                      </div>
                      <div className="text-sm font-medium">
                        Senior Frontend Developer at TechCorp
                      </div>
                      <div className="text-xs text-indigo-200 mt-1">
                        95% match with your profile
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
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
              How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Find Your Dream Job in Three Simple Steps
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform uses advanced AI to match your profile with the
              perfect job opportunities tailored to your skills and preferences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card group hover:translate-y-[-8px] p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                Create Your Profile
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up and build your professional profile with your skills,
                experience, and job preferences. The more detailed your profile,
                the better our AI can match you.
              </p>
            </div>

            <div className="card group hover:translate-y-[-8px] p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
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
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                Browse Job Listings
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Explore our curated job listings from top companies across
                various industries and locations. Filter by skills, experience
                level, and job type.
              </p>
            </div>

            <div className="card group hover:translate-y-[-8px] p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
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
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                Get AI Recommendations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI analyzes your profile and suggests the best job matches
                with personalized reasons for each recommendation, helping you
                find the perfect fit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                10k+
              </div>
              <p className="text-gray-600 dark:text-gray-300">Active Users</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                5k+
              </div>
              <p className="text-gray-600 dark:text-gray-300">Job Listings</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                95%
              </div>
              <p className="text-gray-600 dark:text-gray-300">Match Accuracy</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                3k+
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Successful Hires
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>

        <div className="container-custom relative z-10 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to find your dream job?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of professionals who have found their perfect career
            match through our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/auth/register"
              className="btn-secondary inline-flex items-center justify-center px-8 py-3 text-lg"
            >
              Sign Up Now
            </Link>
            <Link
              href="/jobs"
              className="btn-outline bg-white/10 text-white border-white/30 hover:bg-white/20 inline-flex items-center justify-center px-8 py-3 text-lg"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
