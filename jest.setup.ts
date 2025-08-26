import '@testing-library/jest-dom';
// Temporarily comment out MSW to fix import issues
// import { server } from './test-utils/mocks/server';
import { cleanupViewport } from './test-utils/setupViewport';

/**
 * Jest setup file for responsive UI testing
 * Configures MSW, viewport simulation, and global test utilities
 */

// Setup MSW server for API mocking
// Temporarily disabled due to MSW v2 import issues
// beforeAll(() => {
//   server.listen({
//     onUnhandledRequest: 'warn',
//   });
// });

// Reset handlers after each test
afterEach(() => {
  // server.resetHandlers();
  cleanupViewport();
});

// Clean up after all tests
// afterAll(() => {
//   server.close();
// });

// Mock server-only modules to prevent import errors in client-side tests
jest.mock('server-only', () => ({}));

// Mock IntersectionObserver (used by many UI components)
(global as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  
  disconnect() {}
  
  observe() {}
  
  unobserve() {}
};

// Mock ResizeObserver (used by responsive components)
(global as any).ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  
  disconnect() {}
  
  observe() {}
  
  unobserve() {}
};

// Mock Element.scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

// Mock getComputedStyle for CSS-in-JS libraries
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

// Mock next/router for Next.js components
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock next/navigation for App Router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const React = require('react');
  
  return {
    motion: {
      div: ({ children, ...props }: any) => React.createElement('div', props, children),
      button: ({ children, ...props }: any) => React.createElement('button', props, children),
      span: ({ children, ...props }: any) => React.createElement('span', props, children),
      h1: ({ children, ...props }: any) => React.createElement('h1', props, children),
      h2: ({ children, ...props }: any) => React.createElement('h2', props, children),
      h3: ({ children, ...props }: any) => React.createElement('h3', props, children),
      p: ({ children, ...props }: any) => React.createElement('p', props, children),
      section: ({ children, ...props }: any) => React.createElement('section', props, children),
      article: ({ children, ...props }: any) => React.createElement('article', props, children),
      nav: ({ children, ...props }: any) => React.createElement('nav', props, children),
      form: ({ children, ...props }: any) => React.createElement('form', props, children),
      input: ({ children, ...props }: any) => React.createElement('input', props, children),
      textarea: ({ children, ...props }: any) => React.createElement('textarea', props, children),
      a: ({ children, ...props }: any) => React.createElement('a', props, children),
    },
    AnimatePresence: ({ children }: any) => children,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn(),
    }),
    useInView: () => [jest.fn(), true],
    useMotionValue: () => ({ get: jest.fn(), set: jest.fn() }),
    useSpring: () => ({ get: jest.fn(), set: jest.fn() }),
    useTransform: () => ({ get: jest.fn(), set: jest.fn() }),
  };
});

// Increase test timeout for complex responsive tests
jest.setTimeout(10000);

// Set up console warnings/errors to fail tests in CI
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: any[]) => {
  originalConsoleError(...args);
  
  // Fail test on React warnings/errors in CI
  if (process.env.CI && args[0]?.includes?.('Warning:')) {
    throw new Error(`Console error: ${args.join(' ')}`);
  }
};

console.warn = (...args: any[]) => {
  originalConsoleWarn(...args);
  
  // Log warnings but don't fail tests (warnings are often informational)
  if (process.env.CI && process.env.FAIL_ON_CONSOLE_WARN) {
    throw new Error(`Console warning: ${args.join(' ')}`);
  }
};
