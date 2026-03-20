---
task: design-system-consistency-foundation
timestamp_utc: 2026-03-19T23:01:16Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Audit existing theme variables, primitives, and duplicated UI recipes
- [x] Create dedicated task folder for this pass

## Core

- [x] Add shared design-system recipe helpers
- [x] Update primitive button/card components to consume shared recipes
- [x] Align animated button/input helpers with the shared recipes

## UI/UX

- [x] Migrate representative homepage sections to the shared system
- [x] Migrate CTA sections to the shared system
- [x] Migrate booking form fields to the shared system
- [x] Migrate install prompt surface/actions to the shared system

## Tests

- [x] Run targeted verification commands
- [x] Record verification notes and remaining follow-ups

## Notes

- Assumptions:
  - "From scratch" means building a canonical foundation layer now, not redesigning every page in a single pass.
- Deviations:
  - Chrome DevTools MCP verification may need to be deferred if the tool is unavailable in this environment.
  - Browser-level visual QA remains a follow-up because MCP/browser automation was not available in this session.

## Batched Questions

- None.
