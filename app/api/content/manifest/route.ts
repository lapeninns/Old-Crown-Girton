import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

// Security and validation
const ALLOWED_ENVIRONMENTS = ['dev', 'staging', 'prod'] as const;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

// Cache for rate limiting (in production, use Redis or similar)
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();

// Validation schema
const QuerySchema = z.object({
  env: z.enum(ALLOWED_ENVIRONMENTS).optional().default('prod'),
  version: z.string().optional(),
  bust: z.string().optional(), // Cache busting parameter
});

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Rate limiting
    const clientIP = request.ip || 'unknown';
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': Math.max(0, RATE_LIMIT_MAX_REQUESTS - rateLimitResult.count).toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          }
        }
      );
    }
    
    // Validate and sanitize query parameters
    const url = new URL(request.url);
    const queryResult = QuerySchema.safeParse({
      env: url.searchParams.get('env'),
      version: url.searchParams.get('version'),
      bust: url.searchParams.get('bust'),
    });
    
    if (!queryResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters',
          details: queryResult.error.errors
        },
        { status: 400 }
      );
    }
    
    const { env: environment, version, bust } = queryResult.data;
    
    const contentDir = path.join(process.cwd(), 'config', 'content');
    const manifestPath = path.join(contentDir, 'manifest.json');
    
    // Check if manifest file exists
    try {
      await fs.access(manifestPath);
    } catch {
      return NextResponse.json(
        { error: 'Content manifest not found' },
        { status: 404 }
      );
    }
    
    // Read and parse manifest with error handling
    let manifest;
    try {
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      manifest = JSON.parse(manifestContent);
    } catch (parseError) {
      console.error('Manifest parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid manifest format' },
        { status: 500 }
      );
    }
    
    // Version validation if specified
    if (version && manifest.version !== version) {
      return NextResponse.json(
        { 
          error: 'Version mismatch',
          requested: version,
          available: manifest.version
        },
        { status: 409 }
      );
    }
    
    // Apply environment-specific configurations
    if (manifest.environments[environment]) {
      const envConfig = manifest.environments[environment];
      
      // Merge environment-specific modules
      if (envConfig.additionalModules) {
        manifest.modules = {
          ...manifest.modules,
          ...envConfig.additionalModules.reduce((acc: any, moduleId: string) => {
            acc[moduleId] = {
              priority: 10,
              loadStrategy: 'conditional',
              cacheDuration: 300000,
              files: [moduleId],
              dependencies: ['core'],
              size: 'small'
            };
            return acc;
          }, {})
        };
      }
      
      // Remove excluded modules
      if (envConfig.excludeModules) {
        envConfig.excludeModules.forEach((pattern: string) => {
          if (pattern.includes('*')) {
            const prefix = pattern.replace('*', '');
            Object.keys(manifest.modules).forEach(moduleId => {
              if (moduleId.startsWith(prefix)) {
                delete manifest.modules[moduleId];
              }
            });
          } else {
            delete manifest.modules[pattern];
          }
        });
      }
      
      // Override performance settings for environment
      if (environment === 'prod') {
        manifest.performance = {
          ...manifest.performance,
          enableCompression: true,
          enableCDN: true,
          preloadModules: ['core/global'],
          criticalModules: ['core/ui', 'core/accessibility'],
          maxConcurrentLoads: 5,
        };
      } else if (environment === 'dev') {
        manifest.performance = {
          ...manifest.performance,
          enableCompression: false,
          enableCDN: false,
          maxConcurrentLoads: 10,
        };
      }
    }
    
    // Add environment info and security metadata
    manifest.environment = environment;
    manifest.timestamp = new Date().toISOString();
    manifest.buildId = process.env.BUILD_ID || 'unknown';
    manifest.nodeEnv = process.env.NODE_ENV;
    
    // Create response with appropriate headers
    const response = NextResponse.json(manifest);
    
    // Set cache headers based on environment
    const maxAge = environment === 'prod' ? 3600 : environment === 'staging' ? 1800 : 0;
    const sMaxAge = environment === 'prod' ? 7200 : environment === 'staging' ? 3600 : 0;
    
    if (environment === 'prod' && !bust) {
      response.headers.set('Cache-Control', `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=86400`);
      response.headers.set('CDN-Cache-Control', `public, max-age=${sMaxAge}`);
    } else {
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    
    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Performance and debugging headers
    response.headers.set('X-Content-Version', manifest.version);
    response.headers.set('X-Environment', environment);
    response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
    response.headers.set('X-Node-Env', process.env.NODE_ENV || 'unknown');
    
    // CORS headers for production
    if (environment === 'prod') {
      response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Environment');
      response.headers.set('Access-Control-Max-Age', '86400');
    }
    
    return response;
    
  } catch (error) {
    const errorId = `manifest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.error(`[${errorId}] Error serving content manifest:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      requestUrl: request.url,
      userAgent: request.headers.get('user-agent'),
    });
    
    // Different error responses based on environment
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const response = NextResponse.json(
      { 
        error: 'Failed to load content manifest',
        errorId,
        message: isDevelopment && error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
        ...(isDevelopment && error instanceof Error && { stack: error.stack }),
      },
      { status: 500 }
    );
    
    // Add error tracking headers
    response.headers.set('X-Error-ID', errorId);
    response.headers.set('X-Error-Type', 'manifest-load-failed');
    
    return response;
  }
}

// Rate limiting helper function
function checkRateLimit(clientIP: string): { allowed: boolean; count: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Clean up expired entries
  rateLimitCache.forEach((data, ip) => {
    if (data.resetTime <= now) {
      rateLimitCache.delete(ip);
    }
  });
  
  const existing = rateLimitCache.get(clientIP);
  
  if (!existing || existing.resetTime <= now) {
    // New window or first request
    rateLimitCache.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, count: 1, resetTime: now + RATE_LIMIT_WINDOW };
  }
  
  existing.count += 1;
  
  return {
    allowed: existing.count <= RATE_LIMIT_MAX_REQUESTS,
    count: existing.count,
    resetTime: existing.resetTime,
  };
}

// OPTIONS handler for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  
  response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Environment');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}