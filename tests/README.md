# Comprehensive API Testing Framework

This repository includes a comprehensive API testing framework that covers all aspects of API testing including functional, performance, security, integration, and reliability testing.

## 🏗️ Framework Overview

The testing framework is organized into the following categories:

### 1. Functional Testing
- **Core Functionality**: CRUD operations, business logic validation
- **Input/Output Validation**: Request/response schema validation
- **HTTP Methods & Status Codes**: Comprehensive method testing
- **Error Handling**: Edge cases and error scenarios

### 2. Authentication & Authorization Testing
- **Authentication Mechanisms**: JWT, OAuth, API keys
- **Authorization Levels**: Role-based access control
- **Security Boundaries**: Permission validation

### 3. Performance Testing
- **Load Testing**: Using Artillery.js for scalable load testing
- **Response Time Validation**: Sub-200ms target for simple operations
- **Concurrent User Handling**: Multi-user scenario testing
- **Resource Usage Monitoring**: CPU, memory, database connections

### 4. Security Testing
- **SQL Injection Prevention**: Comprehensive payload testing
- **XSS Prevention**: Cross-site scripting attack simulation
- **Input Validation**: Malformed data and boundary testing
- **Rate Limiting**: DDoS protection validation
- **Data Exposure Prevention**: Sensitive data leak testing

### 5. Integration Testing
- **External Service Integration**: Third-party API interaction testing
- **Database Integration**: Connection, transaction, and data integrity
- **Message Queue Testing**: Pub/sub pattern validation
- **Cross-API Dependencies**: Inter-service communication

## 📁 Test Structure

```
tests/
├── api/
│   ├── functional/          # Core functionality tests
│   │   ├── menu.test.ts
│   │   └── restaurant.test.ts
│   ├── performance/         # Load and performance tests
│   │   ├── artillery.config.ts
│   │   └── performanceRunner.ts
│   ├── security/           # Security vulnerability tests
│   │   ├── security.test.ts
│   │   └── securityRunner.ts
│   ├── integration/        # External service integration
│   │   ├── integration.test.ts
│   │   └── integrationRunner.ts
│   ├── auth/               # Authentication/authorization
│   │   └── authCallback.test.ts
│   └── business-logic/     # Business rule validation
├── utils/                  # Test utilities and helpers
│   ├── apiTestHelper.ts
│   └── testDataFactory.ts
├── config/                 # Test configuration
│   └── testEnvironment.ts
├── data/                   # Test data management
├── mocks/                  # Mock services and data
└── testRunner.ts          # Main test orchestration
```

## 🛠️ Test Utilities

### ApiTestHelper
Comprehensive utilities for API testing:

```typescript
// Create mock requests
const { req, res } = ApiTestHelper.createMockRequest('GET', '/api/menu');

// Test response validation
ApiTestHelper.validateStandardizedResponse(response);

// Test caching headers
await ApiTestHelper.testCacheHeaders(endpoint);

// Test rate limiting
await ApiTestHelper.testRateLimiting(endpoint, 100);
```

### TestDataFactory
Generate realistic test data:

```typescript
// Create test users
const user = TestDataFactory.createUser({ name: 'John Doe' });

// Create menu items
const menuItem = TestDataFactory.createMenuItem({ available: true });

// Create bulk data
const users = TestDataFactory.createBulkUsers(50);
```

## 🚀 Running Tests

### Quick Start

```bash
# Run all tests
npm run test:comprehensive

# Run smoke tests (basic endpoint availability)
npm run test:smoke

# Run specific test categories
npm run test:api:functional
npm run test:api:security
npm run test:api:performance
npm run test:api:integration

# Run load tests
npm run test:load

# Generate test report
npm run test:report
```

### Development Testing

```bash
# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific API endpoint tests
npm run test:api -- --testNamePattern="menu"
```

### CI/CD Integration

```yaml
# .github/workflows/api-tests.yml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run functional tests
        run: npm run test:api:functional
      - name: Run security tests
        run: npm run test:api:security
      - name: Run performance tests
        run: npm run test:api:performance
      - name: Generate coverage report
        run: npm run test:coverage
```

## ⚙️ Configuration

### Environment Variables

```bash
# Test Environment
TEST_ENV=staging
BASE_URL=https://api.yourservice.com
API_VERSION=v1

# Authentication
TEST_AUTH_TOKEN=your_test_token
ADMIN_TOKEN=admin_token

# Performance Testing
PERFORMANCE_TEST_ENABLED=true
LOAD_TEST_USERS=100
LOAD_TEST_DURATION=300

# Security Testing
SECURITY_TEST_ENABLED=true
SQL_INJECTION_TEST_ENABLED=true
XSS_TEST_ENABLED=true

# External Services
EXTERNAL_API_MOCK=true
STRIPE_TEST_KEY=sk_test_mock
MAILGUN_TEST_KEY=key_mock
```

### Artillery Load Testing

Configure load testing scenarios in `tests/api/performance/artillery.config.ts`:

