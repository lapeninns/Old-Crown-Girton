# Hooks Directory

This directory contains all custom React hooks organized by category for better maintainability and discoverability.

## 📁 Directory Structure

```
hooks/
├── data/              # Data fetching hooks
│   ├── useContent.ts     # Content management system
│   ├── useMenu.ts        # Restaurant menu data
│   ├── useRestaurant.ts  # Restaurant information
│   ├── useMarketing.ts   # Marketing content & promotions
│   ├── useConfig.ts      # Application configuration
│   └── index.ts         # Barrel exports
├── monitoring/        # Performance & monitoring hooks
│   ├── usePerformance.ts          # Search optimization
│   ├── usePerformanceMonitoring.ts # Real-time monitoring
│   └── index.ts                   # Barrel exports
├── utils/            # Utility hooks
│   ├── useStableId.ts    # Stable ID generation
│   └── index.ts         # Barrel exports
├── index.ts          # Main barrel export
├── README.md         # This file
├── useData.ts        # 🚨 Legacy (to be removed)
└── useParsedData.ts  # 🚨 Legacy (to be removed)
```

## 🚀 Quick Start

```typescript
// Import from main barrel for everything
import { useContent, useMenu, usePerformanceMonitoring } from '@/hooks';

// Or import from specific categories
import { useContent, useMenu } from '@/hooks/data';
import { usePerformanceMonitoring } from '@/hooks/monitoring';
import { useStableId } from '@/hooks/utils';
```

## 📊 Hook Categories

### Data Fetching (`/data`)
Hooks for fetching and managing application data from APIs and local sources.

| Hook | Purpose | Cache | Features |
|------|---------|-------|----------|
| `useContent` | CMS content | 5 min | Page content, global content, fallbacks |
| `useMenu` | Restaurant menu | 10 min | Section finding, item search, featured items |
| `useRestaurant` | Restaurant info | 30 min | Hours, contact, real-time status |
| `useMarketing` | Marketing content | 5 min | Promotions, hero content, featured |
| `useConfig` | App configuration | 30 min | Environment, feature flags, API endpoints |

### Monitoring (`/monitoring`)
Hooks for performance monitoring and optimization.

| Hook | Purpose | Features |
|------|---------|----------|
| `usePerformanceMonitoring` | Real-time monitoring | API tracking, alerts, metrics |
| `useDebounceSearch` | Search optimization | Debouncing, loading states |

### Utilities (`/utils`)
General-purpose utility hooks.

| Hook | Purpose | Features |
|------|---------|----------|
| `useStableId` | Stable ID generation | SSR-safe, unique IDs |

## 🏗️ Hook Patterns

### Standard Interface
All data hooks follow this consistent interface:

```typescript
interface StandardHookResult<T> {
  data: T | null;                    // The fetched data
  error: Error | null;               // Any error that occurred
  isLoading: boolean;                // Initial loading state
  isValidating: boolean;             // Background revalidation
  refetch: () => Promise<void>;      // Manual refetch function
  mutate: (data?: T) => Promise<T>;  // Mutate cache
}

interface StandardHookOptions {
  enabled?: boolean;                 // Enable/disable hook
  refreshInterval?: number;          // Background refresh (ms)
  cacheTimeout?: number;             // Cache duration (ms)
}
```

### Usage Example
```typescript
const MyComponent = () => {
  const { data: content, isLoading, error, refetch } = useContent({
    enabled: true,
    refreshInterval: 300000  // 5 minutes
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!content) return <EmptyState />;

  return <ContentDisplay content={content} />;
};
```

## 🔄 Migration from Legacy Hooks

### Old → New Mapping
```typescript
// ❌ Legacy patterns
import { useData } from '@/hooks/useData';
const { data } = useData<Menu>('/api/menu');

// ✅ New patterns
import { useMenu } from '@/hooks/data';
const { data, sections, findSection } = useMenu();
```

### Breaking Changes
1. **Return properties**: `loading` → `isLoading`
2. **Hook names**: `useData` → resource-specific hooks
3. **Import paths**: Direct imports → barrel imports
4. **Additional features**: Built-in helpers and specialized variants

## 📝 Creating New Hooks

