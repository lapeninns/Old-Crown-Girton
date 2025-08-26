/**
 * Client Environment Setup
 * 
 * This file sets up the browser-like environment for client-side tests including:
 * - JSDOM environment enhancements
 * - Browser API polyfills
 * - React testing utilities setup
 */

// Set up environment variables for client tests
if (!process.env.NODE_ENV) {
  Object.defineProperty(process.env, 'NODE_ENV', {
    value: 'test',
    writable: false
  });
}
process.env.NEXT_PUBLIC_TEST_MODE = 'true';

// Mock browser APIs that aren't available in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

// Mock Element.scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock getComputedStyle for better CSS-in-JS support
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
    display: 'block',
    visibility: 'visible',
    opacity: '1',
    transform: 'none',
    transition: 'none',
    zIndex: 'auto',
  }),
});

// Set up viewport for responsive testing
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();