import { NextRequest, NextResponse } from 'next/server';
import { getProductionConfig } from './src/lib/config/production';
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { cdnOptimizationMiddleware } from './src/lib/cdnStrategy';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();

  // Supabase auth middleware - only use in Node.js runtime
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
  );

  if (hasSupabaseEnv) {
    try {
      const supabase = createMiddlewareClient({ req: request, res });
      await supabase.auth.getSession();
    } catch (err: any) {
      console.warn('Supabase middleware skipped:', err?.message || err);
    }
  }

  // Apply CDN optimization middleware first
  const cdnResponse = cdnOptimizationMiddleware(request);
  if (cdnResponse !== NextResponse.next()) {
    return cdnResponse;
  }

  const config = getProductionConfig();
  const { pathname } = request.nextUrl;
  
  // Apply to all API routes under /api/*
  if (!pathname.startsWith('/api/')) {
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
  
  // CORS configuration for API routes (centralized)
  const origin = request.headers.get('origin');
  if (config.allowedOrigins.length > 0 && origin && (config.allowedOrigins.includes('*') || config.allowedOrigins.includes(origin))) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Environment, X-Content-Version, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    // Expose useful headers to the browser
    response.headers.set('Access-Control-Expose-Headers', 'etag,last-modified,x-request-id,x-load-time,x-cached,x-source');
  }
  
  // Performance headers
  response.headers.set('X-Environment', config.environment);
  response.headers.set('X-Content-System', 'modular');
  response.headers.set('X-Content-Version', config.contentVersion);
  
  // Compression hint
  if (config.caching.compression && request.headers.get('accept-encoding')?.includes('gzip')) {
    response.headers.set('Vary', 'Accept-Encoding');
  }
  
  // If this is a preflight request, respond here centrally to avoid having to add
  // OPTIONS handlers to every API route. Return 204 No Content.
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

// Configure middleware to run only on API routes to avoid Edge Runtime issues
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}