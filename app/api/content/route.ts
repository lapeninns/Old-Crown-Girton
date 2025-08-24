import { NextResponse, NextRequest } from 'next/server';
import { getContentSmart, getCacheStats, preloadCriticalContent } from '@/src/lib/data/server-loader';
import { resolveEnv } from '@/src/lib/data/env';
import { createHash } from 'crypto';
import { gzipSync } from 'zlib';

export const revalidate = 300; // 5 minutes

// Performance monitoring endpoint
export async function HEAD() {
  const stats = getCacheStats();
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-Cache-Hits': stats.hits.toString(),
      'X-Cache-Misses': stats.misses.toString(),
      'X-Cache-Hit-Rate': (stats.hitRate * 100).toFixed(2),
      'X-Cache-Size': stats.size.toString(),
      'Cache-Control': 'no-cache'
    }
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const env = resolveEnv();
  const preload = searchParams.get('preload') === 'true';
  const compress = request.headers.get('accept-encoding')?.includes('gzip') ?? false;
  
  try {
    // Preload critical content if requested
    if (preload) {
      await preloadCriticalContent(env);
    }
    
    const content = await getContentSmart(env);
    
    // Generate ETag for cache validation
    const contentString = JSON.stringify(content);
    const etag = createHash('md5').update(contentString).digest('hex');
    
    // Check if client has current version
    const clientEtag = request.headers.get('if-none-match');
    if (clientEtag === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': getCacheControlHeader(env)
        }
      });
    }
    
    // Prepare response with compression if supported
    let responseBody: string | Buffer = contentString;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'ETag': etag,
      'Cache-Control': getCacheControlHeader(env),
      'X-Content-Source': 'smart-loader',
      'X-Environment': env
    };
    
    // Apply gzip compression for large content
    if (compress && contentString.length > 1024) {
      responseBody = gzipSync(contentString);
      headers['Content-Encoding'] = 'gzip';
      headers['Content-Length'] = responseBody.length.toString();
      headers['X-Compression-Ratio'] = (responseBody.length / contentString.length).toFixed(3);
    }
    
    // Add performance headers
    const stats = getCacheStats();
    headers['X-Cache-Performance'] = JSON.stringify({
      hitRate: Math.round(stats.hitRate * 100) / 100,
      averageLoadTime: Math.round(stats.averageLoadTime),
      cacheSize: stats.size
    });
    
    return new NextResponse(responseBody, {
      status: 200,
      headers
    });
    
  } catch (e: any) {
    console.error('Content API error:', e);
    
    return NextResponse.json(
      { 
        error: 'Failed to load content',
        details: process.env.NODE_ENV === 'development' ? e.message : undefined,
        timestamp: new Date().toISOString()
      }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Error-Source': 'content-api'
        }
      }
    );
  }
}

/**
 * Get environment-specific cache control headers
 */
function getCacheControlHeader(env: string): string {
  const cacheConfigs = {
    dev: 'public, max-age=60, s-maxage=60', // 1 minute
    staging: 'public, max-age=300, s-maxage=300, stale-while-revalidate=60', // 5 minutes
    prod: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=300' // 1 hour
  };
  
  return cacheConfigs[env as keyof typeof cacheConfigs] || cacheConfigs.dev;
}