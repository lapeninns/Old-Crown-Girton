# Responsive UX/UI Testing Suite

This comprehensive testing infrastructure provides everything needed to test React + Tailwind CSS components across multiple devices, viewports, and user scenarios with 90%+ coverage standards.

## 🎯 Overview

### What's Included

- **Playwright E2E Tests**: Cross-browser testing with device simulation
- **Jest + RTL Unit Tests**: Component testing with viewport simulation  
- **MSW API Mocking**: Network request interception and response simulation
- **Accessibility Testing**: Automated a11y validation with axe-core
- **Visual Regression**: Screenshot comparison across breakpoints
- **Responsive Utilities**: Viewport simulation and breakpoint testing

### Coverage Standards

- **90%+ Code Coverage**: Lines, branches, functions, statements
- **Multi-Device Testing**: Mobile, tablet, desktop breakpoints
- **Accessibility Compliance**: WCAG AA standards
- **Performance Validation**: Core Web Vitals and responsive metrics

## 🚀 Quick Start

### Run All Tests

```bash
# Run Playwright E2E tests
npm run test:e2e

# Run Jest unit tests  
npm run test:unit

# Run all tests with coverage
npm run test
```

### Run Specific Test Suites

```bash
# Test responsive navigation
npx playwright test responsive.home

# Test form validation
npx playwright test responsive.forms

# Test modal behavior
npx playwright test responsive.dialogs-and-drawers

# Test specific component
npm test Header.responsive
```

## 📱 Device & Viewport Testing

### Supported Breakpoints

| Breakpoint | Width | Device Example | Use Case |
|------------|-------|----------------|----------|
| `mobile` | 375px | iPhone SE | Mobile phone portrait |
| `mobileLarge` | 414px | iPhone 11 Pro Max | Large mobile phone |
| `tablet` | 768px | iPad | Tablet portrait |
| `tabletLandscape` | 1024px | iPad Landscape | Tablet landscape |
| `desktop` | 1280px | Desktop | Standard desktop |
| `desktopLarge` | 1920px | Desktop Large | Large desktop |

### Tailwind CSS Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small desktop |
| `md` | 768px | Medium desktop |
| `lg` | 1024px | Large desktop |
| `xl` | 1280px | Extra large desktop |
| `2xl` | 1536px | 2X large desktop |

## 🧪 Testing Patterns

### Responsive Component Testing

```typescript
import { renderWithProviders, createResponsiveTestSuite } from '../test-utils';

// Test across multiple breakpoints
createResponsiveTestSuite('navigation behavior', (viewport) => {
  it('adapts to viewport size', () => {
    renderWithProviders(<Navigation />, { viewport });
    
    if (viewport.width < 768) {
      // Mobile behavior assertions
      expect(screen.getByLabelText('mobile menu')).toBeVisible();
    } else {
      // Desktop behavior assertions  
      expect(screen.getByRole('navigation')).toBeVisible();
    }
  });
});
```

### SWR Data Testing

```typescript
import { renderWithSWRData } from '../test-utils';

it('handles loading states', () => {
  renderWithSWRData(<MenuComponent />, {
    '/api/menu': mockMenuData
  });
  
  expect(screen.getByText('Fish & Chips')).toBeInTheDocument();
});
```

### Dark Mode Testing

```typescript
import { renderInDarkMode } from '../test-utils';

it('applies dark theme correctly', () => {
  renderInDarkMode(<Header />);
  
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
});
```

### Accessibility Testing

```typescript
import { AxeBuilder } from '@axe-core/playwright';

test('meets accessibility standards', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## 📂 File Structure

```
e2e/
├── responsive.home.spec.ts              # Homepage navigation & layout
├── responsive.forms.spec.ts             # Form layouts & validation
└── responsive.dialogs-and-drawers.spec.ts # Modal & drawer behavior

__tests__/
└── components/
    └── Header.responsive.test.tsx       # Example component test

test-utils/
├── index.ts                            # Main exports
├── renderWithProviders.tsx             # React testing utilities
├── setupViewport.ts                    # Viewport simulation
└── mocks/
    ├── handlers.ts                     # MSW request handlers
    ├── server.ts                       # MSW server (Node.js)
    └── browser.ts                      # MSW worker (browser)

