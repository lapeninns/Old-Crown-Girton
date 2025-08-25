# Modular Content System - Usage Guide

## Overview

The modular content system provides a sophisticated, performance-optimized approach to managing content in your React application. It supports:

- **Modular Architecture**: Content split into focused, reusable modules
- **Lazy Loading**: Load content on-demand to improve performance
- **Environment Overrides**: Customize content per deployment environment
- **Advanced Composition**: Intelligent merging with conflict resolution
- **Caching & Performance**: Optimized loading with multiple cache strategies
- **Validation**: Schema-based validation for content integrity

## Quick Start

### 1. Basic Usage with Hooks

```tsx
import { useModularContent, usePageContent } from '@/hooks/data';

function HomePage() {
  // Load specific modules
  const { data: content, isLoading, error } = useModularContent({
    modules: ['core/global', 'core/ui', 'pages/home'],
    environment: 'prod',
  });

  // Or use specialized hook for page content
  const { pageData, isLoading: pageLoading } = usePageContent('home');

  if (isLoading || pageLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{content?.hero?.title || pageData?.hero?.title}</h1>
      <p>{content?.hero?.subtitle || pageData?.hero?.subtitle}</p>
    </div>
  );
}
```

### 2. Using the Content Loader Service

```tsx
import { getContentLoader, initializeContentLoader } from '@/src/lib/content';

// Initialize once in your app
await initializeContentLoader();

// Use throughout your app
const loader = getContentLoader();

// Load page content
const result = await loader.loadPageContent('home');
console.log('Content:', result.content);
console.log('Performance:', result.performance);

// Load component content
const componentResult = await loader.loadComponentContent('testimonials');
```

### 3. Environment-Specific Content

```tsx
import { applyEnvironmentOverrides, isFeatureEnabled } from '@/src/lib/content';

// Apply environment overrides
const content = await applyEnvironmentOverrides(baseContent, 'dev');

// Check feature flags
if (isFeatureEnabled('enableDebugMode')) {
  console.log('Debug mode enabled');
}
```

## Content Structure

### Module Organization

```
config/content/
├── manifest.json          # Module configuration and rules
├── core/                  # Always-loaded core content
│   ├── global.json       # Site info, navigation, branding
│   ├── ui.json          # Buttons, labels, messages
│   ├── accessibility.json # ARIA labels, alt texts
│   └── forms.json       # Form validation, labels
├── pages/                # Page-specific content
│   ├── home.json
│   ├── about.json
│   ├── contact.json
│   └── menu.json
├── components/           # Component-specific content
│   ├── testimonials.json
│   ├── faq.json
│   └── menuHighlights.json
├── api/                  # API-related content
│   ├── messages.json
│   └── errors.json
├── legal/               # Legal content
│   ├── terms.json
│   └── privacy.json
└── environments/        # Environment overrides
    ├── dev/
    ├── staging/
    └── prod/
```

### Manifest Configuration

```json
{
  "version": "1.0.0",
  "modules": {
    "core/global": {
      "priority": 1,
      "loadStrategy": "always",
      "cacheDuration": 1800000,
      "files": ["core/global.json"],
      "dependencies": [],
      "size": "small"
    },
    "pages/home": {
      "priority": 2,
      "loadStrategy": "lazy", 
      "cacheDuration": 600000,
      "files": ["pages/home.json"],
      "dependencies": ["core/global"],
      "size": "medium"
    }
  },
  "composition": {
    "strategy": "deep-merge",
    "conflictResolution": "environment-wins",
    "fallbackStrategy": "base-module",
    "mergeArrays": "concat",
    "preserveRootKeys": true
  }
}
```

## Loading Strategies

### Always Load (Core Content)
```json
{
  "loadStrategy": "always",
  "priority": 1,
  "cacheDuration": 1800000
}
```
- Loaded immediately on app start
- High cache duration for stable content
- Examples: global navigation, UI elements

### Lazy Load (Page Content)
```json
{
  "loadStrategy": "lazy",
  "priority": 2,
  "cacheDuration": 600000
}
```
- Loaded on-demand when needed
- Moderate cache duration
- Examples: page-specific content

### Conditional Load (Feature Content)
```json
{
  "loadStrategy": "conditional",
  "condition": "hasFormsOnPage",
  "priority": 3,
  "cacheDuration": 900000
}
```
- Loaded only when conditions are met
- Examples: form validation content, admin features

## Environment Overrides

### Development Environment
```typescript
// environments/dev/debug.json
{
  "debug": {
    "enablePerformanceMetrics": true,
    "showLoadTimes": true
  },
  "ui": {
    "messages": {
      "cacheHit": "[DEV] Content loaded from cache"
    }
  }
}
```

### Production Environment
```typescript
// environments/prod/overrides/performance.json
{
  "global": {
    "site": {
      "description": "Optimized production description with SEO keywords"
    }
  },
  "performance": {
    "enableCompression": true,
    "cacheDuration": 7200000
  }
}
```

### Environment Variables
```typescript
// Access environment variables in content
{
  "api": {
    "baseUrl": "{{API_BASE_URL}}",
    "timeout": "{{API_TIMEOUT}}"
  }
}
```

## Composition Strategies

### Deep Merge (Default)
```typescript
const baseContent = { site: { name: "Restaurant", version: "1.0" } };
const override = { site: { name: "New Restaurant" } };
// Result: { site: { name: "New Restaurant", version: "1.0" } }
```

### Conflict Resolution
```typescript
// Environment wins (default)
conflictResolution: "environment-wins"

// Module priority wins
conflictResolution: "priority-wins"

// Timestamp wins (newer content)
conflictResolution: "timestamp-wins"
```

