import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Create Redis client with proper configuration
const redisClient = createClient({
  // If REDIS_URL is explicitly provided, use it
  // Otherwise use these connection parameters which match Redis Cloud format
  socket: {
    host: process.env.REDIS_HOST || 'redis-19270.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: parseInt(process.env.REDIS_PORT || '19270')
  },
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD || '6vZLMldS4PHS0t3JWxpjubvDQjupe8xE'
});

// Handle Redis errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Initialize Redis connection
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

/**
 * Set a key-value pair in Redis with an optional expiration time
 * @param key Cache key
 * @param value Data to cache
 * @param expirySeconds Time in seconds until expiration (default: 1 hour)
 */
export async function setCache(key: string, value: any, expirySeconds: number = 3600): Promise<void> {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await redisClient.set(key, stringValue, { EX: expirySeconds });
  } catch (error) {
    console.error('Redis setCache error:', error);
  }
}

/**
 * Get a value from Redis cache
 * @param key Cache key
 * @returns The cached data or null if not found
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const cachedData = await redisClient.get(key);
    if (!cachedData) return null;
    
    try {
      // Try to parse as JSON
      return JSON.parse(cachedData) as T;
    } catch {
      // If not valid JSON, return as is
      return cachedData as unknown as T;
    }
  } catch (error) {
    console.error('Redis getCache error:', error);
    return null;
  }
}

/**
 * Delete a key from Redis cache
 * @param key Cache key to delete
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error('Redis deleteCache error:', error);
  }
}

/**
 * Delete multiple keys matching a pattern
 * @param pattern Pattern to match (e.g. "user:*")
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Redis deleteCachePattern error:', error);
  }
}

export default redisClient;
