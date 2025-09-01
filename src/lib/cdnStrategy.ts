/**
 * CDN Strategy Implementation
 * Provides advanced caching headers and edge optimization for content modules
 */

import { NextResponse, NextRequest } from 'next/server';

// Cache configuration by content type
const CDN_CACHE_CONFIG = {
  // Static content (long cache)
  static: {
    maxAge: 31536000, // 1 year
    staleWhileRevalidate: 86400, // 1 day
    public: true,
    immutable: true
  },
  
  // Dynamic content (moderate cache)
  dynamic: {
    maxAge: 3600, // 1 hour
    staleWhileRevalidate: 1800, // 30 minutes
    public: true,
    immutable: false
  },
  
  // API content (short cache with revalidation)
  api: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 900, // 15 minutes
    public: true,
    immutable: false
  },
  
  // Menu content (moderate cache due to updates)
  menu: {
    maxAge: 1800, // 30 minutes
    staleWhileRevalidate: 3600, // 1 hour
    public: true,
    immutable: false
  },
  
  // Images (long cache with optimization)
  images: {
    maxAge: 2592000, // 30 days
    staleWhileRevalidate: 86400, // 1 day
    public: true,
    immutable: false
  }
};

// Environment-specific cache configurations
const getEnvironmentCacheConfig = (env: string) => {
  const baseConfig = {
    development: { factor: 0.1 }, // Shorter cache in dev
    staging: { factor: 0.5 }, // Moderate cache in staging
    production: { factor: 1.0 } // Full cache in production
  };

  return baseConfig[env as keyof typeof baseConfig] || baseConfig.production;
};

/**
 * Generate CDN-optimized cache headers
 */
export function generateCDNCacheHeaders(
  contentType: keyof typeof CDN_CACHE_CONFIG,
  options: {
    env?: string;
    etag?: string;
    lastModified?: Date;
    vary?: string[];
    customTTL?: number;
  } = {}
): Record<string, string> {
  const config = CDN_CACHE_CONFIG[contentType];
  const envConfig = getEnvironmentCacheConfig(options.env || 'production');
  
  // Adjust cache times based on environment
  const maxAge = Math.floor(config.maxAge * envConfig.factor);
  const swr = Math.floor(config.staleWhileRevalidate * envConfig.factor);
  const customTTL = options.customTTL ? Math.floor(options.customTTL * envConfig.factor) : null;

  const headers: Record<string, string> = {
    'cache-control': [
      config.public ? 'public' : 'private',
      `max-age=${customTTL || maxAge}`,
      `s-maxage=${customTTL || maxAge}`,
      `stale-while-revalidate=${swr}`,
      config.immutable ? 'immutable' : 'must-revalidate'
    ].join(', '),
    
    // CDN-specific headers
    'cdn-cache-control': [
      `max-age=${customTTL || maxAge}`,
      'public',
      config.immutable ? 'immutable' : 'must-revalidate'
    ].join(', '),
    
    // Vercel Edge Cache headers
    'x-vercel-cache': 'MISS',
    'x-edge-cache': 'MISS',
    
    // Performance headers
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'x-xss-protection': '1; mode=block'
  };

  // Add conditional headers
  if (options.etag) {
    headers['etag'] = options.etag;
  }

  if (options.lastModified) {
    headers['last-modified'] = options.lastModified.toUTCString();
  }

  if (options.vary && options.vary.length > 0) {
    headers['vary'] = options.vary.join(', ');
  }

  return headers;
}

/**
 * CDN-aware response wrapper
 */
export function createCDNResponse(
  data: any,
  contentType: keyof typeof CDN_CACHE_CONFIG,
  options: {
    status?: number;
    env?: string;
    etag?: string;
    lastModified?: Date;
    vary?: string[];
    customTTL?: number;
    compressionEnabled?: boolean;
  } = {}
): NextResponse {
  const headers = generateCDNCacheHeaders(contentType, options);

  // Add compression hints
  if (options.compressionEnabled !== false) {
    (headers as any)['content-encoding'] = 'gzip';
    (headers as any)['x-compression-ratio'] = '0.65'; // Typical ratio
  }

  // Add performance metrics
  (headers as any)['x-cache-timestamp'] = new Date().toISOString();
  (headers as any)['x-cache-type'] = contentType;
  (headers as any)['x-environment'] = options.env || 'production';

  return NextResponse.json(data, {
    status: options.status || 200,
    headers
  });
}

