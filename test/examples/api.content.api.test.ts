/**
 * Example API Route Test - Content API
 * 
 * This test demonstrates how to test Next.js App Router API routes
 * in a proper Node.js environment with MSW for mocking external dependencies.
 */

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/content/route';
import { server, http } from '@/test/setupServerTests';
import { HttpResponse } from 'msw';

describe('API Route: /api/content', () => {
  beforeEach(() => {
    // Reset any environment variables
    delete process.env.NEXT_PUBLIC_DATA_BASE_URL;
  });

  it('should return content data with proper headers', async () => {
    const req = new NextRequest('http://localhost:3000/api/content', {
      method: 'GET',
    });

    const response = await GET(req);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('meta');
    expect(data.meta).toHaveProperty('version');
    expect(data.meta).toHaveProperty('timestamp');
  });

  it('should handle conditional requests with ETag', async () => {
    // First request to get ETag
    const req1 = new NextRequest('http://localhost:3000/api/content', {
      method: 'GET',
    });

    const response1 = await GET(req1);
    const etag = response1.headers.get('etag');
    
    expect(etag).toBeTruthy();

    // Second request with If-None-Match header
    const req2 = new NextRequest('http://localhost:3000/api/content', {
      method: 'GET',
      headers: {
        'if-none-match': etag!,
      },
    });

    const response2 = await GET(req2);
    expect(response2.status).toBe(304); // Not Modified
  });

  it('should set proper cache headers', async () => {
    const req = new NextRequest('http://localhost:3000/api/content', {
      method: 'GET',
    });

    const response = await GET(req);
    
    expect(response.headers.get('cache-control')).toContain('public');
    expect(response.headers.get('cache-control')).toContain('s-maxage');
    expect(response.headers.get('cache-control')).toContain('stale-while-revalidate');
  });

  it('should handle errors gracefully', async () => {
    // Mock a failing loader
    server.use(
      http.get('*/content.json', () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      })
    );

    const req = new NextRequest('http://localhost:3000/api/content', {
      method: 'GET',
    });

    const response = await GET(req);
    
    // Should still return a response, but with error status
    expect(response.status).toBeGreaterThanOrEqual(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error');
  });

  it('should include timing information in response', async () => {
    const req = new NextRequest('http://localhost:3000/api/content', {
      method: 'GET',
    });

    const response = await GET(req);
    const data = await response.json();
    
    expect(data.meta).toHaveProperty('loadTime');
    expect(typeof data.meta.loadTime).toBe('object');
    expect(data.meta.loadTime).toHaveProperty('duration');
  });

  it('should handle different environments correctly', async () => {
    // Test with production environment
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const req = new NextRequest('http://localhost:3000/api/content', {
      method: 'GET',
    });

    const response = await GET(req);
    
    expect(response.status).toBe(200);
    
    // Restore environment
    process.env.NODE_ENV = originalEnv;
  });
});