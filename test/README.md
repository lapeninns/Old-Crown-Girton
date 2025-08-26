# Test Environment Setup Guide

This project uses a **dual-environment testing setup** to properly test both server-side and client-side code with appropriate environments and mocking strategies.

## Overview

The test suite is split into two distinct environments:

- **Server Environment** (`node`) - For API routes, server-side loaders, and Node.js code
- **Client Environment** (`jsdom`) - For React components, hooks, and browser code

## Configuration Files

### Main Configuration
- `jest.config.mjs` - Main Jest configuration using `next/jest`
- `jest.projects.mjs` - Projects configuration defining server and client environments

### Setup Files
- `test/setupServerEnv.ts` - Server environment setup (Node.js globals, fetch polyfill)
- `test/setupClientEnv.ts` - Client environment setup (browser APIs, JSDOM enhancements)
- `test/setupServerTests.ts` - Server test utilities (MSW, API mocking)
- `test/setupClientTests.ts` - Client test utilities (React Testing Library, component mocks)

## Test File Naming Conventions

### Server Tests (runs in Node.js environment)
Files matching these patterns run in the **server** environment:
- `**/*.(server|api).(test|spec).[jt]s?(x)`
- `**/tests/**/api/**/*.(test|spec).[jt]s?(x)`
- `**/tests/**/server/**/*.(test|spec).[jt]s?(x)`
- `**/app/api/**/*.(test|spec).[jt]s?(x)`
- `**/src/lib/**/*.(test|spec).[jt]s?(x)`
- `**/tests/data/**/*.(test|spec).[jt]s?(x)`
- `**/tests/validation/**/*.(test|spec).[jt]s?(x)`

### Client Tests (runs in JSDOM environment)
Files matching these patterns run in the **client** environment:
- `**/*.(client|ui|component).(test|spec).[jt]s?(x)`
- `**/tests/**/components/**/*.(test|spec).[jt]s?(x)`
- `**/tests/**/ui/**/*.(test|spec).[jt]s?(x)`
- `**/components/**/*.(test|spec).[jt]s?(x)`

## When to Use Each Environment

### Use Server Environment For:
✅ **API Route Testing**
```typescript
// test/api/content.api.test.ts
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/content/route';

test('API returns content', async () => {
  const req = new NextRequest('http://test.local/api/content');
  const res = await GET(req);
  expect(res.status).toBe(200);
});
```

✅ **Server-Side Data Loaders**
```typescript
// test/loaders/content.server.test.ts
import { ContentSmartLoader } from '@/src/lib/data/loaders/ContentSmartLoader';

test('loads content from API', async () => {
  const result = await ContentSmartLoader.loadSmart('prod');
  expect(result.success).toBe(true);
});
```

✅ **Validation Schemas**
```typescript
// test/validation/schemas.server.test.ts
import { ContentSchema } from '@/lib/schemas';

test('validates content structure', () => {
  const result = ContentSchema.parse(validData);
  expect(result).toBeDefined();
});
```

✅ **Database Operations**
✅ **File System Operations**
✅ **Server-only utility functions**

### Use Client Environment For:
✅ **React Component Testing**
```typescript
// test/components/Header.component.test.tsx
import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

test('renders navigation', () => {
  render(<Header />);
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});
```

✅ **Custom Hooks**
```typescript
// test/hooks/useContent.client.test.ts
import { renderHook } from '@testing-library/react';
import { useContent } from '@/hooks/useContent';

test('fetches content data', () => {
  const { result } = renderHook(() => useContent());
  expect(result.current.data).toBeDefined();
});
```

✅ **Browser API interactions**
✅ **User interactions and events**
✅ **DOM manipulation**

## Available Scripts

```bash
# Run all tests (both server and client)
npm test

# Run in watch mode
npm run test:watch

# Run for CI (no watch, with coverage)
npm run test:ci

# Run only server tests
npm run test:server

# Run only client tests
npm run test:client

# Run only API tests
npm run test:api
```

## Network Mocking with MSW

The server environment includes **Mock Service Worker (MSW)** for intercepting HTTP requests:

```typescript
// In server tests
import { server, rest } from '@/test/setupServerTests';

// Override default handlers
server.use(
  rest.get('/api/custom', (req, res, ctx) => {
    return res(ctx.json({ custom: 'data' }));
  })
);
```

Default handlers are provided for:
- `/api/health`
- `/api/content`
- `/api/menu`
- `/api/restaurant`

## Mocked Modules

### Server Environment
- `server-only` - Empty mock to prevent client-side imports
- `next/headers` - Mock headers and cookies functions
- `next/cache` - Mock caching functions

### Client Environment
- `next/router` - Mock Next.js router
- `next/navigation` - Mock App Router navigation
- `next/image` - Mock Image component
- `next/link` - Mock Link component
- `framer-motion` - Mock motion components
- `swr` - Mock SWR data fetching

## Environment Variables

Test-specific environment variables can be set in:
- `.env.test` (automatically loaded)
- Individual test files
- Setup files

## Troubleshooting

### "Cannot find module" errors
- Check if the file matches the correct naming pattern
- Ensure path aliases (`@/`) are correctly configured
- Verify the module is available in the target environment

### React warnings in server tests
- Ensure React components are tested in client environment
- Check that server tests don't import React components

### Fetch not available
- Server environment includes fetch polyfill
- Check that `undici` is installed for Node < 18

### MSW request handling
- Check that handlers are properly configured
- Use `server.use()` to override handlers in specific tests
- Ensure requests match the exact URL patterns

## Best Practices

1. **Separate Concerns**: Keep server logic tests in server environment, UI tests in client environment
2. **Mock External Dependencies**: Use MSW for HTTP requests, jest.mock for modules
3. **Use Descriptive Names**: Follow naming conventions for automatic environment selection
4. **Test Real Behavior**: Test actual API routes and components, not just mocks
5. **Clean Up**: Reset mocks and handlers between tests

## Migration from Single Environment

If migrating existing tests:

1. **Rename test files** according to the new patterns
2. **Move API route tests** to server environment
3. **Move component tests** to client environment
4. **Update imports** to use new setup files
5. **Remove duplicate mocks** that are now handled globally

## Examples

See the `test/examples/` directory for complete examples of:
- API route testing (`api.content.api.test.ts`)
- Server-side loader testing (`contentLoader.server.test.ts`)
- Component testing patterns
- Custom hook testing patterns