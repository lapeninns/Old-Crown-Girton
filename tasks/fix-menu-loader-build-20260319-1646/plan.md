---
task: fix-menu-loader-build
timestamp_utc: 2026-03-19T16:46:00Z
owner: github:@amankumarshrestha
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Plan: Fix menu loader build failure

## Objective

We will restore the Next.js production build by reconciling TTL helper signatures with their existing callers so that server-side menu/content/config loaders type-check again.

## Success Criteria

- [x] `next build` no longer fails on the TTL helper argument mismatch.
- [x] Cache TTL behavior remains unchanged.

## Architecture & Components

- `src/lib/data/loader.ts`: keep current cache call sites intact.
- `src/lib/data/server-loader.ts`: keep matching server loader behavior intact.

## Data Flow & API Contracts

- No API contract changes.

## UI/UX States

- No UI changes.

## Edge Cases

- Existing callers that pass `env` should remain valid.
- Zero-argument use of the helpers should still work.

## Testing Strategy

- Production build verification via `pnpm run build`.

## Rollout

- No feature flag required.
- Deploy with normal build pipeline once verified.

## DB Change Plan (if applicable)

- Not applicable.
