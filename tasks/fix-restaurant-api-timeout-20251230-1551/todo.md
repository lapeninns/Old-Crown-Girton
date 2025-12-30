---
task: fix-restaurant-api-timeout
timestamp_utc: 2025-12-30T15:51:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [ ] Confirm environment and desired CMS behavior.
- [x] Choose approach: config-only vs loader gating change.

## Core

- [x] Apply chosen fix.
- [x] Ensure no recursion to `/api/restaurant` endpoints.

## UI/UX

- [ ] N/A (no UI changes).

## Tests

- [ ] Manual API check for `/api/restaurant` response time.

## Notes

- Assumptions:
- Environment is production based on `/var/task` log path; CMS should not recurse.
- Deviations:

## Batched Questions

- Should CMS be enabled in prod, and if so, what is the CMS host?
