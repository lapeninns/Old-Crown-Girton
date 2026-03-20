---
task: seo-geo-editorial-rollout
timestamp_utc: 2026-03-20T10:42:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Plan: SEO, GEO, and Editorial Discoverability Rollout

## Objective

We will make the remaining public pages and editorial surfaces speak the same SEO language so search engines and AI answer systems can more reliably understand the site, its article inventory, and the business entity behind that content.

## Success Criteria

- [ ] Shared helpers exist for article, collection-page, and item-list structured data.
- [ ] Blog article pages use the shared article/page schema system instead of fully hand-written JSON-LD.
- [ ] `/blog` and `/press` emit consistent collection-level schema and discovery signals.
- [ ] Remaining public routes with weak or missing metadata/schema coverage are upgraded to the shared page/breadcrumb pattern.
- [ ] Touched files lint/build cleanly.

## Architecture & Components

- `src/lib/seo/schema.ts`
  - Add reusable builders for article, collection page, and item-list schema.
- `src/lib/seo/metadata.ts`
  - Add editorial metadata helpers on top of the shared base metadata.
- `src/lib/site/editorial.ts`
  - Create a shared editorial index for blog/press summaries and collection reuse.
- `app/blog/page.tsx`, `app/press/page.tsx`
  - Switch to shared editorial index data and collection schemas.
- `app/blog/*/page.tsx`
  - Migrate repeated inline article schema to shared helpers while preserving page-specific FAQ or external-source additions.
- `app/events/page.tsx`, `app/menu/page.tsx`, `app/privacy-policy/page.tsx`, `app/tos/page.tsx`, `app/takeaway-menu/page.tsx`, `app/wakes-menu/page.tsx`, `app/menu-information/page.tsx`
  - Apply consistent metadata, webpage schema, and breadcrumbs where useful.

## Data Flow & API Contracts

- No API contract changes.
- Shared SEO data flows from `site.ts` and the new editorial index into metadata/schema builders.

## UI/UX States

- Minimal intended visual change.
- Any visible changes should be limited to strengthened internal linking or content discovery affordances that reuse existing page structure.

## Edge Cases

- Preserve page-specific FAQ schema and external-source `sameAs` relationships.
- Normalize imported image paths into absolute URLs in shared article schema.
- Avoid unsupported or speculative schema properties.

## Testing Strategy

- Run targeted lint on all touched SEO/editorial files.
- Run `git diff --check`.
- Run a production build.
- If Chrome DevTools MCP remains unavailable, document fallback verification and note the exact external validation still needed.

## Rollout

- No feature flag required.
- Land the shared helper layer and page migrations together so structured data stays coherent across the site.