```typescript
export const artilleryConfig = {
  config: {
    target: process.env.BASE_URL,
    phases: [
      { duration: 60, arrivalRate: 10 },  // Warm up
      { duration: 120, arrivalRate: 50 }, // Ramp up
      { duration: 300, arrivalRate: 100 } // Sustained load
    ]
  },
  scenarios: [
    {
      name: 'Menu API Load Test',
      weight: 40,
      flow: [
        { get: { url: '/api/menu' } },
        { think: 2 }
      ]
    }
  ]
};
```

## 📊 Test Reports

### Coverage Reports

```bash
npm run test:coverage
```

Generates coverage reports in `coverage/` directory with:
- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

### Performance Reports

Load testing generates reports with:
- Response time percentiles (p50, p95, p99)
- Requests per second
- Error rates
- Throughput metrics

### Security Reports

Security scans provide:
- Vulnerability assessments
- SQL injection test results
- XSS prevention validation
- Rate limiting effectiveness

## 🔒 Security Testing

### SQL Injection Testing

Tests for SQL injection vulnerabilities using comprehensive payloads:

```typescript
test('should prevent SQL injection', async () => {
  const payloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "' UNION SELECT * FROM users --"
  ];

  for (const payload of payloads) {
    const response = await api.get(`/endpoint?param=${payload}`);
    expect([400, 422]).toContain(response.status);
  }
});
```

### XSS Prevention

Tests for cross-site scripting vulnerabilities:

```typescript
test('should prevent XSS attacks', async () => {
  const payloads = [
    "<script>alert('xss')</script>",
    "<img src=x onerror=alert('xss')>",
    "javascript:alert('xss')"
  ];

  for (const payload of payloads) {
    const response = await api.get(`/endpoint?param=${payload}`);
    expect(response.body).not.toContain('<script>');
  }
});
```

## ⚡ Performance Testing

### Load Testing Scenarios

1. **Warm-up Phase**: Gradual increase to normal load
2. **Sustained Load**: Consistent load for extended period
3. **Peak Load**: Maximum expected traffic
4. **Spike Testing**: Sudden traffic increases
5. **Stress Testing**: Beyond normal capacity

### Performance Metrics

- **Response Time**: < 200ms for simple operations
- **Throughput**: Requests per second capacity
- **Error Rate**: < 0.1% under normal load
- **Concurrent Users**: Maximum simultaneous connections
- **Resource Usage**: CPU, memory, database connections

## 🔗 Integration Testing

### External Service Mocking

Using `nock` for external service mocking:

```typescript
nock('https://api.stripe.com')
  .post('/v1/checkout/sessions')
  .reply(200, { id: 'cs_test_mock' });
```

### Database Testing

```typescript
test('should handle database operations', async () => {
  // Test connection
  // Test transactions
  // Test data integrity
  // Test concurrent access
});
```

## 📈 Monitoring & Observability

### Test Metrics

- Test execution time
- Pass/fail rates
- Coverage percentages
- Performance benchmarks
- Error patterns

### Alerting

Configure alerts for:
- Test failures
- Performance degradation
- Security vulnerabilities
- Coverage drops

## 🏆 Best Practices

### Test Organization

1. **Descriptive Test Names**: Clear, specific test descriptions
2. **Independent Tests**: No test dependencies
3. **Fast Execution**: Optimize for speed
4. **Realistic Data**: Use production-like test data
5. **Comprehensive Coverage**: Cover all code paths

### Maintenance

1. **Regular Updates**: Keep tests current with API changes
2. **Remove Obsolete Tests**: Clean up outdated tests
3. **Documentation**: Document complex test scenarios
4. **Version Control**: Track test changes with code changes

### Quality Gates

1. **Coverage Thresholds**: Minimum 85% coverage
2. **Performance Benchmarks**: Established performance baselines
3. **Security Standards**: Regular security scans
4. **Code Quality**: Linting and static analysis

## 🤝 Contributing

### Adding New Tests

1. Follow the established structure
2. Use existing utilities and helpers
3. Add appropriate documentation
4. Ensure tests are independent
5. Update CI/CD configuration if needed

### Test Categories

- **Unit Tests**: Individual function/component testing
- **Integration Tests**: Multi-component interaction
- **End-to-End Tests**: Complete user journey
- **Performance Tests**: Load and stress testing
- **Security Tests**: Vulnerability assessment

## 📚 Resources

### Tools & Libraries

- **Jest**: Testing framework
- **Supertest**: HTTP endpoint testing
- **Artillery**: Load testing
- **Nock**: HTTP mocking
- **node-mocks-http**: Next.js API route mocking

### Documentation

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Artillery Documentation](https://artillery.io/docs/)
- [API Testing Best Practices](https://swagger.io/resources/articles/best-practices-in-api-testing/)

### Related Projects

- [REST Assured](https://rest-assured.io/) - Java API testing
- [Postman](https://www.postman.com/) - API development and testing
- [Insomnia](https://insomnia.rest/) - API client and testing

---

This comprehensive testing framework ensures robust, reliable, and secure API functionality through systematic testing across all dimensions of API quality.
