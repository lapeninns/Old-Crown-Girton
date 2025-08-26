/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
  test: {
    globals: true,
    environment: 'node', // Default to node environment
    include: [
      '**/__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)',
      '**/tests/**/*.{test,spec}.?(c|m)[jt]s?(x)',
    ],
    setupFiles: ['./test/setupVitest.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'app/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/*.d.ts',
        '**/node_modules/**',
        '**/.next/**',
        '**/test/**',
        '**/tests/**',
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
      },
    },
    testTimeout: 15000,
  },
});

// Alternative: Server and Client configurations
export const serverConfig = defineConfig({
  ...defineConfig().test,
  test: {
    ...defineConfig().test?.test,
    name: 'server',
    environment: 'node',
    include: [
      '**/__tests__/**/*.(server|api).(test|spec).[jt]s?(x)',
      '**/tests/**/api/**/*.(test|spec).[jt]s?(x)',
      '**/tests/**/server/**/*.(test|spec).[jt]s?(x)',
      '**/app/api/**/*.(test|spec).[jt]s?(x)',
      '**/src/lib/**/*.(test|spec).[jt]s?(x)',
      '**/tests/data/**/*.(test|spec).[jt]s?(x)',
    ],
    setupFiles: ['./test/setupVitestServer.ts'],
  },
});

export const clientConfig = defineConfig({
  ...defineConfig().test,
  test: {
    ...defineConfig().test?.test,
    name: 'client',
    environment: 'jsdom',
    include: [
      '**/__tests__/**/*.(client|ui|component).(test|spec).[jt]s?(x)',
      '**/tests/**/components/**/*.(test|spec).[jt]s?(x)',
      '**/components/**/*.(test|spec).[jt]s?(x)',
    ],
    setupFiles: ['./test/setupVitestClient.ts'],
  },
});