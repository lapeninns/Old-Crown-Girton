/**
 * Utility for simulating different viewport sizes in Jest + RTL tests
 * Provides breakpoint simulation for responsive component testing
 */

export interface ViewportSize {
  width: number;
  height: number;
  name: string;
}

export const BREAKPOINTS = {
  mobile: { width: 375, height: 667, name: 'iPhone SE' },
  mobileLarge: { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
  tablet: { width: 768, height: 1024, name: 'iPad' },
  tabletLandscape: { width: 1024, height: 768, name: 'iPad Landscape' },
  desktop: { width: 1280, height: 720, name: 'Desktop' },
  desktopLarge: { width: 1920, height: 1080, name: 'Desktop Large' },
  
  // Tailwind CSS breakpoints
  sm: { width: 640, height: 800, name: 'Tailwind SM' },
  md: { width: 768, height: 1024, name: 'Tailwind MD' },
  lg: { width: 1024, height: 768, name: 'Tailwind LG' },
  xl: { width: 1280, height: 720, name: 'Tailwind XL' },
  '2xl': { width: 1536, height: 864, name: 'Tailwind 2XL' },
} as const;

export type BreakpointName = keyof typeof BREAKPOINTS;

/**
 * Sets up viewport simulation for testing responsive behavior
 * @param viewport - The viewport configuration to simulate
 */
export function setupViewport(viewport: ViewportSize): void {
  // Mock window.innerWidth and window.innerHeight
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: viewport.width,
  });

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: viewport.height,
  });

  // Mock window.screen properties
  Object.defineProperty(window.screen, 'width', {
    writable: true,
    configurable: true,
    value: viewport.width,
  });

  Object.defineProperty(window.screen, 'height', {
    writable: true,
    configurable: true,
    value: viewport.height,
  });

  // Mock matchMedia for CSS media queries
  const mediaQueries: Record<string, boolean> = {
    '(max-width: 640px)': viewport.width <= 640,
    '(max-width: 768px)': viewport.width <= 768,
    '(max-width: 1024px)': viewport.width <= 1024,
    '(max-width: 1280px)': viewport.width <= 1280,
    '(max-width: 1536px)': viewport.width <= 1536,
    '(min-width: 640px)': viewport.width >= 640,
    '(min-width: 768px)': viewport.width >= 768,
    '(min-width: 1024px)': viewport.width >= 1024,
    '(min-width: 1280px)': viewport.width >= 1280,
    '(min-width: 1536px)': viewport.width >= 1536,
    
    // Common responsive queries
    '(orientation: portrait)': viewport.height > viewport.width,
    '(orientation: landscape)': viewport.width > viewport.height,
    '(pointer: fine)': viewport.width >= 768, // Assume touch on smaller screens
    '(pointer: coarse)': viewport.width < 768,
    '(hover: hover)': viewport.width >= 768, // Assume no hover on smaller screens
    '(hover: none)': viewport.width < 768,
    
    // Prefered color scheme (can be overridden in tests)
    '(prefers-color-scheme: dark)': false,
    '(prefers-color-scheme: light)': true,
    '(prefers-reduced-motion: reduce)': false,
    '(prefers-reduced-motion: no-preference)': true,
  };

  window.matchMedia = jest.fn((query: string) => ({
    matches: mediaQueries[query] ?? false,
    media: query,
    onchange: null as ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

  // Trigger resize event to notify components
  window.dispatchEvent(new Event('resize'));
}

/**
 * Helper to test component across multiple breakpoints
 * @param testFn - Function that runs the test for each breakpoint
 * @param breakpoints - Array of breakpoint names to test (defaults to common ones)
 */
export function testAcrossBreakpoints(
  testFn: (viewport: ViewportSize) => void | Promise<void>,
  breakpoints: BreakpointName[] = ['mobile', 'tablet', 'desktop']
): void {
  breakpoints.forEach((breakpointName) => {
    const viewport = BREAKPOINTS[breakpointName];
    describe(`at ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        setupViewport(viewport);
      });

      testFn(viewport);
    });
  });
}

/**
 * Simulates a touch device for testing touch interactions
 */
export function setupTouchDevice(): void {
  // Mock touch events support
  Object.defineProperty(window, 'ontouchstart', {
    writable: true,
    configurable: true,
    value: null,
  });

  // Mock TouchEvent constructor
  (global as any).TouchEvent = class TouchEvent extends Event {
    constructor(type: string, eventInitDict?: TouchEventInit) {
      super(type, eventInitDict);
    }
  };

  // Mock Touch constructor
  (global as any).Touch = class Touch {
    constructor(touchInit: TouchInit) {
      Object.assign(this, touchInit);
    }
  };
}

/**
 * Sets up prefers-reduced-motion for animation testing
 */
export function setupReducedMotion(reduced: boolean = true): void {
  const mediaQuery = `(prefers-reduced-motion: ${reduced ? 'reduce' : 'no-preference'})`;
  
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

/**
 * Sets up dark mode for theme testing
 */
export function setupDarkMode(isDark: boolean = true): void {
  const mediaQuery = `(prefers-color-scheme: ${isDark ? 'dark' : 'light'})`;
  
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

  // Also set data-theme attribute for DaisyUI
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

/**
 * Cleanup function to reset viewport and media query mocks
 */
export function cleanupViewport(): void {
  // Reset window properties
  delete (window as any).innerWidth;
  delete (window as any).innerHeight;
  delete (window.screen as any).width;
  delete (window.screen as any).height;
  delete (window as any).matchMedia;
  delete (window as any).ontouchstart;
  
  // Reset document attributes
  document.documentElement.removeAttribute('data-theme');
  
  // Clear all mocks
  jest.clearAllMocks();
}

export default {
  setupViewport,
  testAcrossBreakpoints,
  setupTouchDevice,
  setupReducedMotion,
  setupDarkMode,
  cleanupViewport,
  BREAKPOINTS,
};