### Array Merging
```typescript
// Concatenate arrays (default)
mergeArrays: "concat"  // [1,2] + [3,4] = [1,2,3,4]

// Replace arrays
mergeArrays: "replace"  // [1,2] + [3,4] = [3,4]

// Deduplicate arrays
mergeArrays: "dedupe"   // [1,2] + [2,3] = [1,2,3]
```

## Performance Optimization

### Preloading
```typescript
// Preload critical modules
const { preloadModules } = useModularContent({
  preload: ['core/global', 'core/ui'],
  enablePerformanceTracking: true
});

await preloadModules(['pages/home', 'components/hero']);
```

### Caching Strategies
```typescript
// Aggressive caching (production)
cacheStrategy: "aggressive"  // Long TTL, CDN enabled

// Moderate caching (staging) 
cacheStrategy: "moderate"    // Medium TTL, some CDN

// Minimal caching (development)
cacheStrategy: "minimal"     // Short TTL, no CDN
```

### Bundle Optimization
```json
{
  "performance": {
    "bundleModules": ["core/global", "core/ui"],
    "criticalModules": ["core/ui", "core/accessibility"],
    "maxConcurrentLoads": 3
  }
}
```

## Advanced Usage

### Custom Composition
```typescript
import { composeContent, CompositionConfig } from '@/src/lib/content';

const customConfig: CompositionConfig = {
  strategy: 'selective-merge',
  conflictResolution: 'priority-wins',
  mergeArrays: 'dedupe',
  debugMode: true
};

const result = composeContent(modules, customConfig);
```

### Content Validation
```typescript
import { validateGlobalContent, validatePageContent } from '@/src/lib/content';

// Validate content structure
const globalResult = validateGlobalContent(content);
if (!globalResult.success) {
  console.error('Validation errors:', globalResult.error.errors);
}

// Validate page content
const pageResult = validatePageContent(pageContent);
```

### Performance Monitoring
```typescript
const { performance } = useModularContent({
  enablePerformanceTracking: true
});

console.log('Load times:', performance.loadTimes);
console.log('Cache hit rate:', performance.cacheHits / (performance.cacheHits + performance.cacheMisses));
```

## Best Practices

### 1. Module Design
- **Keep modules focused**: Each module should have a single responsibility
- **Minimize dependencies**: Reduce coupling between modules
- **Size appropriately**: Mark large modules as 'large' for proper loading

### 2. Content Organization
- **Use semantic names**: Clear, descriptive module and file names
- **Group related content**: Keep similar content types together
- **Consistent structure**: Maintain consistent schemas across modules

### 3. Performance
- **Cache strategically**: Set appropriate cache durations based on content volatility
- **Preload critical content**: Load essential content early
- **Monitor metrics**: Track loading times and cache hit rates

### 4. Environment Management
- **Minimal overrides**: Only override what's necessary per environment
- **Clear inheritance**: Use environment inheritance to reduce duplication
- **Validate overrides**: Ensure environment-specific content is valid

### 5. Error Handling
- **Graceful degradation**: Provide fallbacks for missing content
- **Validate inputs**: Use schema validation for content integrity
- **Monitor errors**: Track and alert on content loading failures

## Migration from Legacy System

### 1. Enable Modular System
```typescript
// Set environment variable
NEXT_PUBLIC_USE_MODULAR_CONTENT=true

// The existing useContent hook will automatically use modular system
const { data } = useContent(); // Now uses modular content!
```

### 2. Gradual Migration
```typescript
// Start with specific modules
const { data } = useModularContent({
  modules: ['core/global', 'pages/home'],
  fallback: legacyContent // Fallback to legacy content
});
```

### 3. Testing
```typescript
// Test both systems in parallel
const modularResult = useModularContent({ modules: ['pages/home'] });
const legacyResult = useContent();

// Compare results
if (process.env.NODE_ENV === 'development') {
  console.log('Modular:', modularResult.data);
  console.log('Legacy:', legacyResult.data);
}
```

## Troubleshooting

### Common Issues

1. **Module not loading**
   - Check manifest configuration
   - Verify file paths exist
   - Check dependencies are loaded first

2. **Content not updating**
   - Clear cache: `loader.clearCache()`
   - Check cache duration settings
   - Verify environment overrides

3. **Performance issues**
   - Reduce concurrent loads
   - Optimize module sizes
   - Enable compression

4. **Validation errors**
   - Check content structure matches schema
   - Verify required fields are present
   - Use formatValidationErrors for details

### Debug Mode
```typescript
// Enable debug mode for detailed logging
const { data } = useModularContent({
  environment: 'dev',
  debugMode: true
});

// Check composition metadata
console.log('Composition conflicts:', result.composition.metadata.conflicts);
console.log('Load sources:', result.composition.metadata.sources);
```

## API Reference

### Hooks
- `useModularContent(options)` - Main modular content hook
- `usePageContent(pageName, options)` - Page-specific content
- `useComponentContent(componentName, options)` - Component content
- `useGlobalContent(options)` - Global content only

### Services
- `ContentLoader` - Content loading and caching service
- `EnvironmentManager` - Environment configuration management
- `getContentLoader()` - Get global loader instance
- `getEnvironmentManager()` - Get global environment manager

### Utilities
- `composeContent()` - Compose multiple content modules
- `applyEnvironmentOverrides()` - Apply environment-specific overrides
- `validateContent()` - Validate content against schemas

For more detailed API documentation, see the TypeScript definitions in the source files.