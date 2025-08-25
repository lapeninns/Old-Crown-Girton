# Data Fetching Naming Conventions

## Overview
This document establishes consistent naming conventions for the Restaurant_BP data fetching architecture to improve maintainability and developer experience.

## File Naming Standards

### Hook Files
```
hooks/data/
├── useContent.ts      # Content management
├── useMenu.ts         # Menu data
├── useRestaurant.ts   # Restaurant information
├── useMarketing.ts    # Marketing content
├── useConfig.ts       # Application configuration
└── index.ts          # Barrel exports
```

### API Endpoints
```
/api/content          # Content management API
/api/menu            # Menu data API
/api/restaurant      # Restaurant info API
/api/marketing       # Marketing content API
/api/config          # Configuration API
/api/health          # Health monitoring
/api/performance/*   # Performance metrics
```

### Schema Files
```
src/lib/data/schemas/
├── contentSchema.ts
├── menuSchema.ts
├── restaurantSchema.ts
├── marketingSchema.ts
├── configSchema.ts
└── index.ts
```

## Hook Naming Patterns

### Standard Hook Structure
```typescript
// Pattern: use{Resource}()
export function useContent(): UseContentResult
export function useMenu(): UseMenuResult
export function useRestaurant(): UseRestaurantResult
export function useMarketing(): UseMarketingResult
export function useConfig(): UseConfigResult
```

### Return Type Naming
```typescript
// Pattern: Use{Resource}Result
interface UseContentResult {
  data: Content | null;
  error: Error | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}
```

### Hook Options Naming
```typescript
// Pattern: Use{Resource}Options
interface UseContentOptions {
  enabled?: boolean;
  refreshInterval?: number;
  cacheTimeout?: number;
}
```

## Function Naming Standards

### Data Fetchers
```typescript
// Pattern: fetch{Resource}
fetchContent()
fetchMenu()
fetchRestaurant()
fetchMarketing()
fetchConfig()
```

### Server-Side Loaders
```typescript
// Pattern: get{Resource}Data
getContentData()
getMenuData()
getRestaurantData()
getMarketingData()
getConfigData()
```

### Smart Loaders
```typescript
// Pattern: get{Resource}Smart
getContentSmart()
getMenuSmart()
getRestaurantSmart()
getMarketingSmart()
getConfigSmart()
```

## Variable Naming Standards

### Component Props
```typescript
// Use descriptive, resource-specific names
interface MenuProps {
  menuData: Menu;           // NOT: data
  isMenuLoading: boolean;   // NOT: loading
  menuError: Error | null;  // NOT: error
}
```

### State Variables
```typescript
// Be specific about what data you're managing
const [menuData, setMenuData] = useState<Menu | null>(null);
const [contentData, setContentData] = useState<Content | null>(null);
const [restaurantInfo, setRestaurantInfo] = useState<Restaurant | null>(null);
```

## TypeScript Interface Standards

### Data Types
```typescript
// Pattern: {Resource} (singular, PascalCase)
interface Content { }
interface Menu { }
interface Restaurant { }
interface Marketing { }
interface Config { }
```

### API Response Types
```typescript
// Pattern: {Resource}ApiResponse
interface ContentApiResponse {
  status: 'success' | 'error';
  data?: Content;
  error?: string;
  meta: ResponseMeta;
}
```

### Configuration Types
```typescript
// Pattern: {Resource}Config
interface ContentConfig {
  enabled: boolean;
  endpoint?: string;
  cacheTimeout: number;
}
```

## Directory Structure Standards

### Current State (To Be Reorganized)
```
hooks/
├── useContent.ts        # ✅ Keep
├── useData.ts          # ❌ Remove (generic)
├── useParsedData.ts    # ❌ Remove (merge functionality)
├── usePerformance.ts   # ✅ Move to hooks/monitoring/
└── useStableId.ts      # ✅ Move to hooks/utils/

src/lib/data/hooks/
├── useMenu.ts          # ❌ Move to hooks/data/
├── useRestaurant.ts    # ❌ Move to hooks/data/
├── useMarketing.ts     # ❌ Move to hooks/data/
└── useSmartHooks.ts    # ❌ Remove (over-engineered)
```

