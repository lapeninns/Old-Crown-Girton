/**
 * Test Runner Script
 * Orchestrates comprehensive API testing
 */

import { testConfig, validateTestEnvironment } from './config/testEnvironment';
import { runPerformanceTests } from './api/performance/performanceRunner';
import { runSecurityTests } from './api/security/securityRunner';
import { runIntegrationTests } from './api/integration/integrationRunner';

export class TestRunner {
  static async runAllTests() {
    console.log('🚀 Starting Comprehensive API Testing Suite');
    console.log('==========================================');

    try {
      // Validate environment
      validateTestEnvironment();
      console.log('✅ Environment validation passed');

      // Run functional tests
      console.log('\n📋 Running Functional Tests...');
      await this.runFunctionalTests();

      // Run performance tests
      if (testConfig.PERFORMANCE_TEST_ENABLED) {
        console.log('\n⚡ Running Performance Tests...');
        await runPerformanceTests();
      }

      // Run security tests
      if (testConfig.SECURITY_TEST_ENABLED) {
        console.log('\n🔒 Running Security Tests...');
        await runSecurityTests();
      }

      // Run integration tests
      console.log('\n🔗 Running Integration Tests...');
      await runIntegrationTests();

      console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
      console.error('\n❌ Test suite failed:', error);
      process.exit(1);
    }
  }

  static async runFunctionalTests() {
    const { execSync } = require('child_process');

    try {
      console.log('Running unit tests...');
      execSync('npm run test:api:functional', { stdio: 'inherit' });

      console.log('Running API route tests...');
      execSync('npm run test:api:routes', { stdio: 'inherit' });

      console.log('Running business logic tests...');
      execSync('npm run test:api:business', { stdio: 'inherit' });

    } catch (error) {
      throw new Error(`Functional tests failed: ${error.message}`);
    }
  }

  static async runSmokeTests() {
    console.log('🧪 Running Smoke Tests...');

    const endpoints = [
      '/api/menu',
      '/api/restaurant',
      '/api/marketing',
      '/api/health',
      '/api/config'
    ];

    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        const response = await fetch(`${testConfig.BASE_URL}${endpoint}`);
        if (!response.ok) {
          throw new Error(`Endpoint ${endpoint} failed with status ${response.status}`);
        }
        return { endpoint, status: response.status };
      })
    );

    const failures = results.filter(result => result.status === 'rejected');

    if (failures.length > 0) {
      throw new Error(`Smoke tests failed: ${failures.map(f => f.reason.message).join(', ')}`);
    }

    console.log('✅ All smoke tests passed');
  }

  static async runLoadTests() {
    console.log('🔥 Running Load Tests...');

    const { execSync } = require('child_process');

    try {
      execSync('npx artillery run tests/api/performance/artillery.config.ts', {
        stdio: 'inherit',
        env: { ...process.env, BASE_URL: testConfig.BASE_URL }
      });
    } catch (error) {
      throw new Error(`Load tests failed: ${error.message}`);
    }
  }

  static async generateTestReport() {
    console.log('📊 Generating Test Report...');

    const report = {
      timestamp: new Date().toISOString(),
      environment: testConfig.TEST_ENV,
      baseUrl: testConfig.BASE_URL,
      results: {
        functional: 'pending',
        performance: 'pending',
        security: 'pending',
        integration: 'pending'
      },
      coverage: {},
      recommendations: [] as string[]
    };

    // Generate coverage report
    try {
      const { execSync } = require('child_process');
      execSync('npm run test:coverage', { stdio: 'pipe' });

      // Read coverage report
      const fs = require('fs');
      const coveragePath = 'coverage/coverage-summary.json';

      if (fs.existsSync(coveragePath)) {
        const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        report.coverage = {
          lines: coverage.total.lines.pct,
          functions: coverage.total.functions.pct,
          branches: coverage.total.branches.pct,
          statements: coverage.total.statements.pct
        };
      }
    } catch (error) {
      console.warn('Coverage report generation failed:', error.message);
    }

    // Save report
    const fs = require('fs');
    const reportPath = `test-reports/report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`📄 Test report saved to ${reportPath}`);
    return report;
  }

  static async runScheduledTests() {
    console.log('⏰ Running Scheduled Tests...');

    const schedule = [
      { name: 'Smoke Tests', interval: 'every 5 minutes', runner: this.runSmokeTests },
      { name: 'Full Suite', interval: 'daily', runner: this.runAllTests },
      { name: 'Security Scan', interval: 'weekly', runner: runSecurityTests },
      { name: 'Performance Benchmark', interval: 'weekly', runner: runPerformanceTests }
    ];

    // This would integrate with a scheduler like node-cron
    console.log('Scheduled tests configured:', schedule.map(s => `${s.name} (${s.interval})`));
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  switch (command) {
    case 'all':
      TestRunner.runAllTests();
      break;
    case 'smoke':
      TestRunner.runSmokeTests();
      break;
    case 'load':
      TestRunner.runLoadTests();
      break;
    case 'report':
      TestRunner.generateTestReport();
      break;
    case 'schedule':
      TestRunner.runScheduledTests();
      break;
    default:
      console.log('Usage: npm run test:runner [all|smoke|load|report|schedule]');
      process.exit(1);
  }
}

export default TestRunner;
