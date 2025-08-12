import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ...(process.env.CI ? [['github'] as const] : [])
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PW_BASE_URL || 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video retention */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers and devices */
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile devices
    {
      name: 'iPhone 14 Pro (Light)',
      use: {
        ...devices['iPhone 14 Pro'],
        colorScheme: 'light',
      },
    },

    {
      name: 'Pixel 7 (Dark)',
      use: {
        ...devices['Pixel 7'],
        colorScheme: 'dark',
      },
    },

    {
      name: 'iPad (Landscape)',
      use: {
        ...devices['iPad Pro landscape'],
        colorScheme: 'light',
      },
    },

    // Fixed Tailwind breakpoints for desktop testing
    {
      name: 'Desktop-sm (640px)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 640, height: 900 },
        colorScheme: 'light',
      },
    },

    {
      name: 'Desktop-md (768px)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 900 },
        colorScheme: 'light',
      },
    },

    {
      name: 'Desktop-lg (1024px)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 900 },
        colorScheme: 'light',
      },
    },

    {
      name: 'Desktop-xl (1280px)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 900 },
        colorScheme: 'light',
      },
    },

    // Dark mode testing across breakpoints
    {
      name: 'Desktop-lg-dark (1024px)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 900 },
        colorScheme: 'dark',
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
