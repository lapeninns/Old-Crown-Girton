/**
 * Standardized API Response Utilities
 * 
 * Provides consistent response format across all Restaurant_BP API routes with:
 * - Standardized response structure
 * - Enhanced ISR headers
 * - Performance monitoring integration
 * - Error handling and logging
 */

import { NextResponse } from 'next/server';
import type { AppEnv } from '../env';
import type { SmartLoadResult } from '../loaders/BaseSmartLoader';

export interface StandardizedApiResponse<T = any> {
  data: T;
  meta: {
    cached: boolean;
    timestamp: string;
    source: 'api' | 'filesystem' | 'cache';
    env: AppEnv;
    loadTime?: number;
    version?: string;
    requestId?: string;
  };
  status: 'success' | 'error';
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ApiCacheConfig {
  ttl: number;
  staleWhileRevalidate?: number;
  maxAge?: number;
  enableETag?: boolean;
  enableLastModified?: boolean;
  public?: boolean;
}

export class StandardizedApiResponseBuilder {
  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a successful API response with enhanced metadata
   */
  static success<T>(
    data: T,
    config: {
      cached?: boolean;
      source?: 'api' | 'filesystem' | 'cache';
      env: AppEnv;
      loadTime?: number;
      version?: string;
      timestamp?: string;
    }
  ): StandardizedApiResponse<T> {
    return {
      data,
      meta: {
        cached: config.cached ?? false,
        timestamp: config.timestamp ?? new Date().toISOString(),
        source: config.source ?? 'filesystem',
        env: config.env,
        loadTime: config.loadTime,
        version: config.version ?? '1.0.0',
        requestId: this.generateRequestId()
      },
      status: 'success'
    };
  }

  /**
   * Create a successful API response from SmartLoadResult
   */
  static fromSmartLoadResult<T>(
    result: SmartLoadResult<T>,
    version = '1.0.0'
  ): StandardizedApiResponse<T> {
    return {
      data: result.data,
      meta: {
        cached: result.cached,
        timestamp: result.timestamp,
        source: result.source,
        env: result.env,
        loadTime: result.loadTime,
        version,
        requestId: this.generateRequestId()
      },
      status: 'success'
    };
  }

  /**
   * Create an error API response
   */
  static error(
    code: string,
    message: string,
    details?: any,
    env?: AppEnv
  ): StandardizedApiResponse<null> {
    return {
      data: null,
      meta: {
        cached: false,
        timestamp: new Date().toISOString(),
        source: 'api',
        env: env ?? 'app',
        requestId: this.generateRequestId()
      },
      status: 'error',
      error: {
        code,
        message,
        details
      }
    };
  }

  /**
   * Convert standardized response to NextResponse with enhanced headers
   */
  static toNextResponse<T>(
    response: StandardizedApiResponse<T>,
    cacheConfig: ApiCacheConfig
  ): NextResponse {
    const headers: Record<string, string> = {};

    // Cache control headers
    const cacheControl = [];
    if (cacheConfig.public !== false) {
      cacheControl.push('public');
    }
    if (cacheConfig.maxAge) {
      cacheControl.push(`max-age=${cacheConfig.maxAge}`);
    }
    if (cacheConfig.ttl) {
      cacheControl.push(`s-maxage=${Math.floor(cacheConfig.ttl / 1000)}`);
    }
    if (cacheConfig.staleWhileRevalidate) {
      cacheControl.push(`stale-while-revalidate=${Math.floor(cacheConfig.staleWhileRevalidate / 1000)}`);
    }

    if (cacheControl.length > 0) {
      headers['cache-control'] = cacheControl.join(', ');
    }

    // ETag for cache validation
    if (cacheConfig.enableETag && response.status === 'success') {
      const etag = this.generateETag(response.data, response.meta.timestamp);
      headers['etag'] = etag;
    }

    // Last-Modified header
    if (cacheConfig.enableLastModified && response.status === 'success') {
      headers['last-modified'] = new Date(response.meta.timestamp).toUTCString();
    }

    // Performance headers
    if (response.meta.loadTime) {
      headers['x-load-time'] = response.meta.loadTime.toString();
    }
    headers['x-request-id'] = response.meta.requestId || 'unknown';
    headers['x-source'] = response.meta.source;
    headers['x-cached'] = response.meta.cached.toString();
    // Expose useful headers to browsers for programmatic access
    headers['access-control-expose-headers'] = [
      'etag',
      'last-modified',
      'x-request-id',
      'x-load-time',
      'x-cached',
      'x-source',
    ].join(', ');

    // Vary header for cache optimization
    headers['vary'] = 'Accept, Accept-Encoding, Authorization';

    const status = response.status === 'success' ? 200 : 500;
    
    return NextResponse.json(response, { 
      status,
      headers 
    });
  }

