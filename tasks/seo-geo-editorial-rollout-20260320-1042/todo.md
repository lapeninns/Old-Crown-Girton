---
task: seo-geo-editorial-rollout
timestamp_utc: 2026-03-20T10:42:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Add shared editorial metadata/schema helpers
- [x] Create a reusable editorial index for collection pages

## Core

- [x] Upgrade `/blog` collection metadata/schema
- [x] Upgrade `/press` collection metadata/schema
- [x] Migrate blog article schema to shared helpers
- [x] Add/strengthen metadata and page schema for remaining public routes

## UI/UX

- [x] Keep visible changes minimal and consistent with existing layouts
- [x] Preserve accessibility semantics when adding any discovery/internal-link affordances

## Tests

- [x] `git diff --check`
- [x] Targeted lint on the rollout-clean changed files
- [x] Production build
- [x] Document DevTools/Search Console/Rich Results follow-up if unavailable

## Notes

- Assumptions:
  - “Implement everything” is interpreted as shipping the next highest-leverage in-repo SEO/GEO improvements rather than off-site/local-profile work that requires platform access.
- Deviations:
  - The full touched-file lint set still includes pre-existing content/design-rule violations in `app/privacy-policy/page.tsx`, `app/tos/page.tsx`, `app/wakes-menu/page.tsx`, and `app/menu-information/page.tsx`. The rollout was verified with a clean subset lint run plus a full production build.

## Batched Questions

- None at the moment.
