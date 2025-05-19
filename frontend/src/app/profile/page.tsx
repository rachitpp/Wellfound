'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import FormInput from '@/components/FormInput';
import MultiSelect from '@/components/MultiSelect';
import { getCurrentProfile, createOrUpdateProfile } from '@/lib/profileService';

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
  const [formData, setFormData] = useState({
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

  useEffect(() => {
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
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? parseInt(value) || 0 : value,
    }));
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
    setFormError('');
    setFormSuccess('');
    
    try {
      await createOrUpdateProfile(formData);
      setFormSuccess('Profile saved successfully!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Your Professional Profile</h1>
          
          {isFetching ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {formError}
                </div>
              )}
              
              {formSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {formSuccess}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Job Type
                  </label>
                  <select
                    name="preferredJobType"
                    value={formData.preferredJobType}
                    onChange={handleChange}
                    className="px-3 py-2 bg-white border shadow-sm border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-blue-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  >
                    <option value="any">Any</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
