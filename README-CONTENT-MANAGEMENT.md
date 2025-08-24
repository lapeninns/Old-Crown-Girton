# Content Management System (CMS) Documentation

This document outlines the comprehensive content management system implemented to separate all hardcoded content from code logic, enabling dynamic content updates without code changes.

## Overview

The Content Management System (CMS) transforms the application from using hardcoded strings to a centralized, JSON-based content management approach. This enables:

- **Dynamic Content Updates**: Update all website content without code deployment
- **Type Safety**: Runtime validation with Zod schemas
- **Internationalization Ready**: Structure supports multiple languages
- **Accessibility Compliance**: ARIA labels, alt texts, and semantic content
- **Fallback Mechanisms**: Graceful degradation when content fails to load
- **Performance Optimization**: Caching and smart loading strategies

## Architecture

### Content Structure

All content is centralized in `/config/content.json` with the following structure:

```json
{
  "global": {
    "site": { "name", "title", "description", "keywords", "branding" },
    "navigation": { "header", "footer", "breadcrumbs" },
    "ui": { "buttons", "labels", "messages", "placeholders" },
    "accessibility": { "ariaLabels", "altTexts", "descriptions" }
  },
  "pages": {
    "home": { "hero", "sections" },
    "about": { "hero", "story", "cta" },
    "contact": { "hero", "contactInfo", "hours", "features" },
    "events": { "hero", "regularEvents", "contact" },
    "menu": { "hero", "sections" },
    "signin": { "title", "subtitle", "form" },
    "dashboard": { "title", "subtitle" },
    "offline": { "title", "subtitle", "description" },
    "notFound": { "title", "subtitle", "buttons" }
  },
  "components": {
    "testimonials": { "title", "subtitle", "items" },
    "faq": { "title", "subtitle", "items" },
    "menuHighlights": { "title", "subtitle", "featuredItem" }
  },
  "forms": {
    "validation": { "required", "email", "phone", "minLength", "maxLength" },
    "messages": { "success", "error", "submitting" },
    "labels": { "name", "email", "phone", "message", "subject" }
  },
  "api": {
    "messages": { "success", "error", "notFound", "unauthorized" },
    "errors": { "menu", "restaurant", "marketing", "config", "validation", "auth", "payment" }
  },
  "legal": {
    "terms": { "title", "effectiveDate", "contact" },
    "privacy": { "title", "effectiveDate", "contact" }
  }
}
```

### Smart Content Loading

Content loading follows a hierarchical fallback pattern:

1. **API First**: Attempts to load from `/api/content` endpoint
2. **Filesystem Fallback**: Falls back to local `content.json` file
3. **Hardcoded Defaults**: Uses component-level defaults as final fallback

```typescript
// Server-side content loading
const content = await getContentSmart(env);

// Client-side content loading with SWR
const { data: content, error, loading } = useContent();
```

## API Endpoints

### `/api/content`

Returns the complete content structure with caching headers for optimal performance.

**Response Format:**
```typescript
{
  status: 200,
  headers: {
    'cache-control': 'public, s-maxage=300, stale-while-revalidate=300'
  },
  body: Content // Full content structure
}
```

**Error Handling:**
```typescript
{
  status: 500,
  body: { error: 'Failed to load content' }
}
```

## React Hooks

### Core Hooks

#### `useContent()`
Primary hook for accessing all content data.

```typescript
import { useContent } from '@/hooks/useContent';

const { data: content, error, loading, refetch } = useContent();

// Access global content
const siteName = content?.global?.site?.name || 'Default Site Name';
const buttons = content?.global?.ui?.buttons || {};

// Access page content
const heroTitle = content?.pages?.home?.hero?.title || 'Default Title';
```

#### `usePageContent(pageName)`
Specialized hook for page-specific content.

```typescript
import { usePageContent } from '@/hooks/useContent';

const { data: homeContent, error, loading } = usePageContent('home');
const heroTitle = homeContent?.hero?.title || 'Default Title';
```

#### `useGlobalContent()`
Hook for accessing global content only.

```typescript
import { useGlobalContent } from '@/hooks/useContent';

const { data: globalContent } = useGlobalContent();
const navigation = globalContent?.navigation;
const uiLabels = globalContent?.ui?.labels;
```

#### `useComponentContent(componentName)`
Hook for component-specific content.

```typescript
import { useComponentContent } from '@/hooks/useContent';

const { data: faqContent } = useComponentContent('faq');
const faqTitle = faqContent?.title || 'FAQ';
const faqItems = faqContent?.items || [];
```

