/**
 * Client Tests Setup
 * 
 * This file configures client-side test utilities including:
 * - React Testing Library setup
 * - Component testing utilities
 * - Mock modules for client-side code
 */

import React from 'react';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from '@jest/globals';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
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
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isReady: true,
    };
  },
}));

// Mock Next.js navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
  useParams() {
    return {};
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const React = require('react');
    return React.createElement('img', props);
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any }) => {
    const React = require('react');
    return React.createElement('a', { href, ...props }, children);
  },
}));

// Mock Framer Motion for client tests
jest.mock('framer-motion', () => {
  const React = require('react');
  
  // Create a motion component factory that filters out motion props
  const createMotionComponent = (tag: string) => {
    return ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => {
      // Filter out motion-specific props to avoid React warnings
      const {
        whileHover,
        whileTap,
        whileInView,
        initial,
        animate,
        exit,
        transition,
        variants,
        viewport,
        onAnimationComplete,
        onAnimationStart,
        ...domProps
      } = props;
      
      return React.createElement(tag, domProps, children);
    };
  };
  
  return {
    motion: {
      div: createMotionComponent('div'),
      button: createMotionComponent('button'),
      span: createMotionComponent('span'),
      h1: createMotionComponent('h1'),
      h2: createMotionComponent('h2'),
      h3: createMotionComponent('h3'),
      p: createMotionComponent('p'),
      section: createMotionComponent('section'),
      article: createMotionComponent('article'),
      nav: createMotionComponent('nav'),
      form: createMotionComponent('form'),
      input: createMotionComponent('input'),
      textarea: createMotionComponent('textarea'),
      a: createMotionComponent('a'),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
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

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: undefined as any,
    error: undefined as Error | null,
    isLoading: false,
    isValidating: false,
    mutate: jest.fn(),
  })),
  useSWRConfig: jest.fn(() => ({
    cache: new Map(),
    mutate: jest.fn(),
  })),
}));

// Increase test timeout for complex component tests
jest.setTimeout(10000);

// Suppress console warnings in tests unless explicitly needed
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  originalConsoleError(...args);
  
  // Fail test on React warnings/errors in CI
  if (process.env.CI && args[0]?.includes?.('Warning:')) {
    throw new Error(`Console error: ${args.join(' ')}`);
  }
};

console.warn = (...args) => {
  originalConsoleWarn(...args);
  
  // Log warnings but don't fail tests unless explicitly configured
  if (process.env.CI && process.env.FAIL_ON_CONSOLE_WARN) {
    throw new Error(`Console warning: ${args.join(' ')}`);
  }
};