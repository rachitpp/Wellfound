'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import FormInput from '@/components/FormInput';
import MultiSelect from '@/components/MultiSelect';
import Button from '@/components/Button';
import { getCurrentProfile, createOrUpdateProfile, ProfileData } from '@/lib/profileService';
import { isAuthenticated } from '@/lib/authService';
import { 
  UserIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  CodeBracketIcon,
  PencilSquareIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// List of common skills for the multi-select
const SKILLS_OPTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express',
  'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET', 'PHP', 'Laravel',
  'Ruby', 'Ruby on Rails', 'Go', 'Rust', 'Swift', 'Kotlin', 'HTML', 'CSS',
  'SASS/SCSS', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'GraphQL', 'REST API',
  'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'AWS', 'Azure',
  'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub', 'GitLab',
  'Agile', 'Scrum', 'Product Management', 'UI/UX Design', 'Figma', 'Adobe XD',
  'Data Analysis', 'Machine Learning', 'AI', 'DevOps', 'Testing', 'QA',
];

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    location: '',
    yearsOfExperience: 0,
    skills: [] as string[],
    preferredJobType: 'any',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    setIsAuthChecking(false);
    
    const fetchProfile = async () => {
      try {
        const profile = await getCurrentProfile();
        if (profile) {
          setFormData({
            name: profile.name,
            location: profile.location,
            yearsOfExperience: profile.yearsOfExperience,
            skills: profile.skills,
            preferredJobType: profile.preferredJobType,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'yearsOfExperience') {
        return {
          ...prev,
          [name]: parseInt(value) || 0,
        };
      } else if (name === 'preferredJobType') {
        // Ensure preferredJobType is one of the allowed values
        const jobType = value as 'any' | 'remote' | 'onsite';
        return {
          ...prev,
          [name]: jobType,
        };
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSkillsChange = (selected: string[]) => {
    setFormData((prev) => ({
      ...prev,
      skills: selected,
    }));
    // Clear error when user selects skills
    if (errors.skills) {
      setErrors((prev) => ({
        ...prev,
        skills: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.yearsOfExperience < 0) {
      newErrors.yearsOfExperience = 'Years of experience cannot be negative';
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
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
    setFormSuccess('');
    
    try {
      await createOrUpdateProfile(formData);
      setFormSuccess('Profile saved successfully!');
      setIsEditing(false); // Exit editing mode after successful save
      
      // Show success message but don't redirect
      setTimeout(() => {
        setFormSuccess('');
      }, 3000);
    } catch (error: unknown) {
      console.error('Error saving profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save profile. Please try again.';
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to toggle editing mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    // Clear any messages when toggling edit mode
    setFormError('');
    setFormSuccess('');
  };

  // Show loading spinner while checking authentication
  if (isAuthChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Helper function to get job type display text
  const getJobTypeDisplay = (type: 'any' | 'remote' | 'onsite'): string => {
    switch(type) {
      case 'remote': return 'Remote';
      case 'onsite': return 'On-site';
      default: return 'Any';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      {isFetching ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Messages */}
          <AnimatePresence>
            {formError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 text-sm rounded-lg mb-4 flex items-center"
              >
                <span className="mr-2">⚠️</span>
                {formError}
              </motion.div>
            )}
            
            {formSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 text-success-700 dark:text-success-400 px-4 py-3 text-sm rounded-lg mb-4 flex items-center"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                {formSuccess}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Profile Preview */}
          {!isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              {/* Profile Header */}
              <div className="relative">
                <div className="h-24 sm:h-28 md:h-32 bg-gradient-to-r from-primary-500 to-accent-500"></div>
                <div className="absolute -bottom-10 sm:-bottom-12 left-4 sm:left-6 h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 flex items-center justify-center">
                  <UserIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              
              {/* Profile Content */}
              <div className="pt-12 sm:pt-16 pb-4 sm:pb-6 px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {formData.name || 'Your Name'}
                    </h1>
                    <div className="flex items-center mt-1 text-gray-700 dark:text-gray-300">
                      <MapPinIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                      <span className="text-xs sm:text-sm md:text-base">
                        {formData.location || 'Your Location'}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={toggleEditMode}
                    variant="outline"
                    size="sm"
                    leftIcon={<PencilSquareIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    className="self-start mt-1 sm:mt-0"
                  >
                    Edit Profile
                  </Button>
                </div>
                
                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-5 sm:mt-8">
                  {/* Experience */}
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <BriefcaseIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400 mr-2" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Experience</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
                      {formData.yearsOfExperience} {formData.yearsOfExperience === 1 ? 'year' : 'years'} of professional experience
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-2">
                      Preferred job type: <span className="font-medium">{getJobTypeDisplay(formData.preferredJobType)}</span>
                    </p>
                  </div>
                  
                  {/* Skills */}
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <CodeBracketIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400 mr-2" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Skills</h3>
                    </div>
                    {formData.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {formData.skills.map(skill => (
                          <span 
                            key={skill} 
                            className="bg-primary-50 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-0.5 rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 dark:text-gray-300">No skills added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Edit Form */}
          <AnimatePresence>
            {isEditing && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-xl p-6 mt-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Edit Your Profile</h2>
                  <Button
                    onClick={toggleEditMode}
                    variant="ghost"
                    size="sm"
                    className="self-start"
                  >
                    Cancel
                  </Button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormInput
                    label="Full Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    error={errors.name}
                  />
                  
                  <FormInput
                    label="Location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    error={errors.location}
                  />
                  
                  <FormInput
                    label="Years of Experience"
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience.toString()}
                    onChange={handleChange}
                    min="0"
                    error={errors.yearsOfExperience}
                  />
                  
                  <MultiSelect
                    label="Skills"
                    options={SKILLS_OPTIONS}
                    selectedOptions={formData.skills}
                    onChange={handleSkillsChange}
                    error={errors.skills}
                  />
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Preferred Job Type
                    </label>
                    <select
                      name="preferredJobType"
                      value={formData.preferredJobType}
                      onChange={handleChange}
                      className="px-3 py-2 bg-white dark:bg-gray-800 border shadow-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 block w-full rounded-lg text-sm focus:ring-1 transition-all duration-300"
                    >
                      <option value="any">Any</option>
                      <option value="remote">Remote</option>
                      <option value="onsite">On-site</option>
                    </select>
                  </div>
                  
                  <div className="pt-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      fullWidth
                      isLoading={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
