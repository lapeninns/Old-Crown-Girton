---
task: repo-architecture-and-design-system
timestamp_utc: 2026-03-19T16:25:22Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: high
flags: []
related_tickets: []
---

# Verification Checks

## Commands

- `git diff --check -- <touched files>`: passed
- `./node_modules/.bin/next lint --file <touched files>`: passed with no warnings or errors
- `./node_modules/.bin/tsc --noEmit --pretty false`: failed outside this task scope

## Full TypeScript Failures Observed

- `__tests__/hooks/useContent.client.test.tsx`
- `e2e/lazy-loading.spec.ts`
- `src/lib/content/__tests__/modular-content.test.ts`
- `test/examples/contentLoader.server.test.ts`

## Structural Searches

- `renderSchemaTags(...)` still appears across multiple route files, which is acceptable for page-specific schema but shows that further page-by-page consolidation remains.
- `components/restaurant/NavbarParts.tsx` still references `nav.json` only as a fallback, not as the primary navigation source.
- `components/seo/RestaurantSchema.tsx` still exists as a legacy schema system and is a good candidate for the next cleanup pass.
