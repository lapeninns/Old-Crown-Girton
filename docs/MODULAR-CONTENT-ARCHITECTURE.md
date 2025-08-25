# Modular Content Architecture Design

## Overview

This document outlines the design for modularizing the Restaurant_BP content management system to improve maintainability, performance, and reusability while maintaining compatibility with existing code.

## Current State Analysis

### Problems with Monolithic content.json (553 lines, 18.8KB)
1. **Performance**: Entire content file loaded even for small UI changes
2. **Maintainability**: Large file difficult to edit and review
3. **Collaboration**: Multiple developers editing same file causes conflicts
4. **Cache Efficiency**: Cache invalidation affects all content
5. **Environment Management**: Different environments use same content structure
6. **Component Coupling**: All components depend on single large schema

### Usage Patterns Identified
- **Global UI Elements**: Used in 15+ components
- **Page-Specific Content**: 8 main pages with unique content
- **Component Content**: 3 reusable components with dedicated content
- **Form Content**: Validation and labels used across 5+ forms
- **Accessibility Content**: ARIA labels and alt texts used throughout

## Modular Architecture Design

### Core Principles
1. **Separation of Concerns**: Different content types in separate modules
2. **Lazy Loading**: Load only needed content modules
3. **Composition**: Combine modules as needed
4. **Inheritance**: Environment-specific overrides
5. **Backward Compatibility**: Existing code continues to work
6. **Performance**: Improved caching and loading efficiency

### Module Structure

```
config/content/
├── core/                    # Core content modules
│   ├── global.json         # Global site data, navigation, branding
│   ├── ui.json             # UI elements (buttons, labels, messages)
│   ├── accessibility.json  # ARIA labels, alt texts, descriptions
│   └── forms.json          # Form labels, validation, messages
├── pages/                  # Page-specific content
│   ├── home.json          # Home page content
│   ├── about.json         # About page content
│   ├── contact.json       # Contact page content
│   ├── events.json        # Events page content
│   ├── menu.json          # Menu page content
│   ├── signin.json        # Sign-in page content
│   ├── dashboard.json     # Dashboard page content
│   ├── offline.json       # Offline page content
│   └── notFound.json      # 404 page content
├── components/            # Component-specific content
│   ├── testimonials.json  # Testimonials component
│   ├── faq.json          # FAQ component
│   └── menuHighlights.json # Menu highlights component
├── api/                   # API-related content
│   ├── messages.json      # API response messages
│   └── errors.json        # Error messages and codes
├── legal/                 # Legal content
│   ├── terms.json         # Terms of service
│   └── privacy.json       # Privacy policy
└── manifest.json          # Module manifest and composition rules
```

### Environment Support

```
config/content/
├── environments/
│   ├── dev/
│   │   ├── overrides/     # Development-specific overrides
│   │   └── config.json    # Environment configuration
│   ├── staging/
│   │   ├── overrides/     # Staging-specific overrides
│   │   └── config.json    # Environment configuration
│   └── prod/
│       ├── overrides/     # Production-specific overrides
│       └── config.json    # Environment configuration
```

## Module Composition Strategy

### 1. Manifest-Driven Loading

**config/content/manifest.json**
```json
{
  "version": "1.0",
  "modules": {
    "core": {
      "priority": 1,
      "always": true,
      "files": ["global.json", "ui.json", "accessibility.json"]
    },
    "pages": {
      "priority": 2,
      "lazy": true,
      "files": ["*.json"]
    },
    "components": {
      "priority": 3,
      "lazy": true,
      "files": ["*.json"]
    },
    "forms": {
      "priority": 2,
      "conditional": "hasFormsOnPage",
      "files": ["forms.json"]
    }
  },
  "composition": {
    "strategy": "merge-deep",
    "conflicts": "environment-wins",
    "fallback": "base-module"
  }
}
```

### 2. Smart Loading Strategies

#### Always Load (Core)
- Global site data
- UI elements (buttons, labels)
- Accessibility content