### 1. Choose the Right Category
- **Data**: Fetching external data sources
- **Monitoring**: Performance and analytics
- **Utils**: General-purpose utilities

### 2. Follow Naming Conventions
- **Data hooks**: `use{Resource}()` → `useProducts()`, `useOrders()`
- **Utility hooks**: `use{Purpose}()` → `useLocalStorage()`, `useDebounce()`
- **Monitoring hooks**: `use{Feature}Monitoring()` → `useApiMonitoring()`

### 3. Use Standard Interfaces
```typescript
// For data hooks
export interface UseProductsResult {
  data: Product[] | null;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  refetch: () => Promise<void>;
  mutate: (data?: Product[]) => Promise<Product[]>;
  // Resource-specific helpers
  findProduct: (id: string) => Product | null;
  filterByCategory: (category: string) => Product[];
}

export interface UseProductsOptions extends SWRConfiguration {
  enabled?: boolean;
  category?: string;  // Resource-specific options
}
```

### 4. Add to Barrel Exports
```typescript
// hooks/data/index.ts
export { useProducts } from './useProducts';
export type { UseProductsResult, UseProductsOptions } from './useProducts';

// hooks/index.ts  
export * from './data';
```

## 🧪 Testing Hooks

### Unit Testing
```typescript
import { renderHook } from '@testing-library/react';
import { useContent } from '@/hooks/data';

describe('useContent', () => {
  test('loads content successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useContent());
    
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    
    expect(result.current.data).toBeDefined();
    expect(result.current.error).toBeNull();
  });
  
  test('handles errors gracefully', async () => {
    // Mock API failure
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('API Error'));
    
    const { result, waitForNextUpdate } = renderHook(() => useContent());
    await waitForNextUpdate();
    
    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeNull();
  });
});
```

### Integration Testing
```typescript
import { render } from '@testing-library/react';
import { useContent } from '@/hooks/data';

// Mock the hook
jest.mock('@/hooks/data');

test('component uses hook correctly', () => {
  const mockUseContent = useContent as jest.MockedFunction<typeof useContent>;
  
  mockUseContent.mockReturnValue({
    data: mockContentData,
    isLoading: false,
    error: null,
    refetch: jest.fn()
  });

  const { getByText } = render(<MyComponent />);
  expect(getByText('Expected Content')).toBeInTheDocument();
});
```

## 🔧 Configuration

### Environment Variables
```env
# Cache configuration
NEXT_PUBLIC_CACHE_TTL=300000          # Default cache TTL (5 minutes)
NEXT_PUBLIC_REFRESH_INTERVAL=600000   # Default refresh interval (10 minutes)

# Feature flags
NEXT_PUBLIC_ENABLE_MONITORING=true    # Enable performance monitoring
NEXT_PUBLIC_ENABLE_OFFLINE=true       # Enable offline support
```

### Global Configuration
```typescript
// hooks/config.ts
export const HOOK_DEFAULTS = {
  retryCount: 3,
  retryDelay: 1000,
  cacheTimeout: 300000,  // 5 minutes
  refreshInterval: 600000 // 10 minutes
};
```

## 🚨 Legacy Hooks (Deprecated)

The following hooks are deprecated and will be removed in a future version:

- `useData.ts` → Use resource-specific hooks instead
- `useParsedData.ts` → Validation is now built into each hook

### Migration Timeline
- **v1.0**: Legacy hooks marked as deprecated
- **v1.1**: Warning messages added to legacy hooks
- **v2.0**: Legacy hooks removed entirely

## 📚 Further Reading

- [Data Fetching Architecture Guide](../docs/DATA-FETCHING-ARCHITECTURE.md)
- [Naming Conventions](../docs/NAMING-CONVENTIONS.md)
- [Testing Guidelines](../docs/TESTING.md)
- [Performance Best Practices](../docs/PERFORMANCE-OPTIMIZATION.md)

## 🤝 Contributing

1. Follow the established patterns and conventions
2. Add comprehensive TypeScript types
3. Include unit tests for new hooks
4. Update documentation and barrel exports
5. Add JSDoc comments for all public APIs

---

**Need help?** Check the [Data Fetching Architecture Guide](../docs/DATA-FETCHING-ARCHITECTURE.md) or refer to existing hook implementations for examples.