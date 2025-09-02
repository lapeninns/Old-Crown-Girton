/**
 * Test Environment Configuration
 * Environment variables and settings for API testing
 */

export const testConfig = {
  // Test Environment
  TEST_ENV: process.env.TEST_ENV || 'test',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  API_VERSION: process.env.API_VERSION || 'v1',

  // Authentication
  TEST_AUTH_TOKEN: process.env.TEST_AUTH_TOKEN || 'test-jwt-token',
  TEST_API_KEY: process.env.TEST_API_KEY || 'test-api-key',
  ADMIN_TOKEN: process.env.ADMIN_TOKEN || 'admin-jwt-token',

  // Database
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db',

  // External Services
  EXTERNAL_API_MOCK: process.env.EXTERNAL_API_MOCK !== 'false',
  STRIPE_TEST_KEY: process.env.STRIPE_TEST_KEY || 'sk_test_mock',
  MAILGUN_TEST_KEY: process.env.MAILGUN_TEST_KEY || 'key-mock',

  // Performance Testing
  PERFORMANCE_TEST_ENABLED: process.env.PERFORMANCE_TEST_ENABLED === 'true',
  LOAD_TEST_USERS: parseInt(process.env.LOAD_TEST_USERS || '10'),
  LOAD_TEST_DURATION: parseInt(process.env.LOAD_TEST_DURATION || '60'), // seconds

  // Security Testing
  SECURITY_TEST_ENABLED: process.env.SECURITY_TEST_ENABLED === 'true',
  SQL_INJECTION_TEST_ENABLED: process.env.SQL_INJECTION_TEST_ENABLED !== 'false',
  XSS_TEST_ENABLED: process.env.XSS_TEST_ENABLED !== 'false',

  // Test Data
  GENERATE_FAKE_DATA: process.env.GENERATE_FAKE_DATA !== 'false',
  TEST_DATA_SIZE: process.env.TEST_DATA_SIZE || 'small', // small, medium, large

  // Timeouts
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '5000'),
  PERFORMANCE_TIMEOUT: parseInt(process.env.PERFORMANCE_TIMEOUT || '30000'),

  // Cache Settings
  CACHE_ENABLED: process.env.CACHE_ENABLED !== 'false',
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '300'),

  // Rate Limiting
  RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED !== 'false',
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'),

  // Monitoring
  MONITORING_ENABLED: process.env.MONITORING_ENABLED !== 'false',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Test environment validation
export function validateTestEnvironment() {
  const required = [
    'BASE_URL',
    'TEST_AUTH_TOKEN'
  ];

  const missing = required.filter(key => !testConfig[key as keyof typeof testConfig]);

  if (missing.length > 0) {
    throw new Error(`Missing required test environment variables: ${missing.join(', ')}`);
  }

  return true;
}

// Environment-specific configurations
export const environments = {
  development: {
    ...testConfig,
    BASE_URL: 'http://localhost:3000',
    CACHE_ENABLED: false,
    MONITORING_ENABLED: false
  },

  staging: {
    ...testConfig,
    BASE_URL: 'https://staging-api.yourservice.com',
    CACHE_ENABLED: true,
    MONITORING_ENABLED: true
  },

  production: {
    ...testConfig,
    BASE_URL: 'https://api.yourservice.com',
    CACHE_ENABLED: true,
    MONITORING_ENABLED: true,
    PERFORMANCE_TEST_ENABLED: false, // Don't run performance tests in prod
    SECURITY_TEST_ENABLED: false     // Don't run security tests in prod
  },

  test: {
    ...testConfig,
    BASE_URL: 'http://localhost:3001',
    CACHE_ENABLED: false,
    MONITORING_ENABLED: false,
    EXTERNAL_API_MOCK: true
  }
};

export function getCurrentEnvironment() {
  const env = process.env.NODE_ENV || 'test';
  return environments[env as keyof typeof environments] || environments.test;
}

// Database cleanup utilities
export const databaseCleanup = {
  async cleanupUsers() {
    // Implementation depends on your database setup
    console.log('Cleaning up test users...');
  },

  async cleanupReservations() {
    console.log('Cleaning up test reservations...');
  },

  async cleanupLeads() {
    console.log('Cleaning up test leads...');
  },

  async fullCleanup() {
    await Promise.all([
      this.cleanupUsers(),
      this.cleanupReservations(),
      this.cleanupLeads()
    ]);
  }
};

// Mock data generators for external services
export const mockServices = {
  stripe: {
    createCheckoutSession: () => ({
      id: 'cs_test_mock',
      url: 'https://checkout.stripe.com/test'
    }),

    createPortalSession: () => ({
      id: 'ps_test_mock',
      url: 'https://billing.stripe.com/test'
    })
  },

  mailgun: {
    sendEmail: () => ({
      id: 'mock-message-id',
      status: 'sent'
    })
  },

  supabase: {
    auth: {
      exchangeCodeForSession: () => ({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: { id: 'mock-user-id' }
      })
    }
  }
};
