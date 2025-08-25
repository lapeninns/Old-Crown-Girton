# Data Fetching Architecture Guide

## Overview

This document provides a comprehensive guide to the **newly organized and modularized** data fetching architecture for the Restaurant_BP application. The architecture has been completely restructured for better maintainability, consistency, and developer experience.

## 🎯 What Changed

### Before (Disorganized)
```
hooks/
├── useContent.ts        # Content management
├── useData.ts          # Generic data fetching  
├── useParsedData.ts    # Schema validation
├── usePerformance.ts   # Performance monitoring
├── useStableId.ts      # Utility hook

src/lib/data/hooks/
├── useMenu.ts          # Menu data (over-engineered)
├── useRestaurant.ts    # Restaurant data
├── useMarketing.ts     # Marketing data  
├── useSmartHooks.ts    # Complex factory pattern
```

### After (Organized)
```
hooks/
├── data/              # ✅ All data fetching hooks
│   ├── useContent.ts
│   ├── useMenu.ts
│   ├── useRestaurant.ts
│   ├── useMarketing.ts
│   ├── useConfig.ts
│   └── index.ts
├── monitoring/        # ✅ Performance monitoring
│   ├── usePerformance.ts
│   ├── usePerformanceMonitoring.ts
│   └── index.ts
├── utils/            # ✅ Utility hooks
│   ├── useStableId.ts
│   └── index.ts
└── index.ts          # ✅ Main barrel export
```

## 📁 Files Being Fetched

### Primary API Endpoints
| Endpoint | Purpose | Hook | Cache Duration |
|----------|---------|------|----------------|
| `/api/content` | Content Management System data | `useContent()` | 5 minutes |
| `/api/menu` | Restaurant menu with sections/items | `useMenu()` | 10 minutes |
| `/api/restaurant` | Restaurant info (contact, hours) | `useRestaurant()` | 30 minutes |
| `/api/marketing` | Marketing content & promotions | `useMarketing()` | 5 minutes |
| `/api/config` | Application configuration | `useConfig()` | 30 minutes |
| `/api/health` | System health monitoring | System only | 30 seconds |
| `/api/performance/metrics` | Performance metrics | Admin only | 30 seconds |

### JSON Content Files
| File | Size | Purpose | Environment |
|------|------|---------|-------------|
| `/config/content.json` | 18.8KB | Main content file | All |
| `/config/marketing.json` | 0.5KB | Marketing fallback | All |
| `/config/restaurant.json` | 0.3KB | Restaurant fallback | All |
| `/config/config.json` | 0.4KB | App config fallback | All |
| `/data/dev/content.json` | 4.0KB | Dev environment content | Development |
| `/data/staging/content.json` | - | Staging content | Staging |
| `/data/prod/content.json` | - | Production content | Production |

## 🏗️ New Hook Architecture

### Data Fetching Hooks (`hooks/data/`)

#### `useContent(options?): UseContentResult`
**Purpose**: Fetch and manage CMS content  
**Cache**: 5 minutes  
**Features**: Page content, global content, component content, fallback support

```typescript
import { useContent } from '@/hooks/data';

const { data: content, isLoading, error, refetch } = useContent({
  enabled: true,
  refreshInterval: 300000
});

// Specialized variants
const { pageData } = usePageContent('home');
const { globalData } = useGlobalContent();
const { componentData } = useComponentContent('faq');
```

#### `useMenu(options?): UseMenuResult`
**Purpose**: Fetch restaurant menu data  
**Cache**: 10 minutes  
**Features**: Section finding, item search, featured items

```typescript
import { useMenu } from '@/hooks/data';

const { data: menu, sections, findSection, findItem } = useMenu({
  refreshInterval: 600000
});

// Find specific content
const startersSection = findSection('starters');
const menuItem = findItem('chicken-tikka');

// Specialized variants
const { sectionData } = useMenuSection('desserts');
const { featuredItems } = useFeaturedMenuItems();
```

#### `useRestaurant(options?): UseRestaurantResult`
**Purpose**: Fetch restaurant information  
**Cache**: 30 minutes  
**Features**: Opening hours, contact info, real-time status

```typescript
import { useRestaurant } from '@/hooks/data';

const { data: restaurant, isOpen, currentHours, nextOpenTime } = useRestaurant();

// Specialized variants
const { contactInfo } = useRestaurantContact();
const { hoursInfo } = useRestaurantHours();
```

#### `useMarketing(options?): UseMarketingResult`
**Purpose**: Fetch marketing content & promotions  
**Cache**: 5 minutes  
**Features**: Active promotions, hero content, featured content

```typescript
import { useMarketing } from '@/hooks/data';

const { data: marketing, activePromotions, heroContent } = useMarketing();

// Specialized variants  
const { promotions } = usePromotions();
const { hero } = useHeroContent();
const { featured } = useFeaturedContent();
```

