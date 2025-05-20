import { deleteCache, deleteCachePattern } from './redis';

/**
 * Clears cache for job-related endpoints when jobs are modified
 */
export const invalidateJobCache = async () => {
  try {
    // Clear all job listings cache
    await deleteCachePattern('api:/api/jobs*');
    
    // Clear recommendations as they depend on job data
    await deleteCachePattern('recommendation:*');
    
    console.log('Job cache invalidated');
  } catch (error) {
    console.error('Error invalidating job cache:', error);
  }
};

/**
 * Clears cache for a specific user's profile when it's modified
 * @param userId User ID associated with the profile
 */
export const invalidateProfileCache = async (userId: string) => {
  try {
    // Clear specific user profile cache
    await deleteCache(`api:/api/profile/${userId}`);
    
    // Clear current user profile cache (might be the same user)
    await deleteCache('api:/api/profile');
    
    // Clear recommendations for this user as they depend on profile data
    await deleteCachePattern(`recommendation:${userId}:*`);
    
    console.log(`Profile cache invalidated for user: ${userId}`);
  } catch (error) {
    console.error('Error invalidating profile cache:', error);
  }
};

/**
 * Clears all recommendation caches
 */
export const invalidateAllRecommendations = async () => {
  try {
    await deleteCachePattern('recommendation:*');
    console.log('All recommendation caches invalidated');
  } catch (error) {
    console.error('Error invalidating recommendation caches:', error);
  }
};

/**
 * Generic cache invalidation function for any cache key
 * @param cacheKey The key or pattern to invalidate
 * @param isPattern Whether to use pattern matching (default: false)
 */
export const invalidateCache = async (cacheKey: string, isPattern: boolean = false) => {
  try {
    if (isPattern) {
      await deleteCachePattern(cacheKey);
    } else {
      await deleteCache(cacheKey);
    }
    console.log(`Cache invalidated: ${cacheKey}`);
  } catch (error) {
    console.error(`Error invalidating cache (${cacheKey}):`, error);
  }
};
