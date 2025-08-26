import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Configuration with projects for separate server and client environments
const customJestConfig = {
  // Projects configuration for separate environments
  projects: [
    // Server environment for API routes and server-side code
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: [
        '**/__tests__/**/*.(server|api).(test|spec).[jt]s?(x)',
        '**/tests/**/api/**/*.(test|spec).[jt]s?(x)',
        '**/tests/**/server/**/*.(test|spec).[jt]s?(x)',
        '**/tests/**/*.(server|api).(test|spec).[jt]s?(x)',
        '**/app/api/**/*.(test|spec).[jt]s?(x)',
        '**/src/lib/**/*.(test|spec).[jt]s?(x)',
        // Add data loader tests
        '**/tests/data/**/*.(test|spec).[jt]s?(x)',
        '**/tests/validation/**/*.(test|spec).[jt]s?(x)',
        '**/tests/compatibility/**/*.(test|spec).[jt]s?(x)',
        // Example tests
        '**/test/examples/**/*.(server|api).(test|spec).[jt]s?(x)',
      ],
      setupFiles: ['<rootDir>/test/setupServerEnv.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setupServerTests.ts'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { 
          tsconfig: { 
            jsx: 'react-jsx',
            module: 'esnext',
            target: 'es2020'
          } 
        }],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      transformIgnorePatterns: [
        '/node_modules/(?!(nanoid|@supabase|undici)/)/',
      ],
    },
    
    // Client environment for React components and browser code
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: [
        '**/__tests__/**/*.(client|ui|component).(test|spec).[jt]s?(x)',
        '**/tests/**/components/**/*.(test|spec).[jt]s?(x)',
        '**/tests/**/ui/**/*.(test|spec).[jt]s?(x)',
        '**/tests/**/*.(client|ui|component).(test|spec).[jt]s?(x)',
        '**/components/**/*.(test|spec).[jt]s?(x)',
        '**/tests/e2e/**/*.(test|spec).[jt]s?(x)',
        // Default pattern for component tests
        '**/tests/components/**/*.(test|spec).[jt]s?(x)',
        // Example tests
        '**/test/examples/**/*.(client|component).(test|spec).[jt]s?(x)',
      ],
      setupFiles: ['<rootDir>/test/setupClientEnv.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setupClientTests.ts'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { 
          tsconfig: { 
            jsx: 'react-jsx',
            module: 'esnext',
            target: 'es2020'
          } 
        }],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        // Mock static files in client tests
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/__mocks__/fileMock.js',
      },
      transformIgnorePatterns: [
        '/node_modules/(?!(nanoid|@supabase)/)/',
      ],
    },
  ],
  
  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/test/**',
    '!**/tests/**',
  ],
  
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};

// Export the enhanced configuration
export default createJestConfig(customJestConfig);