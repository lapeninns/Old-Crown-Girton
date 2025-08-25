import { NextRequest, NextResponse } from 'next/server';
import { getProductionConfig, createProductionHeaders } from './src/lib/config/production';

export function middleware(request: NextRequest) {
  const config = getProductionConfig();
  const { pathname } = request.nextUrl;
  
  // Only apply to content API routes
  if (!pathname.startsWith('/api/content/')) {
    return NextResponse.next();
  }
  
  // Rate limiting check
  if (config.rateLimiting.enabled) {
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `rate_limit:${clientIP}`;
    
    // In production, you'd use Redis or similar for distributed rate limiting
    // For now, we'll let the API endpoints handle rate limiting
  }
  
  // Security headers for content API
  const response = NextResponse.next();
  
  // Add security headers
  if (config.environment === 'prod') {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  
  // CORS configuration
  if (config.allowedOrigins.length > 0) {
    const origin = request.headers.get('origin');
    if (origin && (config.allowedOrigins.includes('*') || config.allowedOrigins.includes(origin))) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Environment, X-Content-Version');
      response.headers.set('Access-Control-Max-Age', '86400');
    }
  }
  
  // Performance headers
  response.headers.set('X-Environment', config.environment);
  response.headers.set('X-Content-System', 'modular');
  response.headers.set('X-Content-Version', config.contentVersion);
  
  // Compression hint
  if (config.caching.compression && request.headers.get('accept-encoding')?.includes('gzip')) {
    response.headers.set('Vary', 'Accept-Encoding');
  }
  
  return response;
}

export const config = {
  matcher: [
    '/api/content/:path*',
  ],
};