#### `useConfig(options?): UseConfigResult`
**Purpose**: Fetch application configuration  
**Cache**: 30 minutes  
**Features**: Environment detection, feature flags, API endpoints

```typescript
import { useConfig } from '@/hooks/data';

const { environment, isCmsEnabled, featureFlags } = useConfig();

// Specialized variants
const { flags } = useFeatureFlags();
const { isEnabled } = useFeatureFlag('newFeature');
const { env, isDev, isProd } = useEnvironment();
```

### Monitoring Hooks (`hooks/monitoring/`)

#### `usePerformanceMonitoring(options?)`
**Purpose**: Real-time performance monitoring  
**Features**: API response tracking, system metrics, alerting

#### `useDebounceSearch(initialValue, delay)`
**Purpose**: Optimized search with debouncing  
**Features**: Search term management, loading states

### Utility Hooks (`hooks/utils/`)

#### `useStableId()`
**Purpose**: Generate stable component IDs  
**Features**: SSR-safe ID generation

## 🚀 Import Patterns

### Recommended Imports
```typescript
// ✅ Use barrel imports for clean organization
import { useContent, useMenu, useRestaurant } from '@/hooks/data';
import { usePerformanceMonitoring } from '@/hooks/monitoring';
import { useStableId } from '@/hooks/utils';

// ✅ Or import everything from main barrel
import { useContent, useMenu, usePerformanceMonitoring } from '@/hooks';
```

### Avoid These Patterns
```typescript
// ❌ Don't use direct file imports
import { useContent } from '@/hooks/data/useContent';
import { useMenu } from '@/hooks/data/useMenu';

// ❌ Don't use old import paths
import { useData } from '@/hooks/useData';  // Deprecated
import { useSmartHooks } from '@/src/lib/data/hooks/useSmartHooks';  // Removed
```

## 📝 Naming Conventions

### Hook Names
- **Pattern**: `use{Resource}()`
- **Examples**: `useContent()`, `useMenu()`, `useRestaurant()`
- **Specialized**: `use{Resource}{Variant}()` → `useMenuSection()`, `useRestaurantHours()`

### Return Types
- **Pattern**: `Use{Resource}Result`
- **Examples**: `UseContentResult`, `UseMenuResult`, `UseRestaurantResult`

### Options Types
- **Pattern**: `Use{Resource}Options`
- **Examples**: `UseContentOptions`, `UseMenuOptions`, `UseRestaurantOptions`

### Function Names
- **Fetchers**: `fetch{Resource}` → `fetchContent()`, `fetchMenu()`
- **Server Loaders**: `get{Resource}Data` → `getContentData()`, `getMenuData()`
- **Smart Loaders**: `get{Resource}Smart` → `getContentSmart()`, `getMenuSmart()`

## 🎛️ Configuration Options

All hooks support consistent configuration options:

```typescript
interface StandardHookOptions {
  enabled?: boolean;           // Enable/disable hook
  refreshInterval?: number;    // Background refresh interval
  cacheTimeout?: number;       // Cache duration
  revalidateOnFocus?: boolean; // Revalidate when window focuses
  revalidateOnReconnect?: boolean; // Revalidate on network reconnect
  errorRetryCount?: number;    // Number of retry attempts
  errorRetryInterval?: number; // Delay between retries
}
```

### Default Values
| Option | Content | Menu | Restaurant | Marketing | Config |
|--------|---------|------|------------|-----------|--------|
| `refreshInterval` | 5 min | 10 min | 30 min | 5 min | 30 min |
| `cacheTimeout` | 10 min | 30 min | 1 hour | 10 min | 1 hour |
| `errorRetryCount` | 3 | 3 | 3 | 3 | 3 |
| `revalidateOnFocus` | true | true | true | true | false |

## 🔄 Migration Guide

### Step 1: Update Imports
```typescript
// Before
import { useData } from '@/hooks/useData';
import { useContent } from '@/hooks/useContent';

// After  
import { useContent } from '@/hooks/data';
// or
import { useContent } from '@/hooks';
```

### Step 2: Update Hook Usage
```typescript
// Before (useData)
const { data, loading, error } = useData<Menu>('/api/menu');

// After (useMenu)
const { data, isLoading, error } = useMenu();
```

### Step 3: Use New Features
```typescript
// Before (manual section finding)
const startersSection = data?.sections?.find(s => s.name === 'Starters');

// After (built-in helpers)
const { findSection } = useMenu();
const startersSection = findSection('starters');
```

## ✅ Hardcoded Content Status

