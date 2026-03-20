---
task: fix-menu-loader-build
timestamp_utc: 2026-03-19T16:46:00Z
owner: github:@amankumarshrestha
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Review root `AGENTS.md`.
- [x] Create task folder and artifact directory.

## Core

- [x] Inspect failing loader/cache TTL usage.
- [x] Update helper signatures with a minimal compatibility fix.

## UI/UX

- [x] Not applicable; no UI changes.

## Tests

- [x] Production build
- [x] Additional follow-up fixes if the build exposes another blocker

## Notes

- Assumptions:
  - `AppEnv` should remain accepted by callers even if unused by TTL helpers today.
- Deviations:
  - Chrome DevTools MCP manual UI QA is not applicable to this non-UI type fix.

## Batched Questions

- None.
