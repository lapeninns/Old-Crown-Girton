Restaurant_BP Image Management System

Overview
- Centralized, type-safe image registry at `src/lib/images.ts` groups assets by domain: brand, venue, dishes, and blog.
- Semantic physical organization under `public/images/` with subfolders: `slideshow/{interior,garden,exterior}`, `brand`, `food`, and `blog`.
- Preloading and optimization for slideshow via `components/slideshow/useImagePreloader.ts` with device-size heuristics and decode safeguards.

Directory Structure
- `public/images/slideshow/interior` — indoor dining spaces
- `public/images/slideshow/garden` — outdoor garden areas
- `public/images/slideshow/exterior` — facade, parking, and building
- `public/images/brand` — logos and identity marks
- `public/images/food` — dish photography (used assets only)
- `public/images/blog` — per-article content (future)

Registry Usage
- File: `src/lib/images.ts`
  - Export `Images` object (as const) with logical keys for stable references.
  - Export `ImageAlts` for canonical alt text by key without breaking existing string consumers.
- Example: `Image` component
  - `<Image src={Images.venue.exteriorDeckUmbrellas} alt={ImageAlts.venue?.exteriorDeckUmbrellas || 'Pub exterior'} />`

Preloading & Performance
- `useImagePreloader.ts` features:
  - Configurable ahead/behind window around current slide
  - Device pixel ratio and viewport-aware width selection (Next.js-like `_next/image` proxy URLs)
  - Decode-before-display to avoid flicker; error tracking and listener-based waiting
  - Low fetch priority hints to avoid network contention
- `next.config.js`:
  - `images.formats = ['image/avif', 'image/webp']` favors modern formats
  - Rewrites: legacy `/images/dishes/:path*` routed to new `/images/food/:path*`

SEO Implementation
- Slides define targeted, keyword-rich `alt` text per persona (heritage, family, business, student, garden, convenience).
- Structured data in `components/seo/RestaurantSchema.tsx` includes:
  - `image[]` gallery of core venue visuals
  - `logo` pointing to brand path under `/images/brand/`
  - Menu item images for select dishes

Verification & QA
- Script `scripts/verify-images.mjs` checks:
  - Files referenced by the registry and key components exist under `public`
  - Optional HTTP HEAD 200 checks when `VERIFY_BASE_URL` is set (e.g. `http://localhost:3000`)
- Image budgets: `npm run check:image-budgets` for component/page-level constraints
- Optimization: `npm run images:optimize` generates WebP copies under `_optimized` mirrors

Maintenance Procedures
- Add new assets to semantic folders and map them in `src/lib/images.ts`.
- Prefer referencing via the registry; avoid hardcoded string paths in components.
- For dish images referenced as `/images/dishes/...`, the rewrite forwards them to `/images/food/...` for backward compatibility.
- To audit usage and remove dead assets:
  - `npm run images:analyze` and `npm run images:cleanup`

Scalability
- The registry is additive; new keys don’t require refactors elsewhere.
- CDN and caching are handled by Next.js image optimization and long-lived cache TTL in `next.config.js`.

Notes
- Only actively used dish/brand images were moved; a full backup snapshot was saved under `artifacts/backup/` with a timestamp.
- For full WebP primary with JPEG fallback, rely on Next image formats and optionally pre-generate WebP with `images:optimize`.

