import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { setupViewport, ViewportSize, BREAKPOINTS, BreakpointName } from './setupViewport';

/**
 * Custom render function that wraps components with necessary providers
 * for testing React components with SWR, themes, and responsive behavior
 */

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // SWR configuration for testing
  swrConfig?: {
    dedupingInterval?: number;
    provider?: () => Map<any, any>;
    fallback?: Record<string, any>;
  };
  
  // Viewport simulation
  viewport?: ViewportSize | BreakpointName;
  
  // Theme setup
  theme?: 'light' | 'dark';
  
  // Motion preferences
  reducedMotion?: boolean;
  
  // Custom wrapper component
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

// Default SWR configuration for tests
const defaultSWRConfig = {
  dedupingInterval: 0, // Disable deduping in tests
  provider: () => new Map(), // Fresh cache for each test
  fallback: {}, // No default fallback data
};

/**
 * Enhanced render function with providers and responsive setup
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const {
    swrConfig = {},
    viewport,
    theme,
    reducedMotion,
    wrapper: CustomWrapper,
    ...renderOptions
  } = options;

  // Setup viewport simulation if provided
  if (viewport) {
    const viewportConfig = typeof viewport === 'string' 
      ? BREAKPOINTS[viewport] 
      : viewport;
    setupViewport(viewportConfig);
  }

  // Setup theme if provided
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Mock prefers-color-scheme
    const mediaQuery = `(prefers-color-scheme: ${theme})`;
    window.matchMedia = jest.fn((query: string) => ({
      matches: query === mediaQuery,
      media: query,
      onchange: null as ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  }

  // Setup reduced motion if provided
  if (reducedMotion !== undefined) {
    const mediaQuery = `(prefers-reduced-motion: ${reducedMotion ? 'reduce' : 'no-preference'})`;
    window.matchMedia = jest.fn((query: string) => ({
      matches: query === mediaQuery,
      media: query,
      onchange: null as ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  }

  // Create the providers wrapper
  function AllTheProviders({ children }: { children: React.ReactNode }) {
    const mergedSWRConfig = { ...defaultSWRConfig, ...swrConfig };
    
    const providers = (
      <SWRConfig value={mergedSWRConfig}>
        {children}
      </SWRConfig>
    );

    // Wrap with custom wrapper if provided
    if (CustomWrapper) {
      return <CustomWrapper>{providers}</CustomWrapper>;
    }

    return providers;
  }

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
}

/**
 * Helper to create a test suite that runs across multiple viewports
 */
export function createResponsiveTestSuite(
  testName: string,
  testFn: (viewport: ViewportSize) => void,
  breakpoints: BreakpointName[] = ['mobile', 'tablet', 'desktop']
): void {
  describe(testName, () => {
    breakpoints.forEach((breakpointName) => {
      const viewport = BREAKPOINTS[breakpointName];
      
      describe(`on ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
        beforeEach(() => {
          setupViewport(viewport);
        });

        testFn(viewport);
      });
    });
  });
}

/**
 * Helper to test component with SWR data
 */
export function renderWithSWRData(
  ui: React.ReactElement,
  fallbackData: Record<string, any>,
  options: Omit<CustomRenderOptions, 'swrConfig'> = {}
): RenderResult {
  return renderWithProviders(ui, {
    ...options,
    swrConfig: {
      fallback: fallbackData,
    },
  });
}

/**
 * Helper to test component in dark mode
 */
export function renderInDarkMode(
  ui: React.ReactElement,
  options: Omit<CustomRenderOptions, 'theme'> = {}
): RenderResult {
  return renderWithProviders(ui, {
    ...options,
    theme: 'dark',
  });
}

/**
 * Helper to test component with reduced motion
 */
export function renderWithReducedMotion(
  ui: React.ReactElement,
  options: Omit<CustomRenderOptions, 'reducedMotion'> = {}
): RenderResult {
  return renderWithProviders(ui, {
    ...options,
    reducedMotion: true,
  });
}

/**
 * Helper to test component on mobile viewport
 */
export function renderOnMobile(
  ui: React.ReactElement,
  options: Omit<CustomRenderOptions, 'viewport'> = {}
): RenderResult {
  return renderWithProviders(ui, {
    ...options,
    viewport: 'mobile',
  });
}

/**
 * Helper to test component on desktop viewport
 */
export function renderOnDesktop(
  ui: React.ReactElement,
  options: Omit<CustomRenderOptions, 'viewport'> = {}
): RenderResult {
  return renderWithProviders(ui, {
    ...options,
    viewport: 'desktop',
  });
}

/**
 * Mock SWR hook for testing
 */
export function mockSWR(data: any, error?: any, isLoading: boolean = false) {
  return {
    data,
    error,
    isLoading,
    isValidating: false,
    mutate: jest.fn(),
  };
}

/**
 * Wait for SWR to finish loading
 * Useful for testing components that use SWR
 */
export async function waitForSWR(): Promise<void> {
  // Wait for next tick to allow SWR to process
  await new Promise((resolve) => setTimeout(resolve, 0));
}

// Re-export common testing utilities
export { screen, fireEvent, waitFor, act } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Export types
export type { RenderResult, CustomRenderOptions, ViewportSize, BreakpointName };
