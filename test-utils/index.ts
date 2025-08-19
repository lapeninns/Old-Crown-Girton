/**
 * Comprehensive test utilities for responsive UX/UI testing
 * 
 * This module provides everything needed for testing React + Tailwind components
 * with proper viewport simulation, SWR mocking, and accessibility validation.
 */

// Export all utilities from test-utils
export * from './renderWithProviders';
export * from './setupViewport';

// Export MSW mocks
export * from './mocks/handlers';
export { server } from './mocks/server';
export { worker } from './mocks/browser';

// Re-export common testing libraries for convenience
export {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  cleanup,
} from '@testing-library/react';

export { default as userEvent } from '@testing-library/user-event';

// Export Jest utilities
export { expect, jest, describe, it, test, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
