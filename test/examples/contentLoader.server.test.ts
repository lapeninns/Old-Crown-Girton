/**
 * Example Server-Side Loader Test
 * 
 * This test demonstrates how to test server-side data loaders
 * in a proper Node.js environment with mocked dependencies.
 */

import { ContentSmartLoader } from '@/src/lib/data/loaders/ContentSmartLoader';
import { server, http } from '@/test/setupServerTests';
import { HttpResponse } from 'msw';

// Mock file system operations for testing
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  access: jest.fn(),
  stat: jest.fn(),
}));

describe('Server Loader: ContentSmartLoader', () => {
  beforeEach(() => {
    // Clear any cached data
    ContentSmartLoader.clearCache?.();
  });

  it('should load content from API successfully', async () => {
    // Mock external API response
    server.use(
      http.get('https://api.example.com/content.json', () => {
        return HttpResponse.json({
          nav: {
            brand: "Test Restaurant",
            links: [
              { text: "Menu", href: "/menu" },
              { text: "About", href: "/about" }
            ]
          },
          footer: {
            copyright: "© 2024 Test Restaurant"
          }
        });
      })
    );

    const result = await ContentSmartLoader.loadSmart('prod');
    
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('nav');
    expect(result.data.nav).toHaveProperty('brand', 'Test Restaurant');
    expect(result.source).toBe('api');
  });

  it('should fallback to filesystem when API fails', async () => {
    // Mock API failure
    server.use(
      http.get('*', () => {
        return new Response(null, { status: 500 });
      })
    );

    // Mock filesystem success
    const fs = require('fs/promises');
    fs.readFile.mockResolvedValue(JSON.stringify({
      nav: {
        brand: "Filesystem Restaurant",
        links: []
      }
    }));
    fs.access.mockResolvedValue(undefined);

    const result = await ContentSmartLoader.loadSmart('dev');
    
    expect(result.success).toBe(true);
    expect(result.data.nav.brand).toBe('Filesystem Restaurant');
    expect(result.source).toBe('filesystem');
  });

  it('should handle validation errors properly', async () => {
    // Mock invalid API response
    server.use(
      http.get('*', () => {
        return HttpResponse.json({
          invalid: 'data structure'
        });
      })
    );

    const result = await ContentSmartLoader.loadSmart('test');
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.type).toBe('VALIDATION_ERROR');
  });

  it('should cache results properly', async () => {
    let callCount = 0;
    
    server.use(
      http.get('*', () => {
        callCount++;
        return HttpResponse.json({
          nav: { brand: `Call ${callCount}` },
          footer: { copyright: "Test" }
        });
      })
    );

    // First call
    const result1 = await ContentSmartLoader.loadSmart('prod');
    expect(result1.data.nav.brand).toBe('Call 1');

    // Second call should use cache
    const result2 = await ContentSmartLoader.loadSmart('prod');
    expect(result2.data.nav.brand).toBe('Call 1'); // Same as first call
    expect(callCount).toBe(1); // API was only called once
  });

  it('should handle different environments', async () => {
    const envs = ['dev', 'staging', 'prod'] as const;
    
    for (const env of envs) {
      server.use(
        http.get('*', () => {
          return HttpResponse.json({
            nav: { brand: `${env} Environment` },
            footer: { copyright: "Test" }
          });
        })
      );

      const result = await ContentSmartLoader.loadSmart(env);
      expect(result.success).toBe(true);
      expect(result.data.nav.brand).toBe(`${env} Environment`);
      
      // Clear cache between tests
      ContentSmartLoader.clearCache?.();
    }
  });

  it('should include proper metadata in results', async () => {
    const result = await ContentSmartLoader.loadSmart('test');
    
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('source');
    expect(result).toHaveProperty('loadTime');
    expect(typeof result.timestamp).toBe('number');
    expect(typeof result.loadTime).toBe('number');
  });
});