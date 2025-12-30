---
task: fix-restaurant-api-timeout
timestamp_utc: 2025-12-30T15:51:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Plan: Fix Restaurant API Timeout

## Objective

We will prevent `/api/restaurant` from self-recursing via CMS endpoints so that restaurant data loads quickly and reliably.

## Success Criteria

- [ ] No recursive calls to `/api/restaurant` from the restaurant smart loader.
- [ ] API response time returns to normal (< 1s for filesystem path).
- [ ] No AbortError/slow request warnings in logs under normal load.

## Architecture & Components

- `RestaurantSmartLoader` controls API vs filesystem loading via config.
- `data/prod/config.json` controls CMS flags and API endpoints.

## Data Flow & API Contracts

- GET `/api/restaurant` → `RestaurantSmartLoader.loadSmart` → API (if CMS on) or filesystem fallback.

## UI/UX States

- Not applicable (no UI changes expected).

## Edge Cases

- CMS intentionally enabled but endpoint points to same host/route (recursion).
- CMS enabled but endpoint missing (fallback to filesystem).

## Testing Strategy

- Manual: trigger `/api/restaurant` and verify response is fast and no warnings logged.
- No UI/a11y tests expected for config-only or server-side loader change.

## Rollout

- If config change: deploy to staging (if applicable) then production.
- Monitor logs for timeout/AbortError warnings for 24h post-deploy.

## DB Change Plan (if applicable)

- N/A.
