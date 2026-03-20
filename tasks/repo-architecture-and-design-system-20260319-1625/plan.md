---
task: repo-architecture-and-design-system
timestamp_utc: 2026-03-19T16:25:22Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: high
flags: []
related_tickets: []
---

# Implementation Plan: Repo Architecture and Design System Consolidation

## Objective

We will establish one content loader path, one SEO/schema foundation, and one design-system primitive layer so the repo can evolve from a consistent base instead of parallel systems.

## Success Criteria

- [ ] `/api/content` and server-rendered pages resolve content through the same merge logic.
- [ ] Core navigation stops depending on `public/data/nav.json` as its primary content source.
- [ ] Shared site facts and shared SEO/schema helpers exist in one organized location.
- [ ] `app/layout.tsx` and the homepage use the new shared SEO foundations.
- [ ] A canonical primitive button/card layer exists and legacy button components defer to it.
- [ ] Tailwind is configured to scan the actual runtime source tree, including `src/`.

## Architecture & Components

- `src/lib/data/content-filesystem.ts`
  - Shared content file merge and parse helpers.
- `src/lib/site/`
  - Shared business/site facts and homepage schema helpers.
- `src/lib/seo/`
  - Shared metadata and JSON-LD builders/rendering.
- `src/design-system/primitives/`
  - Canonical Button and Card primitives.
- Compatibility layer:
  - Keep `libs/seo.tsx` working, but route it through the new shared modules.
  - Keep older component import paths working via thin wrappers/re-exports where feasible.

## Data Flow & API Contracts

- No external API contract changes.
- Internal content API behavior changes so client fetches align with server-rendered content.

## UI/UX States

- No deliberate visual redesign in this pass.
- UI consistency improvements should come from shared primitives, not page-specific restyling.

## Edge Cases

- Preserve existing page metadata helper signatures where possible.
- Do not force a full migration of blog or page-local `_content` systems in this pass.
- Avoid any refactor that depends on deleting unrelated old files before compatibility is in place.

## Testing Strategy

- Verify content loader parity via targeted code-path inspection and API route references.
- Verify representative schema output wiring in `app/layout.tsx` and `app/page.tsx`.
- Verify primitive wrappers compile cleanly and preserve existing prop usage on migrated call sites.
- Run targeted searches for stale duplicated ownership paths after migration.

## Rollout

- No feature flags required.
- Deliver shared foundations first, then migrate representative entrypoints in the same pass.
- Leave deeper page-by-page migration work easier, not blocked.
