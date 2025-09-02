/**
 * API Test Helpers
 * Utilities for testing API endpoints
 */

import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';
import supertest from 'supertest';
import { TestDataFactory } from './testDataFactory';

export class ApiTestHelper {
  /**
   * Create mock request for Next.js API routes
   */
  static createMockRequest(method: string = 'GET', url: string = '/', options: any = {}) {
    const { req, res } = createMocks({
      method,
      url,
      ...options
    });

    // Add query parameters if provided
    if (options.query) {
      const urlObj = new URL(url, 'http://localhost');
      Object.entries(options.query).forEach(([key, value]) => {
        urlObj.searchParams.set(key, String(value));
      });
      req.url = urlObj.toString();
    }

    // Add headers if provided
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        req.headers[key.toLowerCase()] = value;
      });
    }

    // Add body if provided
    if (options.body) {
      req.body = options.body;
    }

    return { req, res };
  }

  /**
   * Create authenticated request with JWT token
   */
  static createAuthenticatedRequest(token: string, method: string = 'GET', url: string = '/') {
    return this.createMockRequest(method, url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Validate standardized API response format
   */
  static validateStandardizedResponse(response: any) {
    expect(response).toHaveProperty('status');
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('meta');
    // Version might be in meta instead of root level
    if (response.meta && response.meta.version) {
      expect(response.meta).toHaveProperty('version');
    }

    expect(['success', 'error']).toContain(response.status);

    if (response.status === 'success') {
      expect(response.data).toBeDefined();
    } else {
      expect(response.error).toBeDefined();
      expect(response.error).toHaveProperty('code');
      expect(response.error).toHaveProperty('message');
    }

    expect(response.meta).toHaveProperty('timestamp');
    expect(response.meta).toHaveProperty('requestId');
  }

  /**
   * Test HTTP status codes
   */
  static async testStatusCode(endpoint: Function, expectedStatus: number, options: any = {}) {
    const { req } = this.createMockRequest(options.method || 'GET', options.url || '/', options);
    const response = await endpoint(req);

    expect(response.status).toBe(expectedStatus);
    return response;
  }

  /**
   * Test response headers
   */
  static async testResponseHeaders(endpoint: Function, expectedHeaders: Record<string, any>, options: any = {}) {
    const { req } = this.createMockRequest(options.method || 'GET', options.url || '/', options);
    const response = await endpoint(req);

    Object.entries(expectedHeaders).forEach(([header, expectedValue]) => {
      if (typeof expectedValue === 'string') {
        expect(response.headers.get(header.toLowerCase())).toBe(expectedValue);
      } else if (expectedValue instanceof RegExp) {
        expect(response.headers.get(header.toLowerCase())).toMatch(expectedValue);
      } else if (typeof expectedValue === 'function') {
        expectedValue(response.headers.get(header.toLowerCase()));
      }
    });

    return response;
  }

  /**
   * Test caching headers
   */
  static async testCacheHeaders(endpoint: Function, options: any = {}) {
    const response = await this.testResponseHeaders(endpoint, {
      'cache-control': (value: string) => {
        expect(value).toContain('public');
        expect(value).toMatch(/s-maxage=\d+/);
        expect(value).toContain('stale-while-revalidate');
      }
    }, options);

    return response;
  }

  /**
   * Test CORS headers
   */
  static async testCorsHeaders(endpoint: Function, options: any = {}) {
    const corsHeaders = {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': (value: string) => {
        expect(value).toMatch(/GET|POST|PUT|DELETE/);
      },
      'access-control-allow-headers': (value: string) => {
        expect(value).toMatch(/content-type|authorization/i);
      }
    };

    return this.testResponseHeaders(endpoint, corsHeaders, {
      method: 'OPTIONS',
      ...options
    });
  }

  /**
   * Test error responses
   */
  static async testErrorResponse(endpoint: Function, errorCode: number, options: any = {}) {
    const response = await this.testStatusCode(endpoint, errorCode, options);

    if (errorCode >= 400) {
      const data = await response.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toHaveProperty('code');
      expect(data.error).toHaveProperty('message');
    }

    return response;
  }

  /**
   * Test rate limiting
   */
  static async testRateLimiting(endpoint: Function, maxRequests: number = 100, windowMs: number = 60000) {
    const requests = Array(maxRequests + 1).fill(null).map((_, i) =>
      this.testStatusCode(endpoint, 200, { headers: { 'X-Forwarded-For': `192.168.1.${i}` } })
    );

    const responses = await Promise.all(requests);

    // Last request should be rate limited
    const lastResponse = responses[responses.length - 1];
    expect([429, 200]).toContain(lastResponse.status); // 429 = Too Many Requests

    return responses;
  }

  /**
   * Test input validation
   */
  static async testInputValidation(endpoint: Function, invalidInputs: any[], options: any = {}) {
    const responses = await Promise.all(
      invalidInputs.map(input =>
        this.testStatusCode(endpoint, 400, {
          method: 'POST',
          body: input,
          ...options
        })
      )
    );

    responses.forEach(response => {
      expect([400, 422]).toContain(response.status);
    });

    return responses;
  }

  /**
   * Test SQL injection attempts
   */
  static async testSqlInjection(endpoint: Function, vulnerableParams: string[] = []) {
    const sqlInjectionPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --",
      "admin'--",
      "' OR 1=1 --",
      "') OR ('1'='1"
    ];

    const testPromises = vulnerableParams.flatMap(param =>
      sqlInjectionPayloads.map(payload =>
        this.testStatusCode(endpoint, 400, {
          method: 'GET',
          query: { [param]: payload }
        })
      )
    );

    const responses = await Promise.all(testPromises);
    responses.forEach(response => {
      expect([400, 422]).toContain(response.status);
    });

    return responses;
  }

  /**
   * Test XSS attempts
   */
  static async testXssAttempts(endpoint: Function, vulnerableParams: string[] = []) {
    const xssPayloads = [
      "<script>alert('xss')</script>",
      "<img src=x onerror=alert('xss')>",
      "javascript:alert('xss')",
      "<iframe src='javascript:alert(\"xss\")'>",
      "<svg onload=alert('xss')>",
      "'><script>alert('xss')</script>"
    ];

    const testPromises = vulnerableParams.flatMap(param =>
      xssPayloads.map(payload =>
        this.testStatusCode(endpoint, 400, {
          method: 'POST',
          body: { [param]: payload }
        })
      )
    );

    const responses = await Promise.all(testPromises);
    responses.forEach(response => {
      expect([400, 422]).toContain(response.status);
    });

    return responses;
  }
}