#### `useContentWithFallback(path, fallback)`
Hook with explicit fallback values.

```typescript
import { useContentWithFallback } from '@/hooks/useContent';

const buttonText = useContentWithFallback('global.ui.buttons.submit', 'Submit');
```

## Component Migration Patterns

### Server Components

Use `getContentSmart()` for server-side content loading:

```typescript
import { getContentSmart } from '@/src/lib/data/loader';

export default async function ServerComponent() {
  const content = await getContentSmart();
  const title = content.pages.home.hero.title;
  
  return <h1>{title}</h1>;
}
```

### Client Components

Use React hooks for client-side content:

```typescript
'use client';
import { useContent } from '@/hooks/useContent';

export default function ClientComponent() {
  const { data: content, loading, error } = useContent();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading content</div>;
  
  const title = content?.pages?.home?.hero?.title || 'Default Title';
  
  return <h1>{title}</h1>;
}
```

### Migration Best Practices

#### 1. Fallback Strategy
Always provide fallback values to ensure graceful degradation:

```typescript
// ✅ Good: Always provide fallbacks
const buttonText = content?.global?.ui?.buttons?.submit || 'Submit';

// ❌ Bad: No fallback
const buttonText = content.global.ui.buttons.submit;
```

#### 2. Accessibility Integration
Use content management for accessibility features:

```typescript
const ariaLabel = content?.global?.accessibility?.ariaLabels?.closeModal || 'Close modal';
const altText = content?.global?.accessibility?.altTexts?.logo || 'Logo';

<button aria-label={ariaLabel}>Close</button>
<img alt={altText} src="/logo.png" />
```

#### 3. Form Integration
Integrate forms with validation and labels:

```typescript
const { data: content } = useContent();
const formLabels = content?.forms?.labels;
const validation = content?.forms?.validation;

<input 
  placeholder={formLabels?.email || 'Email'}
  aria-label={formLabels?.email || 'Email Address'}
/>

// Error display
{error && <span>{validation?.email || 'Invalid email'}</span>}
```

#### 4. Navigation Integration
Dynamic navigation with content management:

```typescript
const navLinks = content?.global?.navigation?.header?.links || [];

{navLinks.map((link, index) => (
  <Link key={index} href={link.href}>
    {link.label}
  </Link>
))}
```

## Schema Validation

### Content Schema Structure

The content is validated using Zod schemas for type safety:

```typescript
import { ContentSchema } from '@/src/lib/data/schemas';

// Validate content at runtime
const validatedContent = ContentSchema.parse(rawContent);
```

### Key Schema Components

```typescript
export const ContentSchema = z.object({
  global: z.object({
    site: z.object({
      name: z.string(),
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()),
      branding: z.object({
        tagline: z.string(),
        slogan: z.string(),
      }),
    }),
    navigation: NavigationSchema,
    ui: UISchema,
    accessibility: AccessibilitySchema,
  }),
  pages: z.object({
    home: z.object({
      hero: HeroSchema,
      sections: z.object({
        features: z.object({
          title: z.string(),
          items: z.array(FeatureItemSchema),
        }),
        quickLinks: z.array(QuickLinkSchema),
      }),
    }),
    // ... other pages
  }),
  components: z.object({
    testimonials: z.object({
      title: z.string(),
      subtitle: z.string(),
      items: z.array(TestimonialSchema),
    }),
    faq: z.object({
      title: z.string(),
      subtitle: z.string(),
      items: z.array(FAQItemSchema),
    }),
    // ... other components
  }),
  forms: FormSchema,
  api: APISchema,
  legal: LegalSchema,
});
```

## Testing

### Unit Tests

Test content loading functionality:

```typescript
import { getContentData, getContentSmart } from '@/src/lib/data/loader';
import { ContentSchema } from '@/src/lib/data/schemas';

describe('Content Loading', () => {
  test('loads content data from file', async () => {
    const content = await getContentData('dev');
    expect(ContentSchema.parse(content)).toBeTruthy();
  });

  test('validates content structure', async () => {
    const content = await getContentSmart('dev');
    expect(content.global.site.name).toBeDefined();
    expect(content.pages.home.hero).toBeDefined();
  });
});
```

### Integration Tests

Test API endpoints:

```typescript
describe('Content API', () => {
  test('content API returns valid structure', async () => {
    const content = await getContentSmart('dev');
    expect(content.global).toBeDefined();
    expect(content.pages).toBeDefined();
    expect(content.components).toBeDefined();
  });
});
```

