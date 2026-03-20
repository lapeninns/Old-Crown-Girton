---
task: repo-architecture-and-design-system
timestamp_utc: 2026-03-19T16:25:22Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: high
flags: []
related_tickets: []
---

# Research: Repo Architecture and Design System Consolidation

## Requirements

- Functional:
  - Reorganize the repo foundations so content, SEO/schema, and UI primitives have clear ownership.
  - Reduce duplicate sources of truth without breaking the live app shape.
  - Establish a consistent design-system baseline that existing pages can migrate onto.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Preserve existing accessibility behavior and visible page behavior unless a consistency fix is clearly beneficial.
  - Keep server-rendered metadata and schema as the canonical SEO path.
  - Avoid destructive rewrites of unrelated or in-flight user work.

## Existing Patterns & Reuse

- `src/lib/data/server-loader.ts` already has the best content merge behavior for `config/content.json` plus `data/<env>/content.json`.
- `tailwind.config.js`, `theme/colors.js`, and `app/globals.css` already encode a recognizable brand palette and design language.
- `libs/seo.tsx` is the current compatibility layer most route files depend on for metadata and JSON-LD rendering.
- `config/restaurant.json` is the clearest operational business-facts source for address, phone, and hours.

## Current Structural Problems

### Content

- Server pages use merged content from `config/content.json` and env overrides, but `/api/content` goes through `ContentSmartLoader`, which currently ignores env override merging.
- App-owned content is duplicated across `config/content.json`, `data/*/content.json`, `public/data/*.json`, page-local `_content` hooks, and inline page constants.
- Runtime still pulls nav/footer/marketing data from `public/data/*.json` in places, which bypasses the central content/config path.

### SEO & Schema

- Structured data and metadata ownership are split between `app/layout.tsx`, `libs/seo.tsx`, and `components/seo/RestaurantSchema.tsx`.
- Some schema is injected client-side after hydration.
- Base URL handling is fragmented across multiple env vars and config paths.
- Dynamic robots/sitemap routes coexist with stale static copies in `public/`.

### Design System

- Brand tokens are duplicated across `theme/colors.js`, `app/globals.css`, and `tailwind.config.js`.
- DaisyUI is present but mostly used as raw classes rather than a consistent primitive layer.
- There are duplicate button systems in `components/ui/` and `components/restaurant/`.
- Component folders are noisy and historical (`legacy`, `optimized`, `simple`, `debug`) with weak boundaries.

## Constraints & Risks

- The worktree is already dirty with user changes in `CONTINUITY.md`, `app/layout.tsx`, `app/robots.ts`, and earlier cleanup deletions; those must not be reverted.
- Repo-wide migration in one pass is risky, so this implementation should focus on foundational seams with the highest leverage:
  - shared content loading
  - shared SEO/schema ownership
  - shared design-system primitives
- Existing route files depend on current helper exports, so compatibility shims are preferable to sweeping call-site rewrites.

## Open Questions (owner, due)

- Q: Should blog/article content be centralized now as well?
  A: Not in this pass; keep blog ownership stable and focus on shared foundations first.

## Recommended Direction (with rationale)

- Consolidate content loading onto one filesystem merge path and make `/api/content` match server rendering.
- Remove primary runtime dependence on `public/data/nav.json` and related duplicated public JSON for core navigation/content.
- Introduce one shared site/SEO foundation under `src/lib/site` and `src/lib/seo`, then route old helper exports through it for compatibility.
- Introduce a real primitive layer under `src/design-system/primitives` and make legacy button/card components thin wrappers or re-exports.
- Refactor representative high-traffic surfaces (`app/layout.tsx`, `app/page.tsx`, navbar/contact/home metadata paths) onto the new foundations first.
