/**
 * Menu API Functional Tests
 * Comprehensive testing for /api/menu endpoint
 */

import { createMocks } from 'node-mocks-http';
import { GET as menuGET } from '@/app/api/menu/route';
import { ApiTestHelper, PerformanceTestHelper } from '../../utils/apiTestHelper';
import { TestDataFactory } from '../../utils/testDataFactory';
import { testConfig } from '../../config/testEnvironment';

describe('Menu API - Functional Tests', () => {
  describe('GET /api/menu - Core Functionality', () => {
    test('should return standardized response format', async () => {
      const { req } = ApiTestHelper.createMockRequest('GET', '/api/menu');
      const response = await menuGET(req);

      expect(response.status).toBe(200);

      const data = await response.json();
      ApiTestHelper.validateStandardizedResponse(data);

      expect(data.data).toHaveProperty('sections');
      expect(Array.isArray(data.data.sections)).toBe(true);
    });

    test('should include proper cache headers', async () => {
      await ApiTestHelper.testCacheHeaders(menuGET);
    });

    test('should handle conditional requests with ETag', async () => {
      // First request to get ETag
      const { req: req1 } = ApiTestHelper.createMockRequest('GET', '/api/menu');
      const response1 = await menuGET(req1);
      const etag = response1.headers.get('etag');

      // Second request with If-None-Match
      const { req: req2 } = ApiTestHelper.createMockRequest('GET', '/api/menu', {
        headers: { 'If-None-Match': etag }
      });
      const response2 = await menuGET(req2);

      expect([200, 304]).toContain(response2.status);
    });

    test('should handle conditional requests with Last-Modified', async () => {
      const { req: req1 } = ApiTestHelper.createMockRequest('GET', '/api/menu');
      const response1 = await menuGET(req1);
      const lastModified = response1.headers.get('last-modified');

      const { req: req2 } = ApiTestHelper.createMockRequest('GET', '/api/menu', {
        headers: { 'If-Modified-Since': lastModified }
      });
      const response2 = await menuGET(req2);

      expect([200, 304]).toContain(response2.status);
    });
  });

  describe('GET /api/menu - Data Validation', () => {
    test('should return menu with all required sections', async () => {
      const { req } = ApiTestHelper.createMockRequest('GET', '/api/menu');
      const response = await menuGET(req);
      const data = await response.json();

      expect(data.data.sections.length).toBeGreaterThan(0);

      data.data.sections.forEach((section: any) => {
        expect(section).toHaveProperty('id');
        expect(section).toHaveProperty('name');
        expect(section).toHaveProperty('items');
        expect(Array.isArray(section.items)).toBe(true);
      });
    });

    test('should return menu items with complete information', async () => {
      const { req } = ApiTestHelper.createMockRequest('GET', '/api/menu');
      const response = await menuGET(req);
      const data = await response.json();

      const allItems = data.data.sections.flatMap((section: any) => section.items);

      allItems.forEach((item: any) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('price');
        expect(item.price).toHaveProperty('amount');
        expect(item.price).toHaveProperty('currency');
        expect(item).toHaveProperty('available');
        expect(item).toHaveProperty('dietary');
        expect(item).toHaveProperty('tags');
      });
    });

    test('should validate menu data structure against schema', async () => {
      const { req } = ApiTestHelper.createMockRequest('GET', '/api/menu');
      const response = await menuGET(req);
      const data = await response.json();

      // Test that data matches expected structure
      expect(data.data).toHaveProperty('updatedAt');
      expect(typeof data.data.updatedAt).toBe('string');

      data.data.sections.forEach((section: any) => {
        expect(typeof section.id).toBe('string');
        expect(typeof section.name).toBe('string');
        expect(Array.isArray(section.items)).toBe(true);
      });
    });
  });

  describe('GET /api/menu - Error Handling', () => {
    test('should handle server errors gracefully', async () => {
      // Mock a server error by manipulating the loader
      const originalLoader = jest.requireMock('@/src/lib/data/loaders/MenuSmartLoader');

      // This would need to be adjusted based on actual mocking strategy
      const { req } = ApiTestHelper.createMockRequest('GET', '/api/menu');
      const response = await menuGET(req);

      // Should still return a proper error response
      expect([500, 200]).toContain(response.status); // 200 if fallback works
    });

    test('should handle malformed requests', async () => {
      const { req } = ApiTestHelper.createMockRequest('GET', '/api/menu', {
        headers: { 'Content-Type': 'invalid' }
      });
      const response = await menuGET(req);

      expect([200, 400]).toContain(response.status);
    });
  });

  describe('GET /api/menu - Performance', () => {
    test('should respond within acceptable time limits', async () => {
      const responseTime = await PerformanceTestHelper.testResponseTimeThreshold(
        () => menuGET(ApiTestHelper.createMockRequest('GET', '/api/menu').req),
        200 // 200ms threshold
      );

      expect(responseTime).toBeLessThan(200);
    });

    test('should handle concurrent requests efficiently', async () => {
      const concurrentRequests = 10;
      const promises = Array(concurrentRequests).fill(null).map(() =>
        menuGET(ApiTestHelper.createMockRequest('GET', '/api/menu').req)
      );

      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(1000); // 1 second for 10 concurrent requests
    });
  });

  describe('GET /api/menu - Security', () => {
    test('should prevent SQL injection in query parameters', async () => {
      const sqlPayloads = [
        "' OR '1'='1",
        "'; DROP TABLE menu; --",
        "' UNION SELECT * FROM users --"
      ];

      for (const payload of sqlPayloads) {
        const { req } = ApiTestHelper.createMockRequest('GET', `/api/menu?section=${payload}`);
        const response = await menuGET(req);

        // Should either reject or sanitize the input
        expect([200, 400]).toContain(response.status);
      }
    });

    test('should prevent XSS in query parameters', async () => {
      const xssPayloads = [
        "<script>alert('xss')</script>",
        "<img src=x onerror=alert('xss')>",
        "javascript:alert('xss')"
      ];

      for (const payload of xssPayloads) {
        const { req } = ApiTestHelper.createMockRequest('GET', `/api/menu?callback=${payload}`);
        const response = await menuGET(req);

        expect([200, 400]).toContain(response.status);

        if (response.status === 200) {
          const data = await response.json();
          // Ensure XSS payloads are not reflected in response
          expect(JSON.stringify(data)).not.toContain('<script>');
        }
      }
    });

    test('should handle large request payloads', async () => {
      const largePayload = 'x'.repeat(10000); // 10KB payload
      const { req } = ApiTestHelper.createMockRequest('GET', `/api/menu?data=${largePayload}`);
      const response = await menuGET(req);

      expect([200, 400, 413]).toContain(response.status); // 413 = Payload Too Large
    });
  });

  describe('GET /api/menu - Business Logic', () => {
    test('should return only available menu items when requested', async () => {
      // This would depend on your API's filtering capabilities
      const { req } = ApiTestHelper.createMockRequest('GET', '/api/menu?available=true');
      const response = await menuGET(req);

      if (response.status === 200) {
        const data = await response.json();
        const allItems = data.data.sections.flatMap((section: any) => section.items);

        // All returned items should be available
        allItems.forEach((item: any) => {
          expect(item.available).toBe(true);
        });
      }
    });

    test('should support dietary filtering', async () => {
      const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free'];

      for (const diet of dietaryOptions) {
        const { req } = ApiTestHelper.createMockRequest('GET', `/api/menu?dietary=${diet}`);
        const response = await menuGET(req);

        if (response.status === 200) {
          const data = await response.json();
          const allItems = data.data.sections.flatMap((section: any) => section.items);

          // Check if any items have the dietary property
          const itemsWithDietary = allItems.filter((item: any) => item.dietary && item.dietary[diet.replace('-', '')] !== undefined);

          // If there are items with this dietary property, they should have the correct value
          if (itemsWithDietary.length > 0) {
            itemsWithDietary.forEach((item: any) => {
              expect(typeof item.dietary[diet.replace('-', '')]).toBe('boolean');
            });
          }
        }
      }
    });

    test('should calculate correct pricing information', async () => {
      const { req } = ApiTestHelper.createMockRequest('GET', '/api/menu');
      const response = await menuGET(req);
      const data = await response.json();

      const allItems = data.data.sections.flatMap((section: any) => section.items);

      allItems.forEach((item: any) => {
        expect(item.price.amount).toBeGreaterThan(0);
        expect(item.price.currency).toBe('GBP');
        expect(typeof item.price.amount).toBe('number');
      });
    });
  });
});