playwright.config.ts                    # Playwright configuration
jest.config.mjs                        # Jest configuration
jest.setup.ts                          # Test environment setup
```

## 🎮 Playwright Configuration

### Device Matrix

The test suite runs across this device matrix:

- **iPhone 14 Pro** (390×844) - Mobile, light theme
- **Google Pixel 7** (412×892) - Mobile, dark theme  
- **iPad Landscape** (1024×768) - Tablet
- **Tailwind Breakpoints** (640px, 768px, 1024px, 1280px) - Responsive testing

### Test Features

- **Visual Screenshots**: Baseline comparison across devices
- **Network Mocking**: API response simulation
- **Accessibility Scanning**: Automated a11y validation
- **Performance Metrics**: Core Web Vitals measurement
- **Keyboard Navigation**: Focus management testing
- **Touch Interactions**: Mobile gesture simulation

## 🔧 API Mocking with MSW

### Available Handlers

```typescript
// Booking system
POST /api/booking          # Restaurant booking requests
POST /api/contact          # Contact form submissions  
POST /api/newsletter       # Newsletter subscriptions

// Data loading
GET /api/restaurant        # Restaurant information
GET /api/menu             # Menu data (JSON/PDF)
GET /api/data             # Environment-aware data loading

// Webhooks
POST /api/webhooks/stripe  # Payment processing
POST /api/webhooks/mailgun # Email delivery

// Error simulation
GET /api/error            # 500 server error
GET /api/notfound         # 404 not found
GET /api/unauthorized     # 401 unauthorized
```

### Custom Mock Usage

```typescript
import { server, handleBookingRequest } from '../test-utils';

test('handles booking errors', async () => {
  // Override default handler
  server.use(
    handleBookingRequest.mockImplementationOnce(() => 
      HttpResponse.json({ error: 'Fully booked' }, { status: 409 })
    )
  );
  
  // Test error handling
});
```

## 🎨 Component Testing Best Practices

### 1. Behavior-First Assertions

```typescript
// ✅ Good - Test user-visible behavior
expect(screen.getByRole('button', { name: /book table/i })).toBeVisible();

// ❌ Avoid - Testing implementation details  
expect(component.find('.btn-primary')).toHaveLength(1);
```

### 2. Responsive Design Testing

```typescript
// ✅ Good - Test adaptive behavior
if (viewport.width < 640) {
  expect(screen.getByLabelText('mobile menu')).toBeVisible();
} else {
  expect(screen.getByRole('navigation')).toBeVisible();
}
```

### 3. Accessibility Integration

```typescript
// ✅ Good - Include a11y in every test
const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
expect(accessibilityScanResults.violations).toEqual([]);
```

### 4. Performance Considerations

```typescript
// ✅ Good - Test performance implications
const metrics = await page.evaluate(() => performance.getEntriesByType('navigation'));
expect(metrics[0].loadEventEnd - metrics[0].fetchStart).toBeLessThan(3000);
```

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Run E2E tests  
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 📊 Coverage Reports

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html
```

### Coverage Thresholds

The test suite enforces 90% coverage across:

- **Lines**: 90%
- **Functions**: 90%  
- **Branches**: 90%
- **Statements**: 90%

## 🐛 Debugging Tests

### Playwright Debugging

```bash
# Run tests in headed mode
npx playwright test --headed

# Debug specific test
npx playwright test --debug responsive.home

# Run tests with trace
npx playwright test --trace on
```

### Jest Debugging

```bash
# Run tests in watch mode
npm test -- --watch

# Debug specific test file
npm test Header.responsive.test.tsx

# Run with verbose output
npm test -- --verbose
```

## 🔍 Visual Regression Testing

### Screenshot Comparison

The E2E tests automatically capture and compare screenshots:

```typescript
// Capture baseline
await expect(page).toHaveScreenshot('homepage-mobile.png');

// Visual comparison on subsequent runs
await expect(page).toHaveScreenshot('homepage-mobile.png', {
  threshold: 0.2,
  maxDiffPixels: 100
});
```

### Updating Baselines

```bash
# Update all screenshots
npx playwright test --update-snapshots

# Update specific test screenshots  
npx playwright test responsive.home --update-snapshots
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [MSW Documentation](https://mswjs.io/)
- [Axe-Core Playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

### Adding New Tests

1. Follow the established patterns in existing test files
2. Include accessibility testing in every component test
3. Test across multiple breakpoints for responsive behavior
4. Mock API calls using MSW handlers
5. Add visual regression tests for critical UI components

### Test Naming Conventions

```typescript
// Component tests
describe('ComponentName Responsive Behavior', () => {
  describe('feature area', () => {
    it('specific behavior expectation', () => {});
  });
});

// E2E tests  
test.describe('Feature Area', () => {
  test('validates specific user flow', async ({ page }) => {});
});
```

This testing infrastructure ensures comprehensive coverage of responsive behavior, accessibility compliance, and cross-device compatibility for the Old Crown restaurant website.
