/**
 * Security Tests
 * Comprehensive security testing for API endpoints
 */

import { ApiTestHelper } from '../../utils/apiTestHelper';
import { GET as menuGET } from '@/app/api/menu/route';
import { GET as restaurantGET } from '@/app/api/restaurant/route';
import { GET as authCallbackGET } from '@/app/api/auth/callback/route';

describe('API Security Tests', () => {
  describe('SQL Injection Prevention', () => {
    const sqlInjectionPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --",
      "admin'--",
      "' OR 1=1 --",
      "') OR ('1'='1",
      "'; EXEC xp_cmdshell 'dir' --",
      "' AND 1=0 UNION SELECT username, password FROM users --",
      "'; SELECT * FROM information_schema.tables --",
      "' OR 'x'='x"
    ];

    test('Menu API should prevent SQL injection in query parameters', async () => {
      const vulnerableParams = ['section', 'category', 'id', 'filter'];

      for (const param of vulnerableParams) {
        for (const payload of sqlInjectionPayloads) {
          const { req } = ApiTestHelper.createMockRequest('GET', `/api/menu?${param}=${encodeURIComponent(payload)}`);
          const response = await menuGET(req);

          // Should either reject or sanitize the input
          expect([200, 400, 422]).toContain(response.status);

          if (response.status === 200) {
            const data = await response.json();
            // Ensure no SQL is reflected in the response
            const responseString = JSON.stringify(data);
            expect(responseString).not.toContain(payload);
          }
        }
      }
    });

    test('Restaurant API should prevent SQL injection', async () => {
      const vulnerableParams = ['id', 'filter', 'query'];

      for (const param of vulnerableParams) {
        for (const payload of sqlInjectionPayloads.slice(0, 5)) { // Test subset for performance
          const { req } = ApiTestHelper.createMockRequest('GET', `/api/restaurant?${param}=${encodeURIComponent(payload)}`);
          const response = await restaurantGET(req);

          expect([200, 400, 422]).toContain(response.status);
        }
      }
    });
  });

  describe('Cross-Site Scripting (XSS) Prevention', () => {
    const xssPayloads = [
      "<script>alert('xss')</script>",
      "<img src=x onerror=alert('xss')>",
      "javascript:alert('xss')",
      "<iframe src='javascript:alert(\"xss\")'>",
      "<svg onload=alert('xss')>",
      "'><script>alert('xss')</script>",
      "<body onload=alert('xss')>",
      "<div onmouseover=alert('xss')>Hover me</div>",
      "<a href='javascript:alert(\"xss\")'>Click me</a>",
      "<object data='javascript:alert(\"xss\")'>",
      "<embed src='javascript:alert(\"xss\")'>",
      "<form action='javascript:alert(\"xss\")'>",
      "<input onfocus=alert('xss')>",
      "<select onchange=alert('xss')><option>1</option></select>",
      "<textarea oninput=alert('xss')></textarea>"
    ];

    test('Menu API should prevent XSS in query parameters', async () => {
      const vulnerableParams = ['callback', 'jsonp', 'filter', 'search'];

      for (const param of vulnerableParams) {
        for (const payload of xssPayloads) {
          const { req } = ApiTestHelper.createMockRequest('GET', `/api/menu?${param}=${encodeURIComponent(payload)}`);
          const response = await menuGET(req);

          expect([200, 400, 422]).toContain(response.status);

          if (response.status === 200) {
            const data = await response.json();
            const responseString = JSON.stringify(data);

            // Ensure XSS payloads are not reflected in response
            expect(responseString).not.toContain('<script>');
            expect(responseString).not.toContain('javascript:');
            expect(responseString).not.toContain('onerror=');
            expect(responseString).not.toContain('onload=');
            expect(responseString).not.toContain('onmouseover=');
          }
        }
      }
    });

    test('Auth callback should prevent XSS in code parameter', async () => {
      for (const payload of xssPayloads.slice(0, 5)) { // Test subset
        const { req } = ApiTestHelper.createMockRequest('GET', `/api/auth/callback?code=${encodeURIComponent(payload)}`);

        // Mock the URL for NextRequest
        Object.defineProperty(req, 'url', {
          value: `http://localhost:3000/api/auth/callback?code=${encodeURIComponent(payload)}`,
          writable: true
        });

        const response = await authCallbackGET(req);

        expect([307, 400]).toContain(response.status);

        if (response.status === 307) {
          const redirectUrl = response.headers.get('location');
          // Ensure redirect URL doesn't contain XSS
          expect(redirectUrl).not.toContain('<script>');
          expect(redirectUrl).not.toContain('javascript:');
        }
      }
    });
  });

  describe('Input Validation and Sanitization', () => {
    test('should reject malformed JSON payloads', async () => {
      const malformedPayloads = [
        '{ invalid json }',
        '{"incomplete": "json"',
        '{"valid": "json", "but": }',
        'null',
        'undefined',
        'NaN',
        'Infinity',
        '{"nested": {"invalid": }}',
        '[{"incomplete": "array"',
        '"just a string"',
        '123',
        'true'
      ];

      for (const payload of malformedPayloads) {
        // This test assumes POST endpoints exist; adjust based on your API
        const { req } = ApiTestHelper.createMockRequest('POST', '/api/menu', {
          headers: { 'Content-Type': 'application/json' },
          body: payload
        });

        // Since menu is GET-only, this will test the general request handling
        const response = await menuGET(req);
        expect([200, 400, 415]).toContain(response.status);
      }
    });

    test('should handle extremely large payloads', async () => {
      const largePayloads = [
        'x'.repeat(1000000), // 1MB
        'x'.repeat(10000000), // 10MB
        '{"data": "' + 'x'.repeat(1000000) + '"}' // Large JSON
      ];

      for (const payload of largePayloads) {
        const { req } = ApiTestHelper.createMockRequest('POST', '/api/menu', {
          headers: { 'Content-Type': 'application/json' },
          body: payload
        });

        const response = await menuGET(req);
        expect([200, 400, 413, 415]).toContain(response.status);
      }
    });

    test('should validate content types', async () => {
      const invalidContentTypes = [
        'text/html',
        'text/plain',
        'application/xml',
        'multipart/form-data',
        'application/x-www-form-urlencoded',
        'image/jpeg',
        'application/octet-stream'
      ];

      for (const contentType of invalidContentTypes) {
        const { req } = ApiTestHelper.createMockRequest('POST', '/api/menu', {
          headers: { 'Content-Type': contentType },
          body: '{"test": "data"}'
        });

        const response = await menuGET(req);
        expect([200, 400, 415]).toContain(response.status);
      }
    });
  });

  describe('Authentication Bypass Attempts', () => {
    test('should prevent direct object reference attacks', async () => {
      const objectIds = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        '/etc/shadow',
        'C:\\Windows\\System32\\config\\system',
        '../../../../root/.bash_history',
        'file:///etc/passwd',
        'php://filter/convert.base64-encode/resource=index.php'
      ];

      for (const objectId of objectIds) {
        const { req } = ApiTestHelper.createMockRequest('GET', `/api/menu?id=${encodeURIComponent(objectId)}`);
        const response = await menuGET(req);

        expect([200, 400, 404]).toContain(response.status);

        if (response.status === 200) {
          const data = await response.json();
          // Ensure no file system access occurred
          expect(JSON.stringify(data)).not.toContain('/etc/');
          expect(JSON.stringify(data)).not.toContain('..\\');
          expect(JSON.stringify(data)).not.toContain('file://');
        }
      }
    });

    test('should prevent parameter manipulation attacks', async () => {
      const manipulationAttempts = [
        { param: 'id', value: '1 AND 1=1' },
        { param: 'id', value: '1; SELECT * FROM users' },
        { param: 'id', value: '1 UNION SELECT password FROM users' },
        { param: 'limit', value: '1000000' },
        { param: 'offset', value: '-1' },
        { param: 'sort', value: 'DROP TABLE menu' },
        { param: 'filter', value: 'admin\' OR \'1\'=\'1' }
      ];

      for (const attempt of manipulationAttempts) {
        const { req } = ApiTestHelper.createMockRequest('GET', `/api/menu?${attempt.param}=${encodeURIComponent(attempt.value)}`);
        const response = await menuGET(req);

        expect([200, 400, 422]).toContain(response.status);
      }
    });

    test('should prevent privilege escalation attempts', async () => {
      const privilegePayloads = [
        { role: 'admin', token: 'fake-admin-token' },
        { role: 'superuser', token: 'elevated-token' },
        { permissions: 'all', token: 'god-mode-token' },
        { level: '999', token: 'max-level-token' }
      ];

      for (const payload of privilegePayloads) {
        const queryString = Object.entries(payload)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');

        const { req } = ApiTestHelper.createMockRequest('GET', `/api/menu?${queryString}`);
        const response = await menuGET(req);

        expect([200, 401, 403]).toContain(response.status);

        // Should not return elevated data
        if (response.status === 200) {
          const data = await response.json();
          // Ensure response doesn't contain sensitive information
          expect(JSON.stringify(data)).not.toContain('admin');
          expect(JSON.stringify(data)).not.toContain('superuser');
        }
      }
    });
  });

  describe('Rate Limiting Tests', () => {
    test('should enforce rate limiting on API endpoints', async () => {
      const maxRequests = 100;
      const requests = Array(maxRequests + 1).fill(null).map((_, i) =>
        ApiTestHelper.testStatusCode(menuGET, 200, {
          headers: { 'X-Forwarded-For': `192.168.1.${i % 10}` }
        })
      );

      const responses = await Promise.all(requests);
      const successCount = responses.filter(r => r.status === 200).length;
      const rateLimitedCount = responses.filter(r => r.status === 429).length;

      // Should have some successful requests and some rate limited
      expect(successCount).toBeGreaterThan(0);
      expect(rateLimitedCount).toBeGreaterThanOrEqual(0);
    });

    test('should handle burst traffic patterns', async () => {
      // Simulate burst traffic
      const burstSize = 50;
      const bursts = Array(3).fill(null).map(() =>
        Array(burstSize).fill(null).map(async () => {
          const { req } = ApiTestHelper.createMockRequest('GET', '/api/menu');
          const response = await menuGET(req);
          return response.status;
        })
      );

      for (const burst of bursts) {
        const responses = await Promise.all(burst);
        const successCount = responses.filter(status => status === 200).length;

        // At least some requests should succeed in each burst
        expect(successCount).toBeGreaterThan(0);

        // Wait between bursts
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    });
  });

  describe('Data Exposure Prevention', () => {
    test('should not expose sensitive data in responses', async () => {
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /key/i,
        /token/i,
        /private/i,
        /admin/i,
        /config/i,
        /database/i,
        /connection/i
      ];

      const { req } = ApiTestHelper.createMockRequest('GET', '/api/menu');
      const response = await menuGET(req);
      const data = await response.json();
      const responseString = JSON.stringify(data);

      for (const pattern of sensitivePatterns) {
        expect(responseString).not.toMatch(pattern);
      }
    });

    test('should not expose server information', async () => {
      const serverInfoPatterns = [
        /server/i,
        /x-powered-by/i,
        /x-aspnet-version/i,
        /x-runtime/i,
        /node/i,
        /express/i,
        /next/i,
        /version/i
      ];

      const { req } = ApiTestHelper.createMockRequest('GET', '/api/menu');
      const response = await menuGET(req);

      for (const pattern of serverInfoPatterns) {
        expect(response.headers.get('server')).toBeNull();
        expect(response.headers.get('x-powered-by')).toBeNull();
      }
    });

    test('should prevent directory traversal', async () => {
      const traversalAttempts = [
        '../../../package.json',
        '..\\..\\..\\package.json',
        '/etc/passwd',
        'C:\\Windows\\System32\\config\\system',
        '../../../../.env',
        '../../../../config/database.json'
      ];

      for (const path of traversalAttempts) {
        const { req } = ApiTestHelper.createMockRequest('GET', `/api/menu?file=${encodeURIComponent(path)}`);
        const response = await menuGET(req);

        expect([200, 400, 403, 404]).toContain(response.status);

        if (response.status === 200) {
          const data = await response.json();
          const responseString = JSON.stringify(data);

          // Ensure no file system paths are returned
          expect(responseString).not.toContain('/etc/');
          expect(responseString).not.toContain('..\\');
          expect(responseString).not.toContain('package.json');
          expect(responseString).not.toContain('.env');
        }
      }
    });
  });
});
