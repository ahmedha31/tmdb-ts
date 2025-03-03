import { Cache } from '../../src/utils/cache';

describe('Cache', () => {
  let cache: Cache;
  
  beforeEach(() => {
    cache = new Cache(10, 100); // Small capacity, short TTL for testing
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  
  describe('set and get', () => {
    it('should store and retrieve a value', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });
    
    it('should return undefined for missing keys', () => {
      expect(cache.get('nonexistent')).toBeUndefined();
    });
    
    it('should expire items based on TTL', () => {
      cache.set('key1', 'value1');
      
      // Move time forward just before expiration
      jest.advanceTimersByTime(99);
      expect(cache.get('key1')).toBe('value1');
      
      // Move time forward past expiration
      jest.advanceTimersByTime(2);
      expect(cache.get('key1')).toBeUndefined();
    });
    
    it('should honor custom TTL', () => {
      cache.set('key1', 'value1', 200); // 200ms TTL
      
      // Move time forward past default TTL but before custom TTL
      jest.advanceTimersByTime(150);
      expect(cache.get('key1')).toBe('value1');
      
      // Move time forward past custom TTL
      jest.advanceTimersByTime(51);
      expect(cache.get('key1')).toBeUndefined();
    });
  });
  
  describe('has', () => {
    it('should return true for existing non-expired keys', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
    });
    
    it('should return false for missing keys', () => {
      expect(cache.has('nonexistent')).toBe(false);
    });
    
    it('should return false for expired keys', () => {
      cache.set('key1', 'value1');
      jest.advanceTimersByTime(101);
      expect(cache.has('key1')).toBe(false);
    });
  });
  
  describe('delete', () => {
    it('should remove a key from the cache', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
      
      cache.delete('key1');
      expect(cache.get('key1')).toBeUndefined();
    });
    
    it('should return true when deleting an existing key', () => {
      cache.set('key1', 'value1');
      expect(cache.delete('key1')).toBe(true);
    });
    
    it('should return false when deleting a non-existent key', () => {
      expect(cache.delete('nonexistent')).toBe(false);
    });
  });
  
  describe('clear', () => {
    it('should remove all keys from the cache', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      cache.clear();
      
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBeUndefined();
      expect(cache.size()).toBe(0);
    });
  });
  
  describe('capacity management', () => {
    it('should remove expired items before evicting', () => {
      // Fill the cache with items that will expire at different times
      for (let i = 0; i < 10; i++) {
        // For items 0-4, use TTLs that will expire (10-40ms)
        // For items 5-9, use much longer TTLs (500-900ms)
        const ttl = i < 5 ? (i + 1) * 10 : (i + 1) * 100;
        cache.set(`key${i}`, `value${i}`, ttl);
      }
      
      // Advance time so half the items expire
      jest.advanceTimersByTime(50);
      
      // Add a new item - should remove expired items first
      cache.set('newKey', 'newValue');
      
      // Check that the cache still has the new item and non-expired old items
      expect(cache.get('newKey')).toBe('newValue');
      
      // Items with TTL 50ms or less should be gone
      for (let i = 0; i < 5; i++) {
        expect(cache.get(`key${i}`)).toBeUndefined();
      }
      
      // Items with TTL greater than 50ms should still be there
      for (let i = 5; i < 10; i++) {
        expect(cache.get(`key${i}`)).toBe(`value${i}`);
      }
    });
    
    it('should evict oldest items when at capacity', () => {
      // Fill the cache to capacity with non-expiring items
      for (let i = 0; i < 10; i++) {
        cache.set(`key${i}`, `value${i}`, 1000); // long TTL
      }
      
      // Add one more item
      cache.set('newKey', 'newValue');
      
      // The oldest item should have been evicted
      expect(cache.get('key0')).toBeUndefined();
      
      // Newer items should still be there
      for (let i = 1; i < 10; i++) {
        expect(cache.get(`key${i}`)).toBe(`value${i}`);
      }
      expect(cache.get('newKey')).toBe('newValue');
    });
  });
});