### E2E Tests

Test component rendering with content:

```typescript
import { render, screen } from '@testing-library/react';
import { SWRConfig } from 'swr';

describe('Content Display', () => {
  test('displays content from CMS', () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <Component />
      </SWRConfig>
    );
    
    expect(screen.getByText(/expected content/i)).toBeInTheDocument();
  });
});
```

### Accessibility Tests

Validate dynamic content accessibility:

```typescript
describe('Accessibility', () => {
  test('maintains ARIA labels from content', () => {
    const { container } = render(<Component />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });
});
```

## Performance Optimization

### Caching Strategy

1. **API Level Caching**: 5-minute cache with stale-while-revalidate
2. **SWR Caching**: Automatic client-side caching with revalidation
3. **Server Component Caching**: Static generation where possible

```typescript
// API route caching
export async function GET() {
  const content = await getContentData();
  return NextResponse.json(content, {
    status: 200,
    headers: {
      'cache-control': 'public, s-maxage=300, stale-while-revalidate=300'
    }
  });
}
```

### Bundle Optimization

- Content is loaded at runtime, not bundled
- Smart loading reduces initial bundle size
- Selective content loading for specific components

## Environment Configuration

### Development
```json
{
  "env": "dev",
  "featureFlags": { "cms": true },
  "cms": { "enabled": true },
  "api": {
    "baseUrl": "http://localhost:3000"
  }
}
```

### Production
```json
{
  "env": "prod",
  "featureFlags": { "cms": true },
  "cms": { "enabled": true },
  "api": {
    "baseUrl": "https://yoursite.com"
  }
}
```

## Error Handling

### Content Loading Errors

```typescript
const { data: content, error, loading } = useContent();

if (loading) {
  return <div>Loading content...</div>;
}

if (error) {
  console.error('Content loading failed:', error);
  // Fallback to defaults
}

// Use content with fallbacks
const title = content?.pages?.home?.hero?.title || 'Default Title';
```

### Schema Validation Errors

```typescript
try {
  const validatedContent = ContentSchema.parse(rawContent);
} catch (error) {
  console.error('Content validation failed:', error);
  // Log validation errors and use fallbacks
}
```

## Content Editing Workflows

### 1. Content Updates

To update content:

1. Edit `/config/content.json`
2. Validate using schema: `npm run validate-content`
3. Test locally: `npm run dev`
4. Deploy changes

### 2. Adding New Content

1. Add content to appropriate section in `content.json`
2. Update TypeScript types if needed
3. Update Zod schema for validation
4. Write tests for new content
5. Update component to use new content

### 3. Internationalization Preparation

Structure supports future i18n:

```json
{
  "global": {
    "site": {
      "name": {
        "en": "Restaurant Name",
        "es": "Nombre del Restaurante"
      }
    }
  }
}
```

## Migration Checklist

When migrating components to use CMS:

- [ ] Identify all hardcoded strings
- [ ] Add content to appropriate section in `content.json`
- [ ] Update component to use content hooks
- [ ] Provide fallback values for all content
- [ ] Add accessibility content (ARIA labels, alt texts)
- [ ] Write tests for component with CMS integration
- [ ] Test error scenarios (loading, failed requests)
- [ ] Validate accessibility compliance
- [ ] Update component documentation

## Troubleshooting

### Common Issues

1. **Content not loading**: Check API endpoint and network requests
2. **Schema validation errors**: Verify content.json structure matches schema
3. **Missing fallbacks**: Always provide default values
4. **Type errors**: Ensure TypeScript types match content structure
5. **Accessibility issues**: Verify ARIA labels and alt texts are included

### Debug Mode

Enable debug logging:

```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Content loaded:', content);
}
```

### Content Validation

Validate content structure:

```bash
npm run validate-content
npm run test:content
```

## Best Practices Summary

1. **Always use fallbacks** for graceful degradation
2. **Follow accessibility guidelines** with proper ARIA labels
3. **Write comprehensive tests** for content integration
4. **Use TypeScript types** for content structure
5. **Implement proper error handling** for failed requests
6. **Cache content appropriately** for performance
7. **Validate content schemas** to catch errors early
8. **Structure content logically** by page and component
9. **Keep content.json maintainable** with clear organization
10. **Document content changes** and update workflows

This CMS enables dynamic content management while maintaining type safety, accessibility, and performance standards throughout the application.