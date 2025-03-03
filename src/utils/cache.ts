/**
 * Cache entry with expiration
 */
interface CacheEntry<T> {
  /** Cached value */
  value: T;
  /** Expiration timestamp */
  expiry: number;
}

/**
 * Simple in-memory cache with TTL support
 */
export class Cache<T = any> {
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;
  private defaultTTL: number;

  /**
   * Create a new Cache
   * @param maxSize - Maximum number of items to store (default: 100)
   * @param defaultTTL - Default time-to-live in milliseconds (default: 5 minutes)
   */
  constructor(maxSize: number = 100, defaultTTL: number = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  /**
   * Set a value in the cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time-to-live in milliseconds (optional, uses default if not provided)
   */
  set(key: string, value: T, ttl?: number): void {
    // Clean expired entries if at capacity
    if (this.cache.size >= this.maxSize) {
      this.removeExpired();
      
      // If still at capacity, remove oldest entry
      if (this.cache.size >= this.maxSize) {
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey !== undefined) {
          this.cache.delete(oldestKey);
        }
      }
    }

    const expiry = Date.now() + (ttl !== undefined ? ttl : this.defaultTTL);
    this.cache.set(key, { value, expiry });
  }

  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns Cached value or undefined if not found or expired
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return undefined;
    }
    
    // Check if entry has expired
    if (entry.expiry <= Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.value;
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param key - Cache key
   * @returns True if key exists and is not expired, false otherwise
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check if entry has expired
    if (entry.expiry <= Date.now()) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Delete a key from the cache
   * @param key - Cache key
   * @returns True if key was deleted, false if key doesn't exist
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of entries in the cache
   * @returns Cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Remove all expired entries from the cache
   */
  private removeExpired(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry <= now) {
        this.cache.delete(key);
      }
    }
  }
}