### Proposed Structure
```
hooks/
├── data/
│   ├── useContent.ts
│   ├── useMenu.ts
│   ├── useRestaurant.ts
│   ├── useMarketing.ts
│   ├── useConfig.ts
│   └── index.ts
├── monitoring/
│   ├── usePerformance.ts
│   ├── usePerformanceMonitoring.ts
│   └── index.ts
├── utils/
│   ├── useStableId.ts
│   └── index.ts
└── index.ts
```

## Import/Export Standards

### Barrel Exports
```typescript
// hooks/data/index.ts
export { useContent } from './useContent';
export { useMenu } from './useMenu';
export { useRestaurant } from './useRestaurant';
export { useMarketing } from './useMarketing';
export { useConfig } from './useConfig';

// Top-level hooks/index.ts
export * from './data';
export * from './monitoring';
export * from './utils';
```

### Component Imports
```typescript
// Preferred: Named imports from barrel
import { useContent, useMenu } from '@/hooks/data';

// Avoid: Direct file imports
import { useContent } from '@/hooks/data/useContent';
```

## Error Handling Standards

### Error Message Format
```typescript
// Pattern: {Resource} {action} {reason}
"Content fetch failed: Network error"
"Menu validation failed: Invalid schema"
"Restaurant data unavailable: API timeout"
```

### Error Types
```typescript
enum DataFetchError {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR', 
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR'
}
```

## Documentation Standards

### Hook Documentation
```typescript
/**
 * Hook for fetching and managing content data from the CMS
 * 
 * @param options - Configuration options for the hook
 * @returns Content data, loading state, error state, and refetch function
 * 
 * @example
 * ```tsx
 * const { data: content, isLoading, error, refetch } = useContent({
 *   enabled: true,
 *   refreshInterval: 5000
 * });
 * ```
 */
export function useContent(options?: UseContentOptions): UseContentResult
```

### API Documentation
```typescript
/**
 * GET /api/content
 * 
 * Fetches content management data with fallback to filesystem
 * 
 * @returns {ContentApiResponse} Standardized API response with content data
 * @throws {400} Invalid request parameters
 * @throws {404} Content not found
 * @throws {500} Server error or filesystem access failure
 */
```

## Migration Checklist

### Phase 1: File Reorganization
- [ ] Create new directory structure
- [ ] Move hooks to appropriate directories
- [ ] Update barrel exports
- [ ] Update all import statements

### Phase 2: Hook Standardization  
- [ ] Standardize hook return types
- [ ] Implement consistent error handling
- [ ] Add proper TypeScript interfaces
- [ ] Update hook documentation

### Phase 3: API Standardization
- [ ] Ensure consistent API response formats
- [ ] Standardize error responses
- [ ] Update API documentation
- [ ] Verify endpoint naming consistency

### Phase 4: Cleanup
- [ ] Remove deprecated hooks
- [ ] Remove unused files
- [ ] Update component imports
- [ ] Run tests and verify functionality

## Best Practices

1. **Be Explicit**: Use descriptive names that clearly indicate purpose
2. **Be Consistent**: Follow established patterns throughout the codebase
3. **Be Predictable**: Developers should know where to find files based on naming
4. **Be Discoverable**: Use barrel exports to make imports simple
5. **Be Documented**: Include clear JSDoc comments for all public APIs

## Enforcement

### ESLint Rules
Consider adding custom ESLint rules to enforce naming conventions:

```json
{
  "rules": {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^Use.+Result$",
          "match": true
        }
      }
    ]
  }
}
```

### Pre-commit Hooks
Set up pre-commit hooks to validate:
- File naming conventions
- Import statement patterns
- Documentation completeness