#### Lazy Load (On-Demand)
- Page-specific content
- Component content
- Form content (when forms present)

#### Conditional Load
- API messages (admin pages only)
- Legal content (legal pages only)

### 3. Content Composition

```typescript
interface ContentModule {
  id: string;
  priority: number;
  loadStrategy: 'always' | 'lazy' | 'conditional';
  dependencies?: string[];
  content: Record<string, any>;
}

interface ComposedContent {
  modules: ContentModule[];
  merged: Content; // Final merged content
  metadata: {
    loadedModules: string[];
    loadTime: number;
    cacheKeys: string[];
  };
}
```

## Performance Optimizations

### 1. Module-Level Caching
```typescript
// Different cache durations per module type
const CACHE_DURATIONS = {
  core: 30 * 60 * 1000,      // 30 minutes (rarely changes)
  pages: 10 * 60 * 1000,     // 10 minutes (moderate changes)
  components: 5 * 60 * 1000,  // 5 minutes (frequent changes)
  forms: 15 * 60 * 1000,     // 15 minutes (occasional changes)
};
```

### 2. Bundle Optimization
```typescript
// Critical content bundled with app
const CRITICAL_MODULES = ['core/ui.json', 'core/accessibility.json'];

// Non-critical content lazy-loaded
const LAZY_MODULES = ['pages/*', 'components/*'];
```

### 3. CDN Strategy
```typescript
// Module-specific CDN endpoints
const CDN_ENDPOINTS = {
  core: 'https://cdn.example.com/content/core/',
  pages: 'https://cdn.example.com/content/pages/',
  components: 'https://cdn.example.com/content/components/',
};
```

## Hook Architecture Updates

### 1. Module-Specific Hooks

```typescript
// Core content (always loaded)
export function useCoreContent(): UseCoreContentResult
export function useUIContent(): UseUIContentResult
export function useAccessibilityContent(): UseAccessibilityContentResult

// Page content (lazy loaded)
export function usePageContent(page: string): UsePageContentResult
export function usePageContentLazy(page: string): UsePageContentResult

// Component content (lazy loaded)
export function useComponentContent(component: string): UseComponentContentResult

// Composed content (backward compatibility)
export function useContent(): UseContentResult // Maintains existing API
```

### 2. Smart Loading Hook

```typescript
export function useSmartContent(options: SmartContentOptions): UseSmartContentResult {
  const {
    includeModules = ['core'],  // Always include core
    excludeModules = [],
    lazy = true,                // Enable lazy loading
    preload = [],              // Preload specific modules
    environment = 'auto'        // Auto-detect or specify environment
  } = options;
  
  // Smart composition logic
}
```

### 3. Composition Hook

```typescript
export function useContentComposition(
  modules: string[],
  options?: CompositionOptions
): UseContentCompositionResult {
  // Module loading and composition
  // Environment override application  
  // Merge strategies
}
```

## Environment Override System

### 1. Inheritance Model
```typescript
interface EnvironmentConfig {
  inherits?: string;           // Base environment to inherit from
  overrides: string[];         // Module overrides to apply
  excludes: string[];          // Modules to exclude
  additions: string[];         // Additional modules
}
```

### 2. Override Examples

**Development Environment**
```json
{
  "inherits": "base",
  "overrides": [
    "dev/overrides/ui.json",     // Debug labels
    "dev/overrides/global.json"  // Development site info
  ],
  "additions": [
    "dev/debug.json"             // Debug-specific content
  ]
}
```

**Production Environment**
```json
{
  "inherits": "base", 
  "overrides": [
    "prod/overrides/ui.json",    // Production labels
    "prod/overrides/global.json" // Production site info
  ],
  "excludes": [
    "dev/*",                     // Exclude debug content
    "components/debug.json"
  ]
}
```

## Migration Strategy

### Phase 1: Module Creation
1. Split existing content.json into modules
2. Create manifest.json with composition rules
3. Implement module loader
4. Maintain backward compatibility

