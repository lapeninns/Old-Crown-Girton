/**
 * Vitest Server Environment Setup
 * 
 * Setup for server-side tests using Vitest instead of Jest
 */

import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Ensure fetch is available
if (!global.fetch) {
  try {
    const { fetch, Headers, Request, Response, FormData } = await import('undici');
    // @ts-ignore
    global.fetch = fetch;
    global.Headers = Headers;
    global.Request = Request;
    global.Response = Response;
    global.FormData = FormData;
  } catch (error) {
    console.warn('undici not available, fetch might not work in server tests');
  }
}

// MSW server setup
export const server = setupServer(
  http.get('*/api/health', () => {
    return HttpResponse.json({ ok: true, timestamp: Date.now() });
  }),
  
  http.get('*/api/content', () => {
    return HttpResponse.json({
      success: true,
      data: {
        nav: { brand: "Test Restaurant" },
        footer: { copyright: "© 2024 Test" }
      },
      meta: { version: "2.0.0", timestamp: Date.now() }
    });
  })
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// Mock server-only modules
vi.mock('server-only', () => ({}));

// Mock Next.js server functions
vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map()),
  cookies: vi.fn(() => new Map()),
}));

vi.mock('next/cache', () => ({
  unstable_cache: vi.fn((fn) => fn),
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

export { http };