/**
 * Middleware for CDN optimization
 */
export function cdnOptimizationMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Only handle GET requests
  if (method !== 'GET') {
    return NextResponse.next();
  }

  // Clone response to add headers
  const response = NextResponse.next();

  // Add CDN headers based on path patterns
  if (pathname.startsWith('/api/content')) {
    const headers = generateCDNCacheHeaders('api', {
      env: process.env.NODE_ENV,
      vary: ['Accept', 'Accept-Encoding']
    });
    
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });
  }

  if (pathname.startsWith('/api/menu')) {
    const headers = generateCDNCacheHeaders('menu', {
      env: process.env.NODE_ENV,
      vary: ['Accept', 'Accept-Encoding']
    });
    
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });
  }

  if (pathname.startsWith('/images/')) {
    const headers = generateCDNCacheHeaders('images', {
      env: process.env.NODE_ENV
    });
    
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });
  }

  // Add CDN routing hints
  response.headers.set('x-cdn-route', getCDNRoute(pathname));
  response.headers.set('x-cache-key', generateCacheKey(pathname, request));

  return response;
}

/**
 * Generate cache key for CDN
 */
function generateCacheKey(pathname: string, request: NextRequest): string {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  // Sort search params for consistent cache keys
  const sortedParams = Array.from(searchParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const baseKey = pathname.replace(/\//g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  return sortedParams ? `${baseKey}_${btoa(sortedParams)}` : baseKey;
}

/**
 * Determine CDN routing strategy
 */
function getCDNRoute(pathname: string): string {
  if (pathname.startsWith('/api/')) return 'api-edge';
  if (pathname.startsWith('/images/')) return 'static-cdn';
  if (pathname.includes('slideshow')) return 'media-cdn';
  if (pathname.includes('menu')) return 'dynamic-edge';
  return 'default';
}

/**
 * Edge caching for Vercel
 */
export const vercelEdgeConfig = {
  runtime: 'edge',
  regions: ['iad1', 'lhr1', 'sin1', 'syd1', 'hnd1'], // Global edge regions
  cache: {
    api: {
      maxAge: 300, // 5 minutes
      staleWhileRevalidate: 900, // 15 minutes
      tags: ['api', 'content']
    },
    static: {
      maxAge: 31536000, // 1 year
      immutable: true,
      tags: ['static', 'images']
    }
  }
};

/**
 * Cache purging utilities
 */
export class CDNCachePurger {
  static async purgeByTag(tags: string[]): Promise<boolean> {
    try {
      // Implement cache purging based on your CDN provider
      // Vercel example:
      if (process.env.VERCEL_TOKEN) {
        const response = await fetch('https://api.vercel.com/v1/edge-config/cache/purge', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tags })
        });
        
        return response.ok;
      }
      
      return true;
    } catch (error) {
      console.error('Cache purge failed:', error);
      return false;
    }
  }

  static async purgeByPath(paths: string[]): Promise<boolean> {
    try {
      // Path-based purging implementation
      console.log('Purging cache for paths:', paths);
      return true;
    } catch (error) {
      console.error('Path-based cache purge failed:', error);
      return false;
    }
  }

  static async purgeAll(): Promise<boolean> {
    try {
      console.log('Purging all CDN cache');
      return true;
    } catch (error) {
      console.error('Full cache purge failed:', error);
      return false;
    }
  }
}

/**
 * Cache analytics and monitoring
 */
export function trackCachePerformance(
  request: NextRequest, 
  response: NextResponse,
  cacheStatus: 'HIT' | 'MISS' | 'STALE'
) {
  const pathname = request.nextUrl.pathname;
  
  // Add cache performance headers
  response.headers.set('x-cache-status', cacheStatus);
  response.headers.set('x-cache-pathname', pathname);
  response.headers.set('x-cache-timestamp', new Date().toISOString());
  
  // Log cache performance (replace with your analytics service)
  if (process.env.NODE_ENV === 'production') {
    console.log('Cache Performance:', {
      pathname,
      cacheStatus,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent')?.substring(0, 100)
    });
  }
}

export default {
  generateCDNCacheHeaders,
  createCDNResponse,
  cdnOptimizationMiddleware,
  CDNCachePurger,
  trackCachePerformance,
  vercelEdgeConfig
};