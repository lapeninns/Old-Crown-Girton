/**
 * Production-safe request manager with TTL + LRU cache
 * Prevents memory leaks with proper cache eviction
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  lastAccessed: number;
  ttl: number;
}

interface RequestState {
  promise: Promise<any>;
  timestamp: number;
}

export class SmartRequestManager {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, RequestState>();
  private readonly maxCacheSize: number;
  private readonly defaultTTL: number;
  private cleanupTimer: number | null = null;
  
  constructor(options: {
    maxCacheSize?: number;
    defaultTTL?: number;
    cleanupInterval?: number;
  } = {}) {
    this.maxCacheSize = options.maxCacheSize || 50; // Much smaller cache
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000; // 5 minutes default
    
    // Periodic cleanup to prevent memory leaks
    const cleanupInterval = options.cleanupInterval || 60 * 1000; // 1 minute
    this.cleanupTimer = window.setInterval(() => {
      this.cleanup();
    }, cleanupInterval);
  }

  // Cleanup expired entries and enforce LRU eviction
  private cleanup() {
    const now = Date.now();
    const entriesToRemove: string[] = [];
    
    // Remove expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        entriesToRemove.push(key);
      }
    }
    
    entriesToRemove.forEach(key => {
      this.cache.delete(key);
    });
    
    // Enforce LRU if over size limit
    if (this.cache.size > this.maxCacheSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
      
      const toRemove = entries.length - this.maxCacheSize;
      for (let i = 0; i < toRemove; i++) {
        this.cache.delete(entries[i][0]);
      }
    }

    // Clean up stale pending requests (older than 30 seconds)
    const stalePending: string[] = [];
    for (const [key, state] of this.pendingRequests.entries()) {
      if (now - state.timestamp > 30000) {
        stalePending.push(key);
      }
    }
    stalePending.forEach(key => {
      this.pendingRequests.delete(key);
    });
  }

  // Get cache key with network awareness
  private getCacheKey(url: string, options: any = {}, networkAware = false): string {
    const baseKey = `${url}:${JSON.stringify(options)}`;
    
    if (networkAware && typeof navigator !== 'undefined') {
      const connection = (navigator as any)?.connection;
      const networkType = connection?.effectiveType || 'unknown';
      return `${baseKey}:${networkType}`;
    }
    
    return baseKey;
  }

  // Check if cache entry is still valid
  private isValidCacheEntry(entry: CacheEntry<any>): boolean {
    const now = Date.now();
    return (now - entry.timestamp) < entry.ttl;
  }

  // Network-aware TTL calculation
  private getNetworkAwareTTL(defaultTTL: number): number {
    if (typeof navigator === 'undefined') return defaultTTL;
    
    const connection = (navigator as any)?.connection;
    const effectiveType = connection?.effectiveType;
    
    // Longer TTL for slower networks to reduce requests
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return defaultTTL * 3; // 15 minutes for very slow networks
      case '3g':
        return defaultTTL * 2; // 10 minutes for slow networks  
      case '4g':
      default:
        return defaultTTL; // 5 minutes for fast networks
    }
  }

  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: {
      ttl?: number;
      networkAware?: boolean;
      priority?: 'high' | 'normal' | 'low';
    } = {}
  ): Promise<T> {
    const {
      ttl = this.defaultTTL,
      networkAware = true,
      priority = 'normal'
    } = options;

    const cacheKey = this.getCacheKey(key, options, networkAware);
    const networkAwareTTL = this.getNetworkAwareTTL(ttl);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isValidCacheEntry(cached)) {
      // Update last accessed for LRU
      cached.lastAccessed = Date.now();
      this.cache.set(cacheKey, cached);
      return cached.data as T;
    }

    // Check if request is already pending (deduplication)
    const pending = this.pendingRequests.get(cacheKey);
    if (pending) {
      return pending.promise as Promise<T>;
    }

    // Create new request with proper cleanup
    const requestPromise = this.createRequest(cacheKey, fetcher, networkAwareTTL, priority);
    
    this.pendingRequests.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Always clean up pending request
      this.pendingRequests.delete(cacheKey);
    }
  }

  private async createRequest<T>(
    cacheKey: string,
    fetcher: () => Promise<T>,
    ttl: number,
    priority: 'high' | 'normal' | 'low'
  ): Promise<T> {
    try {
      // Priority-based delay (for rate limiting)
      if (priority === 'low') {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const result = await fetcher();
      const now = Date.now();
      
      // Cache the result with TTL
      const entry: CacheEntry<T> = {
        data: result,
        timestamp: now,
        lastAccessed: now,
        ttl
      };
      
      // Ensure cache size before adding
      this.ensureCacheSize();
      this.cache.set(cacheKey, entry);
      
      return result;
    } catch (error) {
      // Don't cache errors, just propagate
      throw error;
    }
  }

  // Ensure cache doesn't exceed size before adding new entries
  private ensureCacheSize() {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove least recently used entry
      let oldestKey: string | null = null;
      let oldestAccess = Date.now();
      
      for (const [key, entry] of this.cache.entries()) {
        if (entry.lastAccessed < oldestAccess) {
          oldestAccess = entry.lastAccessed;
          oldestKey = key;
        }
      }
      
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }

  // Manual cache invalidation
  invalidate(key: string, networkAware = true) {
    const cacheKey = this.getCacheKey(key, {}, networkAware);
    this.cache.delete(cacheKey);
    this.pendingRequests.delete(cacheKey);
  }

  // Clear all cache (for memory pressure)
  clearAll() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  // Get cache stats for monitoring
  getStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      maxCacheSize: this.maxCacheSize
    };
  }

  // Proper cleanup on destroy
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clearAll();
  }
}

// Singleton instance with conservative defaults
export const globalRequestManager = new SmartRequestManager({
  maxCacheSize: 30, // Small cache for mobile devices
  defaultTTL: 3 * 60 * 1000, // 3 minutes
  cleanupInterval: 30 * 1000 // Clean every 30 seconds
});
