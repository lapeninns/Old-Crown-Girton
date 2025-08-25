import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

// Security and validation
const ALLOWED_ENVIRONMENTS = ['dev', 'staging', 'prod'] as const;
const ALLOWED_MODULE_PATTERNS = /^[a-zA-Z0-9_\-\/]+$/;
const MAX_MODULE_SIZE = 1024 * 1024; // 1MB max module size
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 200;

// Cache for rate limiting
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();

// Validation schemas
const ModuleParamsSchema = z.object({
  moduleId: z.string().regex(ALLOWED_MODULE_PATTERNS, 'Invalid module ID format'),
});

const QuerySchema = z.object({
  env: z.enum(ALLOWED_ENVIRONMENTS).optional().default('prod'),
  version: z.string().optional(),
  compress: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
});

interface ModuleRequest {
  params: {
    moduleId: string;
  };
}

export async function GET(request: NextRequest, { params }: ModuleRequest) {
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
          }
        }
      );
    }
    
    // Validate parameters
    const paramsResult = ModuleParamsSchema.safeParse(params);
    if (!paramsResult.success) {
      return NextResponse.json(
        { error: 'Invalid module ID', details: paramsResult.error.errors },
        { status: 400 }
      );
    }
    
    // Validate query parameters
    const url = new URL(request.url);
    const queryResult = QuerySchema.safeParse({
      env: url.searchParams.get('env'),
      version: url.searchParams.get('version'),
      compress: url.searchParams.get('compress'),
    });
    
    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.errors },
        { status: 400 }
      );
    }
    
    const { moduleId } = paramsResult.data;
    const { env: environment, version, compress } = queryResult.data;
    const contentDir = path.join(process.cwd(), 'config', 'content');
    const manifestPath = path.join(contentDir, 'manifest.json');
    
    // Read manifest to get module configuration with error handling
    let manifest;
    try {
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      manifest = JSON.parse(manifestContent);
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to load content manifest' },
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
    
    // Find module configuration
    const moduleConfig = manifest.modules[moduleId];
    if (!moduleConfig) {
      return NextResponse.json(
        { error: `Module ${moduleId} not found in manifest` },
        { status: 404 }
      );
    }
    
    // Load base module files
    let composedData = {};
    
    for (const fileName of moduleConfig.files) {
      const filePath = path.join(contentDir, fileName);
      
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const fileData = JSON.parse(fileContent);
        
        // Deep merge the file data
        composedData = deepMerge(composedData, fileData);
      } catch (fileError) {
        console.warn(`Warning: Could not load file ${fileName} for module ${moduleId}:`, fileError);
      }
    }
    
    // Apply environment-specific overrides
    const envConfig = manifest.environments[environment];
    if (envConfig?.overrides) {
      for (const overridePath of envConfig.overrides) {
        const moduleOverridePath = path.join(contentDir, overridePath, `${moduleId}.json`);
        
        try {
          await fs.access(moduleOverridePath);
          const overrideContent = await fs.readFile(moduleOverridePath, 'utf-8');
          const overrideData = JSON.parse(overrideContent);
          
          // Apply overrides based on composition strategy
          composedData = deepMerge(composedData, overrideData);
        } catch {
          // Override file doesn't exist, which is fine
        }
      }
    }
    
    // Load dependencies if needed
    if (moduleConfig.dependencies?.length > 0) {
      const dependencyData = {};
      
      for (const depId of moduleConfig.dependencies) {
        const depConfig = manifest.modules[depId];
        if (depConfig) {
          for (const fileName of depConfig.files) {
            const filePath = path.join(contentDir, fileName);
            
            try {
              const fileContent = await fs.readFile(filePath, 'utf-8');
              const fileData = JSON.parse(fileContent);
              
              // Merge dependency data
              Object.assign(dependencyData, fileData);
            } catch {
              // Dependency file not found, continue
            }
          }
        }
      }
      
      // Merge dependencies first, then module data
      composedData = deepMerge(dependencyData, composedData);
    }
    
    // Create response with enhanced metadata
    const responseData = {
      id: moduleId,
      data: composedData,
      metadata: {
        loadedAt: new Date().toISOString(),
        environment,
        version: manifest.version,
        dependencies: moduleConfig.dependencies || [],
        cacheDuration: moduleConfig.cacheDuration,
        size: JSON.stringify(composedData).length,
        loadTime: Date.now() - startTime,
        compression: compress ? 'enabled' : 'disabled',
      }
    };
    
    // Check size limits
    const responseSize = JSON.stringify(responseData).length;
    if (responseSize > MAX_MODULE_SIZE) {
      return NextResponse.json(
        { 
          error: 'Module too large',
          maxSize: MAX_MODULE_SIZE,
          actualSize: responseSize
        },
        { status: 413 }
      );
    }
    
    const response = NextResponse.json(responseData);
    
    // Enhanced cache headers based on module configuration and environment
    const cacheMaxAge = Math.floor(moduleConfig.cacheDuration / 1000);
    const sMaxAge = Math.floor(cacheMaxAge * 1.5);
    
    if (environment === 'prod') {
      response.headers.set('Cache-Control', 
        `public, max-age=${cacheMaxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=86400`
      );
      response.headers.set('CDN-Cache-Control', `public, max-age=${sMaxAge}`);
      response.headers.set('Vary', 'Accept-Encoding, X-Environment');
    } else if (environment === 'staging') {
      response.headers.set('Cache-Control', `public, max-age=${Math.floor(cacheMaxAge / 2)}`);
    } else {
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    
    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Performance and debugging headers
    response.headers.set('X-Module-ID', moduleId);
    response.headers.set('X-Module-Size', moduleConfig.size);
    response.headers.set('X-Environment', environment);
    response.headers.set('X-Content-Version', manifest.version);
    response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
    response.headers.set('X-Content-Length', responseSize.toString());
    
    // Cache status header
    response.headers.set('X-Cache-Status', 'miss');
    
    // CORS headers for production
    if (environment === 'prod') {
      response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Environment');
    }
    
    return response;
    
  } catch (error) {
    const errorId = `module-${params.moduleId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.error(`[${errorId}] Error serving module ${params.moduleId}:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      moduleId: params.moduleId,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      requestUrl: request.url,
      userAgent: request.headers.get('user-agent'),
    });
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const response = NextResponse.json(
      { 
        error: `Failed to load module ${params.moduleId}`,
        errorId,
        message: isDevelopment && error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
        ...(isDevelopment && error instanceof Error && { stack: error.stack }),
      },
      { status: 500 }
    );
    
    response.headers.set('X-Error-ID', errorId);
    response.headers.set('X-Error-Type', 'module-load-failed');
    
    return response;
  }
}

// Rate limiting helper function
function checkRateLimit(clientIP: string): { allowed: boolean; count: number; resetTime: number } {
  const now = Date.now();
  
  // Clean up expired entries
  for (const [ip, data] of rateLimitCache.entries()) {
    if (data.resetTime <= now) {
      rateLimitCache.delete(ip);
    }
  }
  
  const existing = rateLimitCache.get(clientIP);
  
  if (!existing || existing.resetTime <= now) {
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

// Deep merge utility function
function deepMerge(target: any, source: any): any {
  if (source === null || source === undefined) return target;
  if (target === null || target === undefined) return source;
  
  if (Array.isArray(source)) {
    if (Array.isArray(target)) {
      return [...target, ...source];
    }
    return source;
  }
  
  if (typeof source === 'object' && typeof target === 'object') {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (result.hasOwnProperty(key)) {
          result[key] = deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }
  
  return source;
}