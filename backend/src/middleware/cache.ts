import { Request, Response, NextFunction } from 'express';
import { getCache, setCache } from '../utils/redis';

/**
 * Middleware to cache API responses
 * @param expirySeconds Time in seconds until cache expiration (default: 1 hour)
 */
export const cacheMiddleware = (expirySeconds: number = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create a cache key based on the URL and query parameters
    const cacheKey = `api:${req.originalUrl || req.url}`;
    
    try {
      // Try to get data from cache
      const cachedData = await getCache<any>(cacheKey);
      
      // If cached data exists, return it
      if (cachedData) {
        console.log(`Cache hit for ${cacheKey}`);
        return res.status(200).json(cachedData);
      }
      
      // Cache miss - modify res.json to cache the response
      const originalJson = res.json;
      res.json = function(body) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCache(cacheKey, body, expirySeconds)
            .catch(err => console.error('Error setting cache:', err));
        }
        
        // Call the original json method
        return originalJson.call(this, body);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Middleware to cache AI recommendation results
 * @param expirySeconds Time in seconds until cache expiration (default: 24 hours)
 */
export const cacheRecommendations = (expirySeconds: number = 86400) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-POST requests
    if (req.method !== 'POST') {
      return next();
    }

    // Create a cache key based on the request body
    // For recommendations, we use the user ID and skills as the cache key
    const userId = req.body.userId || 'anonymous';
    const skills = req.body.skills || [];
    const cacheKey = `recommendation:${userId}:${skills.sort().join(',')}`;
    
    try {
      // Try to get recommendations from cache
      const cachedData = await getCache<any>(cacheKey);
      
      // If cached recommendations exist, return them
      if (cachedData) {
        console.log(`Cache hit for recommendations: ${cacheKey}`);
        return res.status(200).json(cachedData);
      }
      
      // Cache miss - modify res.json to cache the response
      const originalJson = res.json;
      res.json = function(body) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCache(cacheKey, body, expirySeconds)
            .catch(err => console.error('Error setting recommendation cache:', err));
        }
        
        // Call the original json method
        return originalJson.call(this, body);
      };
      
      next();
    } catch (error) {
      console.error('Recommendation cache middleware error:', error);
      next();
    }
  };
};
