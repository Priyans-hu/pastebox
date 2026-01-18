const { createClient } = require('redis');

let redisClient = null;
let isConnected = false;

/**
 * Initialize Redis connection
 * Gracefully handles connection failures - app works without cache
 */
const connectRedis = async () => {
    // Skip if Redis URL not configured
    if (!process.env.REDIS_URL) {
        console.log('Redis URL not configured, caching disabled');
        return null;
    }

    try {
        redisClient = createClient({
            url: process.env.REDIS_URL,
            socket: {
                connectTimeout: 5000,
                reconnectStrategy: (retries) => {
                    if (retries > 3) {
                        console.log('Redis max retries reached, disabling cache');
                        return false;
                    }
                    return Math.min(retries * 100, 3000);
                }
            }
        });

        redisClient.on('error', (err) => {
            console.error('Redis error:', err.message);
            isConnected = false;
        });

        redisClient.on('connect', () => {
            console.log('Connected to Redis');
            isConnected = true;
        });

        redisClient.on('disconnect', () => {
            console.log('Disconnected from Redis');
            isConnected = false;
        });

        await redisClient.connect();
        return redisClient;
    } catch (error) {
        console.error('Failed to connect to Redis:', error.message);
        return null;
    }
};

/**
 * Cache keys prefix
 */
const CACHE_PREFIX = 'pastebox:';
const PASTE_KEY = (id) => `${CACHE_PREFIX}paste:${id}`;

/**
 * Default cache TTL: 1 hour (in seconds)
 * Pastes are cached for 1 hour max, even if they expire later
 */
const DEFAULT_TTL = 3600;

/**
 * Get cached paste by ID
 * @param {string} id - Paste ID
 * @returns {Object|null} Cached paste data or null
 */
const getCachedPaste = async (id) => {
    if (!isConnected || !redisClient) return null;

    try {
        const cached = await redisClient.get(PASTE_KEY(id));
        if (cached) {
            console.log(`Cache HIT: ${id}`);
            return JSON.parse(cached);
        }
        console.log(`Cache MISS: ${id}`);
        return null;
    } catch (error) {
        console.error('Redis get error:', error.message);
        return null;
    }
};

/**
 * Cache a paste
 * @param {string} id - Paste ID
 * @param {Object} data - Paste data to cache
 * @param {number} ttl - TTL in seconds (default: 1 hour)
 */
const cachePaste = async (id, data, ttl = DEFAULT_TTL) => {
    if (!isConnected || !redisClient) return;

    try {
        // Calculate TTL based on paste expiration
        if (data.expiresAt) {
            const expiresIn = Math.floor((new Date(data.expiresAt) - Date.now()) / 1000);
            // Use shorter of: paste expiration or default TTL
            ttl = Math.min(Math.max(expiresIn, 60), ttl);
        }

        await redisClient.setEx(PASTE_KEY(id), ttl, JSON.stringify(data));
        console.log(`Cached paste: ${id} (TTL: ${ttl}s)`);
    } catch (error) {
        console.error('Redis set error:', error.message);
    }
};

/**
 * Invalidate cached paste
 * @param {string} id - Paste ID to invalidate
 */
const invalidatePaste = async (id) => {
    if (!isConnected || !redisClient) return;

    try {
        await redisClient.del(PASTE_KEY(id));
        console.log(`Cache invalidated: ${id}`);
    } catch (error) {
        console.error('Redis del error:', error.message);
    }
};

/**
 * Get cache statistics
 */
const getCacheStats = async () => {
    if (!isConnected || !redisClient) {
        return { enabled: false };
    }

    try {
        const info = await redisClient.info('stats');
        const keys = await redisClient.keys(`${CACHE_PREFIX}*`);
        return {
            enabled: true,
            connected: isConnected,
            cachedPastes: keys.length,
            info: info
        };
    } catch (error) {
        return { enabled: true, connected: false, error: error.message };
    }
};

module.exports = {
    connectRedis,
    getCachedPaste,
    cachePaste,
    invalidatePaste,
    getCacheStats
};
