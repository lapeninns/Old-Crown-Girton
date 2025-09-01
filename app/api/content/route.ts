import { NextResponse } from 'next/server';
import { ContentSmartLoader } from '@/src/lib/data/loaders/ContentSmartLoader';
import { resolveEnv } from '@/src/lib/data/env';
import { 
  StandardizedApiResponseBuilder, 
  getEnvironmentCacheConfig,
  withRequestTiming 
} from '@/src/lib/data/api/standardizedResponse';

// Environment-specific revalidation
const env = resolveEnv();
const isProd = process.env.NODE_ENV === 'production';
export const revalidate = isProd ? 2700 : 600; // 45min prod, 10min dev

export async function GET(request: Request) {
  const env = resolveEnv();
  const cacheConfig = getEnvironmentCacheConfig('content', env);
  
  // Check for conditional requests
  const ifNoneMatch = request.headers.get('if-none-match');
  const ifModifiedSince = request.headers.get('if-modified-since');
  
  try {
    // Use enhanced smart loader with timing
    const timedLoader = withRequestTiming(
      () => ContentSmartLoader.loadSmart(env),
      'content'
    );
    
    const { result, timing } = await timedLoader();
    
    // Create standardized response
    const apiResponse = StandardizedApiResponseBuilder.fromSmartLoadResult(
      result,
      '2.0.0' // Enhanced API version
    );
    
    // Add timing information
    apiResponse.meta.loadTime = timing;
    
    // Handle conditional requests for better caching
    if (ifNoneMatch || ifModifiedSince) {
      const etag = StandardizedApiResponseBuilder.getETagFor(result.data, result.timestamp);
      const lastModified = new Date(result.timestamp);
      
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
    console.error('Enhanced Content API error:', error);
    
    const errorResponse = StandardizedApiResponseBuilder.error(
      'CONTENT_LOAD_FAILED',
      'Failed to load content data',
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

export async function HEAD(request: Request) {
  const env = resolveEnv();
  const cacheConfig = getEnvironmentCacheConfig('content', env);
  const ifNoneMatch = request.headers.get('if-none-match');
  const ifModifiedSince = request.headers.get('if-modified-since');

  try {
    const { result } = await withRequestTiming(() => ContentSmartLoader.loadSmart(env), 'content')();
    const etag = StandardizedApiResponseBuilder.getETagFor(result.data, result.timestamp);
    const lastModified = new Date(result.timestamp);
    const headers: Record<string, string> = {
      etag,
      'last-modified': lastModified.toUTCString(),
      'cache-control': `public, s-maxage=${Math.floor(cacheConfig.ttl / 1000)}, stale-while-revalidate=${Math.floor((cacheConfig.staleWhileRevalidate || 0) / 1000)}`,
      'x-request-id': `head_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      'x-cached': String(result.cached),
      'x-source': result.source,
      vary: 'Accept, Accept-Encoding, Authorization',
      'access-control-expose-headers': 'etag,last-modified,x-request-id,x-load-time,x-cached,x-source',
    };

    if (ifNoneMatch === etag || (ifModifiedSince && new Date(ifModifiedSince) >= lastModified)) {
      return new NextResponse(null, { status: 304, headers });
    }
    return new NextResponse(null, { status: 200, headers });
  } catch (error: any) {
    return new NextResponse(null, { status: 500 });
  }
}
