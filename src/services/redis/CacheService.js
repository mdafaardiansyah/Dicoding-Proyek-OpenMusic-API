const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      url: config.redis.url,
      socket: {
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            return false;
          }
          return Math.min(retries * 1000, 3000);
        }
      }
    });

    this._client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });

    this._client.on('connect', () => {
      console.log('Redis Client Connected');
    });

    // Connect to Redis
    this._client.connect().catch((error) => {
      console.error('Failed to connect to Redis:', error);
    });
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, 'EX', expirationInSecond);
  }

  async get(key) {
    const result = await this._client.get(key);
    if (result === null) throw new Error('Cache tidak ditemukan');
    return result;
  }

  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;