export class PerformanceTestHelper {
  /**
   * Measure response time
   */
  static async measureResponseTime(endpoint: Function, options: any = {}): Promise<number> {
    const startTime = Date.now();
    await endpoint(options);
    const endTime = Date.now();
    return endTime - startTime;
  }

  /**
   * Test response time under threshold
   */
  static async testResponseTimeThreshold(endpoint: Function, maxTimeMs: number = 200, options: any = {}) {
    const responseTime = await this.measureResponseTime(endpoint, options);
    expect(responseTime).toBeLessThan(maxTimeMs);
    return responseTime;
  }

  /**
   * Load test helper
   */
  static async loadTest(endpoint: Function, concurrentUsers: number = 10, requestsPerUser: number = 5) {
    const startTime = Date.now();

    const userPromises = Array(concurrentUsers).fill(null).map(async (_, userIndex) => {
      const userRequests = Array(requestsPerUser).fill(null).map(async (_, requestIndex) => {
        const responseTime = await this.measureResponseTime(endpoint, {
          headers: { 'X-User-Id': `user-${userIndex}`, 'X-Request-Id': `req-${requestIndex}` }
        });
        return responseTime;
      });

      return Promise.all(userRequests);
    });

    const results = await Promise.all(userPromises);
    const totalTime = Date.now() - startTime;

    const allResponseTimes = results.flat();
    const averageResponseTime = allResponseTimes.reduce((sum, time) => sum + time, 0) / allResponseTimes.length;
    const maxResponseTime = Math.max(...allResponseTimes);
    const minResponseTime = Math.min(...allResponseTimes);

    return {
      totalTime,
      averageResponseTime,
      maxResponseTime,
      minResponseTime,
      totalRequests: concurrentUsers * requestsPerUser,
      requestsPerSecond: (concurrentUsers * requestsPerUser) / (totalTime / 1000)
    };
  }
}
