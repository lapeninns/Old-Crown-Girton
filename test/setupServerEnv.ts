/**
 * Server Environment Setup
 * 
 * This file sets up the Node.js environment for server-side tests including:
 * - Global fetch polyfill for Node < 18 or missing web APIs
 * - Environment variables loading
 * - Node-specific globals setup
 */

// Ensure fetch is available (Node 18+ has it, but add fallback for older versions)
if (!global.fetch) {
  try {
    (import('undici') as any).then(({ fetch, Headers, Request, Response, FormData }: any) => {
      // @ts-ignore - Adding globals for test environment
      global.fetch = fetch;
      global.Headers = Headers;
      global.Request = Request;
      global.Response = Response;
      global.FormData = FormData;
    }).catch((error: any) => {
      console.warn('undici not available, fetch might not work in server tests');
    });
  } catch (error) {
    console.warn('undici not available, fetch might not work in server tests');
  }
}

// Ensure web streams are available
if (!global.ReadableStream) {
  try {
    (import('node:stream/web') as any).then(({ ReadableStream, WritableStream, TransformStream }: any) => {
      global.ReadableStream = ReadableStream;
      global.WritableStream = WritableStream;
      global.TransformStream = TransformStream;
    }).catch((error: any) => {
      console.warn('Web streams not available in this Node version');
    });
  } catch (error) {
    console.warn('Web streams not available in this Node version');
  }
}

// Load environment variables from .env.test if it exists
try {
  require('dotenv/config');
} catch (error) {
  // dotenv might not be available, that's fine
}

// Set test environment variables
if (!process.env.NODE_ENV) {
  Object.assign(process.env, { NODE_ENV: 'test' });
}
Object.assign(process.env, { NEXT_PUBLIC_TEST_MODE: 'true' });

// Mock console methods that are too verbose in tests
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = (...args) => {
  // Filter out noisy Next.js warnings in tests
  const message = args[0]?.toString() || '';
  if (message.includes('Warning:') && message.includes('React')) {
    return; // Suppress React warnings in server tests
  }
  originalConsoleWarn(...args);
};

console.error = (...args) => {
  // Filter out expected test errors
  const message = args[0]?.toString() || '';
  if (message.includes('Warning:') && message.includes('React')) {
    return; // Suppress React warnings in server tests
  }
  originalConsoleError(...args);
};