### Phase 2: Hook Enhancement
1. Add module-specific hooks
2. Implement smart loading
3. Add composition functionality
4. Update existing hooks to use modules

### Phase 3: Environment System
1. Create environment configurations
2. Implement override system
3. Add environment detection
4. Test across all environments

### Phase 4: Optimization
1. Implement lazy loading
2. Add CDN support
3. Optimize caching strategies
4. Performance monitoring

## Backward Compatibility

### Existing Code Support
```typescript
// ✅ Existing code continues to work
const { data: content } = useContent();
const buttonText = content?.global?.ui?.buttons?.submit;

// ✅ Existing patterns maintained
const { pageData } = usePageContent('home');
const { globalData } = useGlobalContent();
```

### Migration Path
```typescript
// Phase 1: Module-aware loading (behind the scenes)
const content = await loadModularContent(['core', 'pages/home']);

// Phase 2: Optional module-specific usage
const { data: uiContent } = useUIContent();
const { data: pageContent } = usePageContent('home');

// Phase 3: Advanced composition
const { data: composedContent } = useContentComposition([
  'core/ui',
  'pages/home', 
  'components/faq'
]);
```

## Validation and Schema

### Module-Level Schemas
```typescript
// Each module has its own schema
export const UIContentSchema = z.object({
  buttons: z.record(z.string()),
  labels: z.record(z.string()),
  messages: z.record(z.string()),
  placeholders: z.record(z.string()),
});

export const PageContentSchema = z.object({
  hero: HeroSchema,
  sections: z.record(z.any()),
  metadata: PageMetadataSchema,
});
```

### Composition Validation
```typescript
// Validate composed content matches expected schema
export function validateComposedContent(
  modules: ContentModule[], 
  expectedSchema: ZodSchema
): ValidationResult {
  // Module-by-module validation
  // Composition validation
  // Final schema validation
}
```

## Implementation Benefits

### Performance Improvements
- **Reduced Bundle Size**: Only critical content in main bundle
- **Faster Loading**: Lazy load non-critical content
- **Better Caching**: Module-level cache invalidation
- **CDN Efficiency**: Distribute modules across CDN

### Developer Experience
- **Smaller Files**: Easier to edit and review
- **Clear Separation**: Content organized by purpose
- **Parallel Development**: Multiple developers can work simultaneously
- **Type Safety**: Module-specific types and validation

### Content Management
- **Focused Editing**: Edit only relevant content modules
- **Environment Management**: Easy environment-specific overrides
- **Version Control**: Better diff tracking and merge conflict resolution
- **Deployment Flexibility**: Deploy content modules independently

### Scalability
- **Horizontal Scaling**: Add new modules without affecting existing ones
- **Vertical Scaling**: Optimize individual modules independently
- **Feature Flags**: Module-level feature toggles
- **A/B Testing**: Module-level content experiments

## Testing Strategy

### Module Testing
```typescript
describe('Content Modules', () => {
  test('core modules load correctly', async () => {
    const coreContent = await loadModule('core/ui');
    expect(coreContent.buttons).toBeDefined();
  });
  
  test('page modules lazy load', async () => {
    const pageContent = await loadModule('pages/home', { lazy: true });
    expect(pageContent.hero).toBeDefined();
  });
});
```

### Composition Testing
```typescript
describe('Content Composition', () => {
  test('modules compose correctly', async () => {
    const composed = await composeContent(['core/ui', 'pages/home']);
    expect(composed.global.ui.buttons).toBeDefined();
    expect(composed.pages.home.hero).toBeDefined();
  });
});
```

### Environment Testing
```typescript
describe('Environment Overrides', () => {
  test('dev environment applies overrides', async () => {
    const content = await loadEnvironmentContent('dev');
    expect(content.global.site.name).toContain('[DEV]');
  });
});
```

This modular architecture will transform the content management system from a monolithic structure to a flexible, performant, and maintainable solution that scales with the application's growth.