/**
 * Server Tests Setup
 * 
 * This file configures server-side test utilities including:
 * - MSW (Mock Service Worker) for API mocking
 * - Test database setup
 * - Server-side utilities
 */

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { beforeAll, afterEach, afterAll } from '@jest/globals';

// Create MSW server for intercepting HTTP requests in server tests
export const server = setupServer(
  // Default handlers
  http.get('*/api/health', () => {
    return HttpResponse.json({ ok: true, timestamp: Date.now() });
  }),
  
  http.get('*/api/content', () => {
    return HttpResponse.json({
      success: true,
      data: {
        nav: {
          brand: "Old Crown Girton",
          links: [
            { text: "Menu", href: "/menu" },
            { text: "About", href: "/about" },
            { text: "Contact", href: "/contact" }
          ]
        },
        footer: {
          copyright: "© 2024 Old Crown Girton. All rights reserved."
        }
      },
      meta: {
        version: "2.0.0",
        timestamp: Date.now(),
        requestId: "test-request-id"
      }
    });
  }),
  
  http.get('*/api/menu', () => {
    return HttpResponse.json({
      success: true,
      data: {
        sections: [
          {
            id: "starters",
            name: "Starters",
            items: [
              {
                id: "item-1",
                name: "Test Starter",
                description: "A test starter item",
                price: 8.50
              }
            ]
          }
        ]
      },
      meta: {
        version: "1.0.0",
        timestamp: Date.now()
      }
    });
  }),
  
  http.get('*/api/restaurant', () => {
    return HttpResponse.json({
      success: true,
      data: {
        name: "Old Crown Girton",
        phone: "01223277217",
        address: "89 High Street, Girton, Cambridge, CB3 0QQ",
        hours: {
          monday: "12:00-23:00",
          tuesday: "12:00-23:00",
          wednesday: "12:00-23:00",
          thursday: "12:00-23:00",
          friday: "12:00-23:00",
          saturday: "12:00-23:00",
          sunday: "12:00-22:30"
        }
      },
      meta: {
        version: "1.0.0",
        timestamp: Date.now()
      }
    });
  })
);

// Setup MSW server lifecycle
beforeAll(() => {
  server.listen({ 
    onUnhandledRequest: 'warn' // Only warn on unhandled requests in tests
  });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// Export utilities for use in tests
export { http };

// Mock server-only modules
jest.mock('server-only', () => ({}));

// Mock Next.js headers function for App Router
jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Map()),
  cookies: jest.fn(() => new Map()),
}));

// Mock Next.js cache functions
jest.mock('next/cache', () => ({
  unstable_cache: jest.fn((fn) => fn),
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
}));