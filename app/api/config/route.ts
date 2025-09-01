import { NextResponse } from 'next/server';
import { getConfigData } from '@/src/lib/data/server-loader';
import { resolveEnv } from '@/src/lib/data/env';
import { 
  StandardizedApiResponseBuilder, 
  getEnvironmentCacheConfig,
  withRequestTiming 
} from '@/src/lib/data/api/standardizedResponse';

// Environment-specific revalidation
const isProd = process.env.NODE_ENV === 'production';
export const revalidate = isProd ? 1800 : 120; // 30min prod, 2min dev

export async function GET(request: Request) {
  const env = resolveEnv();
  const cacheConfig = getEnvironmentCacheConfig('config', env);
  
  // Check for conditional requests
  const ifNoneMatch = request.headers.get('if-none-match');
  const ifModifiedSince = request.headers.get('if-modified-since');
  
  try {
    // Use enhanced loader with timing
    const timedLoader = withRequestTiming(
      () => getConfigData(env),
      'config'
    );
    
    const { result: cfg, timing } = await timedLoader();
    
    // Only return safe client-visible fields
    const safeConfig = {
      env: cfg.env,
      featureFlags: cfg.featureFlags,
      api: { 
        baseUrl: cfg.api.baseUrl ?? null, 
        menuEndpoint: cfg.api.menuEndpoint ?? null,
        marketingEndpoint: cfg.api.marketingEndpoint ?? null,
        restaurantEndpoint: cfg.api.restaurantEndpoint ?? null,
        contentEndpoint: cfg.api.contentEndpoint ?? null,
      },
      cms: { enabled: cfg.cms.enabled },
      metadata: cfg.metadata,
    };
    
    // Create standardized response
    const apiResponse = StandardizedApiResponseBuilder.success(
      safeConfig,
      {
        cached: false, // Config is always fresh from loader
        source: 'filesystem',
        env,
        loadTime: timing,
        version: '2.0.0'
      }
    );
    
    // Handle conditional requests for better caching
    if (ifNoneMatch || ifModifiedSince) {
      const etag = StandardizedApiResponseBuilder['generateETag'](safeConfig, apiResponse.meta.timestamp);
      const lastModified = new Date(apiResponse.meta.timestamp);
      
      if (ifNoneMatch === etag || 
          (ifModifiedSince && new Date(ifModifiedSince) >= lastModified)) {
        return new NextResponse(null, { 
          status: 304,
          headers: {
            'etag': etag,
            'last-modified': lastModified.toUTCString(),
            'cache-control': `public, s-maxage=${Math.floor(cacheConfig.ttl / 1000)}, stale-while-revalidate=${Math.floor(cacheConfig.staleWhileRevalidate! / 1000)}`,
            'x-request-id': apiResponse.meta.requestId!,
            'x-cached': 'true'
          }
        });
      }
    }
    
    return StandardizedApiResponseBuilder.toNextResponse(apiResponse, cacheConfig);
    
  } catch (error: any) {
    console.error('Enhanced Config API error:', error);
    
    const errorResponse = StandardizedApiResponseBuilder.error(
      'CONFIG_LOAD_FAILED',
      'Failed to load configuration',
      {
        originalError: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      env
    );
    
    return StandardizedApiResponseBuilder.toNextResponse(
      errorResponse,
      { ttl: 60000, public: false } // 1 minute cache for errors
    );
  }
}
