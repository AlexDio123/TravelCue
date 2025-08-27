interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds
  persistent?: boolean; // Whether to persist in localStorage
}

class CacheManager {
  private memoryCache = new Map<string, CacheItem<unknown>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes default
  private readonly persistentTTL = 24 * 60 * 60 * 1000; // 24 hours for persistent data

  constructor() {
    this.loadPersistentCache();
  }

  /**
   * Set a value in cache
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const ttl = options.ttl || this.defaultTTL;
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };

    this.memoryCache.set(key, item);

    // If persistent, also save to localStorage
    if (options.persistent) {
      this.saveToLocalStorage(key, item);
    }
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const item = this.memoryCache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.memoryCache.delete(key);
      this.removeFromLocalStorage(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Check if a key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove a specific key from cache
   */
  delete(key: string): void {
    this.memoryCache.delete(key);
    this.removeFromLocalStorage(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.memoryCache.clear();
    this.clearLocalStorage();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.memoryCache.size,
      keys: Array.from(this.memoryCache.keys())
    };
  }

  /**
   * Save item to localStorage
   */
  private saveToLocalStorage(key: string, item: CacheItem<unknown>): void {
    try {
      const storageKey = `cache_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  /**
   * Load item from localStorage
   */
  private loadFromLocalStorage(key: string): CacheItem<unknown> | null {
    try {
      const storageKey = `cache_${key}`;
      const item = localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   */
  private removeFromLocalStorage(key: string): void {
    try {
      const storageKey = `cache_${key}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  /**
   * Load all persistent cache items
   */
  private loadPersistentCache(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));

      cacheKeys.forEach(storageKey => {
        const key = storageKey.replace('cache_', '');
        const item = this.loadFromLocalStorage(key);
        
        if (item && Date.now() - item.timestamp <= item.ttl) {
          this.memoryCache.set(key, item);
        } else {
          // Remove expired items
          this.removeFromLocalStorage(key);
        }
      });
    } catch (error) {
      console.warn('Failed to load persistent cache:', error);
    }
  }

  /**
   * Clear localStorage cache
   */
  private clearLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));
      cacheKeys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error);
    }
  }
}

// Cache instances for different data types
export const cacheManager = new CacheManager();

// Specialized cache functions for different data types
export const cacheUtils = {
  // Geocoding data (coordinates don't change often)
  geocoding: {
    set: <T>(query: string, data: T) => cacheManager.set(`geocoding_${query}`, data, { 
      ttl: 24 * 60 * 60 * 1000, // 24 hours
      persistent: true 
    }),
    get: <T>(query: string) => cacheManager.get<T>(`geocoding_${query}`),
    has: (query: string) => cacheManager.has(`geocoding_${query}`)
  },

  // Events data (changes daily)
  events: {
    set: <T>(coords: string, data: T) => cacheManager.set(`events_${coords}`, data, { 
      ttl: 2 * 60 * 60 * 1000 // 2 hours
    }),
    get: <T>(coords: string) => cacheManager.get<T>(`events_${coords}`),
    has: (coords: string) => cacheManager.has(`events_${coords}`)
  },

  // Attractions data (rarely changes)
  attractions: {
    set: <T>(coords: string, data: T) => cacheManager.set(`attractions_${coords}`, data, { 
      ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
      persistent: true 
    }),
    get: <T>(coords: string) => cacheManager.get<T>(`attractions_${coords}`),
    has: (coords: string) => cacheManager.has(`attractions_${coords}`)
  },

  // Health/Security data (changes occasionally)
  healthSecurity: {
    set: <T>(country: string, data: T) => cacheManager.set(`health_${country}`, data, { 
      ttl: 6 * 60 * 60 * 1000 // 6 hours
    }),
    get: <T>(country: string) => cacheManager.get<T>(`health_${country}`),
    has: (country: string) => cacheManager.has(`health_${country}`)
  }
};

export default cacheManager;