  /**
   * Generate ETag for cache validation
   */
  private static generateETag(data: any, timestamp: string): string {
    const content = JSON.stringify(data) + timestamp;
    // Simple hash function for ETag
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `"${Math.abs(hash).toString(16)}"`;
  }

  // Public helper to compute an ETag without exposing internals in route handlers
  static getETagFor(data: any, timestamp: string): string {
    return this.generateETag(data, timestamp);
  }
}

/**
 * Helper function to get environment-specific cache configuration
 */
export function getEnvironmentCacheConfig(
  resourceType: 'menu' | 'restaurant' | 'marketing' | 'content' | 'config',
  env: AppEnv
): ApiCacheConfig {
  const isProd = process.env.NODE_ENV === 'production';
  
  const baseConfigs = {
    menu: {
      ttl: isProd ? 30 * 60 * 1000 : 5 * 60 * 1000, // 30min prod, 5min dev
      staleWhileRevalidate: isProd ? 60 * 60 * 1000 : 10 * 60 * 1000, // 60min prod, 10min dev
      maxAge: 60, // 1 minute client cache
    },
    restaurant: {
      ttl: isProd ? 60 * 60 * 1000 : 10 * 60 * 1000, // 60min prod, 10min dev
      staleWhileRevalidate: isProd ? 2 * 60 * 60 * 1000 : 20 * 60 * 1000, // 2hr prod, 20min dev
      maxAge: 300, // 5 minutes client cache
    },
    marketing: {
      ttl: isProd ? 15 * 60 * 1000 : 5 * 60 * 1000, // 15min prod, 5min dev
      staleWhileRevalidate: isProd ? 30 * 60 * 1000 : 10 * 60 * 1000, // 30min prod, 10min dev
      maxAge: 60, // 1 minute client cache
    },
    content: {
      ttl: isProd ? 45 * 60 * 1000 : 10 * 60 * 1000, // 45min prod, 10min dev
      staleWhileRevalidate: isProd ? 2 * 60 * 60 * 1000 : 20 * 60 * 1000, // 2hr prod, 20min dev
      maxAge: 300, // 5 minutes client cache
    },
    config: {
      ttl: isProd ? 30 * 60 * 1000 : 2 * 60 * 1000, // 30min prod, 2min dev
      staleWhileRevalidate: isProd ? 60 * 60 * 1000 : 5 * 60 * 1000, // 60min prod, 5min dev
      maxAge: 120, // 2 minutes client cache
    }
  };

  return {
    ...baseConfigs[resourceType],
    enableETag: true,
    enableLastModified: true,
    public: true
  };
}

/**
 * Middleware for request timing and logging
 */
export function withRequestTiming<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  resourceType: string
): (...args: T) => Promise<{ result: R; timing: number }> {
  return async (...args: T) => {
    const startTime = Date.now();
    
    try {
      const result = await fn(...args);
      const timing = Date.now() - startTime;
      
      // Log slow requests
      if (timing > 1000) {
        console.warn(`Slow ${resourceType} API request: ${timing}ms`);
      }
      
      return { result, timing };
    } catch (error) {
      const timing = Date.now() - startTime;
      console.error(`${resourceType} API error after ${timing}ms:`, error);
      throw error;
    }
  };
}

// Re-export for convenience
export type { SmartLoadResult };
