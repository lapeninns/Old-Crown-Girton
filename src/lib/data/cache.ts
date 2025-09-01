/**
 * Performance Cache Manager for Content Loading
 * 
 * Provides advanced caching strategies for content data with:
 * - In-memory caching with TTL
 * - Compression support
 * - Cache warming and preloading
 * - Performance metrics tracking
 * - Intelligent cache invalidation
 */

import { LRUCache } from 'lru-cache';
import { gzipSync, gunzipSync } from 'zlib';
import type { Content, Menu, Marketing, Restaurant, AppConfig } from './schemas';
import type { AppEnv } from './env';

interface CacheEntry<T> {
  data: T;
  compressed?: Buffer;
  timestamp: number;
  accessCount: number;
  lastAccess: number;
  size: number;
  etag?: string;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  compressionRatio: number;
  averageLoadTime: number;
  totalSize: number;
}

interface CacheConfig {
  maxSize: number;
  ttl: number;
  enableCompression: boolean;
  compressionThreshold: number;
  enableMetrics: boolean;
  warmupUrls?: string[];
}

export class PerformanceCacheManager {
  private cache: LRUCache<string, CacheEntry<any>>;
  private metrics: CacheMetrics;
  private config: CacheConfig;
  private warmupPromise?: Promise<void>;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 50 * 1024 * 1024, // 50MB default
      ttl: 5 * 60 * 1000, // 5 minutes default
      enableCompression: true,
      compressionThreshold: 1024, // 1KB
      enableMetrics: true,
      ...config
    };

    this.cache = new LRUCache<string, CacheEntry<any>>({
      max: 100, // max entries
      maxSize: this.config.maxSize,
      ttl: this.config.ttl,
      sizeCalculation: (entry) => entry.size,
      dispose: (entry) => {
        if (this.config.enableMetrics) {
          this.metrics.evictions++;
          this.metrics.totalSize -= entry.size;
        }
      }
    });

    this.metrics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      compressionRatio: 0,
      averageLoadTime: 0,
      totalSize: 0
    };

    // Auto-warmup if URLs provided
    if (this.config.warmupUrls && this.config.warmupUrls.length > 0) {
      this.warmupPromise = this.warmupCache();
    }
  }

  /**
   * Get cached data with performance optimizations
   */
  async get<T>(key: string, loader: () => Promise<T>, options?: {
    ttl?: number;
    enableCompression?: boolean;
    etag?: string;
  }): Promise<T> {
    const startTime = Date.now();
    const fullKey = this.buildKey(key, options?.etag);

    // Check cache first
    const cached = this.cache.get(fullKey);
    if (cached && this.isValid(cached, options?.etag)) {
      cached.accessCount++;
      cached.lastAccess = Date.now();
      
      if (this.config.enableMetrics) {
        this.metrics.hits++;
      }

      // Return compressed or raw data
      return cached.compressed ? 
        JSON.parse(gunzipSync(new Uint8Array(cached.compressed)).toString()) : 
        cached.data;
    }

    // Cache miss - load data
    if (this.config.enableMetrics) {
      this.metrics.misses++;
    }

    try {
      const data = await loader();
      const loadTime = Date.now() - startTime;

      // Store in cache with optimization
      await this.set(fullKey, data, {
        ttl: options?.ttl,
        enableCompression: options?.enableCompression,
        etag: options?.etag,
        loadTime
      });

      return data;
    } catch (error) {
      // If cache has stale data, return it as fallback
      if (cached) {
        console.warn('Loader failed, returning stale cache data:', error);
        return cached.compressed ? 
          JSON.parse(gunzipSync(new Uint8Array(cached.compressed)).toString()) : 
          cached.data;
      }
      throw error;
    }
  }

  /**
   * Set cache entry with compression and metrics
   */
  private async set<T>(key: string, data: T, options?: {
    ttl?: number;
    enableCompression?: boolean;
    etag?: string;
    loadTime?: number;
  }): Promise<void> {
    const serialized = JSON.stringify(data);
    const size = Buffer.byteLength(serialized, 'utf8');
    
    let compressed: Buffer | undefined;
    let finalSize = size;

    // Apply compression if enabled and data is large enough
    const shouldCompress = (options?.enableCompression ?? this.config.enableCompression) && 
                          size > this.config.compressionThreshold;

    if (shouldCompress) {
      compressed = gzipSync(serialized);
      finalSize = compressed.length;

      // Update compression metrics
      if (this.config.enableMetrics) {
        const ratio = finalSize / size;
        this.metrics.compressionRatio = 
          (this.metrics.compressionRatio + ratio) / 2;
      }
    }

    const entry: CacheEntry<T> = {
      data: shouldCompress ? undefined as any : data,
      compressed,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccess: Date.now(),
      size: finalSize,
      etag: options?.etag
    };

    // Set with custom TTL if provided
    if (options?.ttl) {
      this.cache.set(key, entry, { ttl: options.ttl });
    } else {
      this.cache.set(key, entry);
    }

    // Update metrics
    if (this.config.enableMetrics) {
      this.metrics.totalSize += finalSize;
      
      if (options?.loadTime) {
        this.metrics.averageLoadTime = 
          (this.metrics.averageLoadTime + options.loadTime) / 2;
      }
    }
  }

  /**
   * Preload content for performance optimization
   */
  async preload<T>(key: string, loader: () => Promise<T>, options?: {
    priority?: 'high' | 'normal' | 'low';
    ttl?: number;
  }): Promise<void> {
    // Don't preload if already cached and valid
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (cached && this.isValid(cached)) {
        return;
      }
    }

    // Execute preload based on priority
    const preloadPromise = this.get(key, loader, { ttl: options?.ttl });

    if (options?.priority === 'high') {
      await preloadPromise;
    } else {
      // Low priority - don't block
      preloadPromise.catch(err => 
        console.warn(`Preload failed for ${key}:`, err)
      );
    }
  }

  /**
   * Warm up cache with common content
   */
  private async warmupCache(): Promise<void> {
    if (!this.config.warmupUrls) return;

    const warmupPromises = this.config.warmupUrls.map(async (url) => {
      try {
        const { fetchWithResilience } = await import('./fetchWithResilience');
        const response = await fetchWithResilience(url, {
          method: 'HEAD',
          cache: 'no-store'
        });
        
        if (response.ok) {
          // Preload this content
          const key = this.urlToKey(url);
          await this.preload(key, async () => {
            const { fetchWithResilience } = await import('./fetchWithResilience');
            const r = await fetchWithResilience(url);
            return r.json();
          }, {
            priority: 'normal'
          });
        }
      } catch (error) {
        console.warn(`Cache warmup failed for ${url}:`, error);
      }
    });

    await Promise.allSettled(warmupPromises);
  }

  /**
   * Invalidate cache entries
   */
  invalidate(pattern?: string | RegExp): number {
    let count = 0;

    if (!pattern) {
      // Clear all
      count = this.cache.size;
      this.cache.clear();
      this.resetMetrics();
      return count;
    }

    // Pattern-based invalidation
    const keys = Array.from(this.cache.keys());
    const isRegex = pattern instanceof RegExp;

    for (const key of keys) {
      const shouldDelete = isRegex ? 
        pattern.test(key) : 
        key.includes(pattern as string);

      if (shouldDelete) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheMetrics & {
    size: number;
    hitRate: number;
    cacheSize: number;
    oldestEntry?: number;
    newestEntry?: number;
  } {
    const total = this.metrics.hits + this.metrics.misses;
    const hitRate = total > 0 ? this.metrics.hits / total : 0;

    let oldest: number | undefined;
    let newest: number | undefined;

    // Calculate age statistics
    for (const entry of Array.from(this.cache.values())) {
      if (!oldest || entry.timestamp < oldest) oldest = entry.timestamp;
      if (!newest || entry.timestamp > newest) newest = entry.timestamp;
    }

    return {
      ...this.metrics,
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      cacheSize: this.cache.calculatedSize || 0,
      oldestEntry: oldest,
      newestEntry: newest
    };
  }

  /**
   * Optimize cache performance
   */
  optimize(): {
    removedStale: number;
    compressedEntries: number;
    freedSpace: number;
  } {
    let removedStale = 0;
    let compressedEntries = 0;
    let freedSpace = 0;

    const now = Date.now();
    const staleThreshold = 30 * 60 * 1000; // 30 minutes

    for (const [key, entry] of Array.from(this.cache.entries())) {
      // Remove stale entries that haven't been accessed recently
      if (now - entry.lastAccess > staleThreshold && entry.accessCount < 2) {
        freedSpace += entry.size;
        this.cache.delete(key);
        removedStale++;
        continue;
      }

      // Compress frequently accessed large entries
      if (!entry.compressed && 
          entry.size > this.config.compressionThreshold && 
          entry.accessCount > 5) {
        try {
          const serialized = JSON.stringify(entry.data);
          const compressed = gzipSync(serialized);
          
          if (compressed.length < entry.size * 0.8) { // Only if significant savings
            entry.compressed = compressed;
            entry.data = undefined as any;
            freedSpace += entry.size - compressed.length;
            entry.size = compressed.length;
            compressedEntries++;
          }
        } catch (error) {
          console.warn(`Compression failed for ${key}:`, error);
        }
      }
    }

    return { removedStale, compressedEntries, freedSpace };
  }

  /**
   * Apply cache configuration based on NODE_ENV
   */
  applyEnvironmentConfig(): void {
    const isProd = process.env.NODE_ENV === 'production';
    
    const config = {
      ttl: isProd ? 60 * 60 * 1000 : 60 * 1000, // 1 hour in prod, 1 minute in dev
      enableCompression: isProd,
      maxSize: isProd ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 100MB in prod, 10MB in dev
    };

    this.config = { ...this.config, ...config };
    this.cache.ttl = config.ttl;
  }

  // Private helper methods

  private buildKey(key: string, etag?: string): string {
    return etag ? `${key}:${etag}` : key;
  }

  private isValid(entry: CacheEntry<any>, etag?: string): boolean {
    // Check TTL
    if (Date.now() - entry.timestamp > this.config.ttl) {
      return false;
    }

    // Check ETag if provided
    if (etag && entry.etag && entry.etag !== etag) {
      return false;
    }

    return true;
  }

  private urlToKey(url: string): string {
    return url.replace(/[^a-zA-Z0-9]/g, '_');
  }

  private resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      compressionRatio: 0,
      averageLoadTime: 0,
      totalSize: 0
    };
  }
}

// Global cache instance
export const globalCache = new PerformanceCacheManager({
  maxSize: 50 * 1024 * 1024, // 50MB
  ttl: 10 * 60 * 1000, // 10 minutes
  enableCompression: true,
  compressionThreshold: 1024,
  enableMetrics: true
});

// Helper function to create environment-specific cache keys
export function createCacheKey(type: string, env: AppEnv, additionalParams?: Record<string, string>): string {
  const params = additionalParams ? 
    Object.entries(additionalParams).map(([k, v]) => `${k}:${v}`).join('|') : 
    '';
  return params ? `${type}:${env}:${params}` : `${type}:${env}`;
}