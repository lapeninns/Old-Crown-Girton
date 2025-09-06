## Data layer and environment setup

This app now loads restaurant data from structured directories with runtime validation via Zod.

- Menu data: Individual category files in `/menu/` directory (e.g., `starters.json`, `speciality.json`, etc.)
- Configuration data: Centralized files in `/config/` directory (`restaurant.json`, `marketing.json`, `config.json`)
- **Content Management**: Centralized content system in `/config/content.json` for all website text, labels, and UI content
- Public surface: utilities in `src/lib/data` provide typed loaders: `getMenuData`, `getRestaurantInfo`, `getMarketingContent`, `getConfigData`, `getContentData`.
- Component `src/components/menu/Menu.tsx` is prop-driven and renders a validated `Menu` model.

Validation errors are caught with friendly fallbacks in pages/components using `ErrorBoundary`.

### Content Management System (CMS)

The application features a comprehensive Content Management System that separates all hardcoded content from code logic:

- **Centralized Content**: All website text, labels, buttons, and UI content in `/config/content.json`
- **Dynamic Updates**: Update content without code deployment
- **Type Safety**: Runtime validation with Zod schemas
- **Accessibility**: Built-in ARIA labels, alt texts, and semantic content
- **Fallback Mechanisms**: Graceful degradation when content fails to load
- **API Integration**: Content served via `/api/content` with caching
- **React Hooks**: `useContent()`, `usePageContent()`, `useComponentContent()` for easy integration

**📖 For detailed CMS documentation, see [README-CONTENT-MANAGEMENT.md](./README-CONTENT-MANAGEMENT.md)**

### Menu Architecture

Menu data is stored in modular category files in the `/menu/` directory:
- `starters.json` - Appetizers and starters
- `mixed_grills.json` - Mixed grill combinations
- `speciality.json` - Speciality dishes including Nepalese cuisine
- `authentic_dishes.json` - Traditional curry variations
- `naans.json` - Bread options
- `fries.json` - Chip and fries variations
- `pub_grub.json` - Wrap options
- `rice.json` - Rice dishes
- `pub_classics.json` - Traditional pub food
- `salads.json` - Salad options
- `sides.json` - Side dishes
- `kids_menu.json` - Children's menu
- `desserts.json` - Dessert options

### Configuration Files

Configuration data is stored in the `/config/` directory:
- `config.json` - App configuration and feature flags
- `restaurant.json` - Restaurant information (contact, hours, etc.)
- `marketing.json` - Marketing content and messaging

### REST + SWR hooks

- API routes: `/api/menu`, `/api/marketing`, `/api/restaurant`, `/api/content` serve validated JSON from the env data loader.
- Client hooks:
	- `useMenu()` -> fetches `/api/menu`
	- `useMarketing(endpoint?)` -> defaults `/api/marketing`
	- `useRestaurant(endpoint?)` -> defaults `/api/restaurant`
	- `useContent()` -> fetches `/api/content` (CMS content)
	- `usePageContent(pageName)` -> fetches page-specific content
	- `useComponentContent(componentName)` -> fetches component-specific content
	- All responses validated via Zod to ensure type-safety at runtime.

# External JSON Content Loader

This project now supports runtime-loaded JSON content so updates can be deployed by publishing new JSON to a CDN (no app redeploy required).

## How it works

1. Components call `useData('site.json')` (or another file name).
2. The loader resolves a base URL at runtime: `process.env.NEXT_PUBLIC_DATA_BASE_URL` (if set) else `/data`.
3. It fetches `BASE/site.json` with `cache: 'no-store'` and keeps a per-session in‑memory promise cache.
4. Dev fallback JSON lives at `public/data/site.json`.

## Environment Variable

Create `.env.local`:

```
NEXT_PUBLIC_DATA_BASE_URL=https://your-cdn.example.com/app-data
```

If omitted, the loader falls back to `/data` (served from `public/data`).

## Adding New Content Files

1. Publish a JSON file to your data base URL, e.g. `features.json`.
2. Add types in `types/content.ts` if needed.
3. Use the hook: `const { data } = useData<FeatureData>('features.json');`

## Types

Defined in `types/content.ts`:

```ts
export type Project = { id: string; title: string; description: string; tags: string[]; url?: string };
export type SiteData = { version: number; projects: Project[] };
```

## Error & Loading States

The hook returns `{ data, error, loading }`. Show skeletons while loading and a friendly message on errors.

## Updating Content

1. Edit JSON at the CDN (or locally under `public/data`).
2. Refresh the page – new data renders immediately (no build needed).

## Optional Validation

Install `zod` and create a schema wrapper similar to:

```ts
import { z } from 'zod';
export const SiteDataSchema = z.object({ version: z.number(), projects: z.array(z.object({ id: z.string(), title: z.string(), description: z.string(), tags: z.array(z.string()), url: z.string().url().optional() })) });
```

Then build a `useParsedData` hook that uses `safeParse` and displays an error if validation fails.

## Acceptance Checklist

- With `NEXT_PUBLIC_DATA_BASE_URL` set, network request targets that base.
- Without it, it requests `/data/site.json`.
- Changing JSON, then refresh => new content appears.
- Errors show user-friendly message.
- TypeScript compiles with added types.

## Testing

Set env and run `npm run dev`, visit `/projects`. Unset env (or change) and observe network request path in browser devtools.

---

Generated by automated refactor.

## Image Organization

We use a component-scoped image structure to keep assets close to their usage and improve maintainability.

- Component images: `src/assets/images/components/<ComponentName>/<category>/...`
- Page images: `src/assets/images/pages/<page-slug>/...`
- Shared images: `src/assets/images/shared/...`
- Raw/source: `src/assets/images/raw/...`

Slideshow assets live in: `src/assets/images/components/Slideshow/{interior,garden,exterior}` and are imported statically using TypeScript path aliases.

Aliases (tsconfig):

- `@images/*` → `src/assets/images/*`
- `@cimages/*` → `src/assets/images/components/*`
- `@pimages/*` → `src/assets/images/pages/*`
- `@simages/*` → `src/assets/images/shared/*`

Scripts:

- Analyze usage: `npm run images:analyze` → writes `image-usage-report.json`
- Track reverse index: `npm run images:track` → writes `image-usage-reverse-index.json`
- Cleanup candidates: `npm run images:cleanup`
- Optimize images: `npm run images:optimize` (requires `sharp` and `svgo`)
- Generate app icons: `npm run icons:generate` (uses `public/images/brand/Oldcrowngirtonlogo.png` by default)

App icons are referenced via Next.js metadata in `app/layout.tsx` and are regenerated into `public/`.

## Migration to Lazy Loading V2

To enable the new standards-based lazy loading (shared IO, concurrency cap, adaptive, CLS fixes):

1. Set `NEXT_PUBLIC_LAZY_V2=true` in .env files.
2. Update components using old dynamic: Replace with Dynamic*V2 exports from dynamicLoader.tsx.
3. For custom imgs: Use AdaptiveImage with new props (root, rootMargin='300px 0px', threshold=0, once=true, onVisible).
4. For hooks: useLazyLoading now uses shared observer; add onVisible for custom logic.
5. Placeholders: Ensure width/height or aspect-ratio for CLS <0.1.
6. Test: Run `npm run test:client`, `npm run e2e` (new lazy tests), check console for telemetry.
7. Rollout: Canary 5-10% traffic, monitor LCP/CLS/INP via Vercel or GA. Rollback by flag=false.

No breaking changes; old impl falls back if flag off. Bundle +2kB utils.