### ✅ **Fully Migrated**
- Global UI labels, buttons, messages, placeholders
- Page content (home, about, contact, events, menu)
- Component content (FAQ, testimonials, navigation)
- Form validation messages and labels
- API error messages
- Accessibility content (ARIA labels, alt texts)

### 🔄 **Content Sources**
1. **Primary**: `/api/content` endpoint (CMS)
2. **Fallback**: Local JSON files in `/config/`
3. **Environment**: Environment-specific files in `/data/{env}/`
4. **Emergency**: Component-level fallback strings

### 📊 **Content Statistics**
- **Total Content Strings**: 200+
- **Hardcoded Strings Remaining**: <5 (legacy components only)
- **CMS Coverage**: 98%
- **Fallback Coverage**: 100%

## 🛡️ Error Handling

### Consistent Error Patterns
```typescript
// All hooks provide consistent error handling
const { data, error, isLoading, refetch } = useContent();

if (error) {
  // Error object with descriptive message
  console.error('Content fetch failed:', error.message);
}

if (isLoading) {
  // Show loading state
  return <LoadingSpinner />;
}

// Use data safely
return <Component content={data} />;
```

### Error Message Standards
- **Format**: `{Resource} {action} {reason}`
- **Examples**: 
  - `"Content fetch failed: Network error"`
  - `"Menu validation failed: Invalid schema"`
  - `"Restaurant data unavailable: API timeout"`

## 🧪 Testing

### Hook Testing
```typescript
import { renderHook } from '@testing-library/react';
import { useContent } from '@/hooks/data';

test('useContent loads content successfully', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useContent());
  
  expect(result.current.isLoading).toBe(true);
  
  await waitForNextUpdate();
  
  expect(result.current.data).toBeDefined();
  expect(result.current.error).toBeNull();
});
```

### Component Testing with Hooks
```typescript
import { render } from '@testing-library/react';
import { useContent } from '@/hooks/data';

// Mock the hook
jest.mock('@/hooks/data', () => ({
  useContent: jest.fn()
}));

test('component displays content from hook', () => {
  const mockUseContent = useContent as jest.MockedFunction<typeof useContent>;
  
  mockUseContent.mockReturnValue({
    data: { global: { site: { name: 'Test Restaurant' } } },
    isLoading: false,
    error: null,
    refetch: jest.fn()
  });

  const { getByText } = render(<YourComponent />);
  expect(getByText('Test Restaurant')).toBeInTheDocument();
});
```

## 📚 Best Practices

### 1. Always Handle Loading States
```typescript
const { data, isLoading, error } = useContent();

if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <ContentDisplay content={data} />;
```

### 2. Use Specialized Hooks When Available
```typescript
// ✅ Good - Use specialized hook
const { contactInfo } = useRestaurantContact();

// ❌ Avoid - Manual data extraction
const { data } = useRestaurant();
const contactInfo = {
  phone: data?.phone,
  email: data?.email,
  address: data?.address
};
```

### 3. Leverage Content Fallbacks
```typescript
// ✅ Always provide fallbacks
const title = content?.pages?.home?.hero?.title || 'Welcome';
const subtitle = content?.pages?.home?.hero?.subtitle || 'Our Restaurant';

// ✅ Use helper hooks for complex fallbacks
const { contentValue } = useContentWithFallback('pages.home.hero.title', 'Welcome');
```

### 4. Configure Hooks Appropriately
```typescript
// ✅ Configure based on data change frequency
const { data: menu } = useMenu({
  refreshInterval: 600000  // Menu changes rarely
});

const { data: marketing } = useMarketing({
  refreshInterval: 300000  // Promotions change frequently
});
```

## 🔮 Future Enhancements

### Planned Features
1. **Offline Support**: Enhanced caching for offline-first experience
2. **Real-time Updates**: WebSocket integration for live content updates
3. **A/B Testing**: Built-in support for content experiments
4. **Analytics**: Hook-level usage analytics and performance metrics
5. **TypeScript Improvements**: Even stronger type safety and autocomplete

### Extension Points
- Custom hook options for specific use cases
- Plugin system for additional data transformations
- Advanced caching strategies (Redis, IndexedDB)
- Content versioning and rollback capabilities

## 📞 Support

### Getting Help
- **Documentation**: Check this guide and `/docs/NAMING-CONVENTIONS.md`
- **Code Examples**: See components in `/components/restaurant/`
- **Testing**: Refer to test files in `/__tests__/`

### Common Issues
1. **Import Errors**: Use barrel imports from `@/hooks/data`
2. **Type Issues**: Ensure proper TypeScript configuration
3. **Cache Issues**: Use `refetch()` method to force refresh
4. **Performance**: Check refresh intervals and cache timeouts

---

This new architecture provides a **solid foundation** for scalable, maintainable data fetching while ensuring **excellent developer experience** and **consistent patterns** throughout the application.