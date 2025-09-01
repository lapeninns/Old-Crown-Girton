/**
 * Enhanced Base Smart Loader
 * 
 * Extends the existing Smart Loader pattern with:
 * - Standardized response format
 * - Enhanced error handling and retry logic
 * - Performance monitoring integration
 * - Type-safe fallback strategies
 * - Backward compatibility with existing loaders
 */

import 'server-only';
import type { ZodTypeAny } from 'zod';
import type { AppEnv } from '../env';
import { globalCache, createCacheKey } from '../cache';

export interface SmartLoadResult<T> {
  data: T;
  cached: boolean;
  timestamp: string;
  source: 'api' | 'filesystem' | 'cache';
  env: AppEnv;
  loadTime?: number;
  retryCount?: number;
}

export interface SmartLoadConfig {
  enableCache?: boolean;
  ttl?: number;
  enableCompression?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  fallbackToCache?: boolean;
  enablePerformanceMonitoring?: boolean;
}

export interface LoaderMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  apiSuccesses: number;
  apiFallbacks: number;
  filesystemFallbacks: number;
  errors: number;
  averageLoadTime: number;
  lastUpdated: string;
}

export abstract class BaseSmartLoader<T> {
  protected metrics: LoaderMetrics;
  protected abstract schema: ZodTypeAny;
  protected abstract resourceName: string;

  constructor() {
    this.metrics = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      apiSuccesses: 0,
      apiFallbacks: 0,
      filesystemFallbacks: 0,
      errors: 0,
      averageLoadTime: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Enhanced smart loading with standardized response format
   */
  async loadSmart(
    env: AppEnv,
    config: SmartLoadConfig = {}
  ): Promise<SmartLoadResult<T>> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    const defaultConfig: SmartLoadConfig = {
      enableCache: true,
      ttl: this.getTTL(env),
      enableCompression: process.env.NODE_ENV === 'production',
      maxRetries: 3,
      retryDelay: 1000,
      fallbackToCache: true,
      enablePerformanceMonitoring: true,
      ...config
    };

    try {
      // Check cache first if enabled
      if (defaultConfig.enableCache) {
        const cachedResult = await this.tryLoadFromCache(env, defaultConfig);
        if (cachedResult) {
          this.metrics.cacheHits++;
          return cachedResult;
        }
        this.metrics.cacheMisses++;
      }

      // Try API first if CMS is enabled
      const apiResult = await this.tryLoadFromAPI(env, defaultConfig);
      if (apiResult) {
        this.metrics.apiSuccesses++;
        const result = this.createResult(apiResult, 'api', env, startTime);
        
        // Cache the result
        if (defaultConfig.enableCache) {
          await this.cacheResult(env, result, defaultConfig);
        }
        
        return result;
      }

      // Fallback to filesystem
      this.metrics.apiFallbacks++;
      const filesystemResult = await this.loadFromFilesystem(env);
      this.metrics.filesystemFallbacks++;
      
      const result = this.createResult(filesystemResult, 'filesystem', env, startTime);
      
      // Cache filesystem result
      if (defaultConfig.enableCache) {
        await this.cacheResult(env, result, defaultConfig);
      }
      
      return result;

    } catch (error) {
      this.metrics.errors++;
      
      // Try to return stale cache data as last resort
      if (defaultConfig.fallbackToCache) {
        const staleResult = await this.tryLoadStaleFromCache(env);
        if (staleResult) {
          console.warn(`${this.resourceName} loader: Using stale cache data due to error:`, error);
          return staleResult;
        }
      }
      
      throw new Error(`Failed to load ${this.resourceName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      const loadTime = Date.now() - startTime;
      this.updateMetrics(loadTime);
    }
  }

  /**
   * Backward compatibility method - returns only data for existing components
   */
  async load(env: AppEnv): Promise<T> {
    const result = await this.loadSmart(env);
    return result.data;
  }

  /**
   * Get current loader metrics
   */
  getMetrics(): LoaderMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics (useful for testing)
   */
  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      apiSuccesses: 0,
      apiFallbacks: 0,
      filesystemFallbacks: 0,
      errors: 0,
      averageLoadTime: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  // Abstract methods to be implemented by specific loaders
  protected abstract loadFromFilesystem(env: AppEnv): Promise<T>;
  protected abstract tryLoadFromAPI(env: AppEnv, config: SmartLoadConfig): Promise<T | null>;
  protected abstract getTTL(env: AppEnv): number;

  // Protected helper methods
  protected async tryLoadFromCache(
    env: AppEnv, 
    config: SmartLoadConfig
  ): Promise<SmartLoadResult<T> | null> {
    // Note: PerformanceCacheManager expects a loader function in get()
    // For now, we'll skip cache checking in the loader pattern
    // and rely on cache management at a higher level
    return null;
  }

  protected async tryLoadStaleFromCache(env: AppEnv): Promise<SmartLoadResult<T> | null> {
    const cacheKey = createCacheKey(this.resourceName, env);
    
    try {
      // Try to get stale data by using a very high TTL
      const staleData = await globalCache.get(cacheKey, null as any, {
        ttl: Number.MAX_SAFE_INTEGER, // Effectively no TTL check
        enableCompression: false
      });
      
      if (staleData) {
        return {
          data: staleData as T,
          cached: true,
          timestamp: new Date().toISOString(), // Use current timestamp for stale data
          source: 'cache',
          env
        };
      }
    } catch (error) {
      console.warn(`Stale cache read error for ${this.resourceName}:`, error);
    }
    
    return null;
  }

  protected async cacheResult(
    env: AppEnv, 
    result: SmartLoadResult<T>, 
    config: SmartLoadConfig
  ): Promise<void> {
    // Note: The PerformanceCacheManager doesn't expose a public set method
    // Caching is handled through the get() method with loader functions
    // This method is kept for interface compatibility but doesn't cache directly
    console.debug(`Caching would store ${this.resourceName} for env ${env}`);
  }

  protected createResult(
    data: T, 
    source: 'api' | 'filesystem' | 'cache', 
    env: AppEnv, 
    startTime: number,
    retryCount = 0
  ): SmartLoadResult<T> {
    return {
      data,
      cached: false,
      timestamp: new Date().toISOString(),
      source,
      env,
      loadTime: Date.now() - startTime,
      retryCount
    };
  }

  protected updateMetrics(loadTime: number): void {
    this.metrics.averageLoadTime = 
      (this.metrics.averageLoadTime * (this.metrics.totalRequests - 1) + loadTime) / 
      this.metrics.totalRequests;
    this.metrics.lastUpdated = new Date().toISOString();
  }

  protected async validateAndParse(data: any): Promise<T> {
    const result = this.schema.safeParse(data);
    if (!result.success) {
      throw new Error(`Schema validation failed for ${this.resourceName}: ${JSON.stringify(result.error.flatten())}`);
    }
    return result.data;
  }

  protected async fetchWithRetry(
    url: string, 
    config: SmartLoadConfig,
    init?: RequestInit
  ): Promise<Response> {
    // Delegate to fetchWithResilience for consistent retry/backoff/timeouts
    const { fetchWithResilience } = await import('../fetchWithResilience');
    return fetchWithResilience(url, { ...init, headers: { 'accept': 'application/json', 'cache-control': 'no-store', ...(init?.headers || {}) } }, { tries: (config.maxRetries || 3) + 1, timeoutMs: 5000, baseBackoffMs: config.retryDelay || 1000 });
  }
}