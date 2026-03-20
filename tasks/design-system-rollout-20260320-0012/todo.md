---
task: design-system-rollout
timestamp_utc: 2026-03-20T00:12:08Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Identify the highest-leverage duplication cluster for rollout
- [x] Create a dedicated rollout task folder

## Core

- [x] Extend design-system recipes for page heroes and information panels
- [x] Add shared treatments for social actions, chips, and soft callouts

## UI/UX

- [x] Migrate about/contact page shells
- [x] Migrate book-a-table and menu hero surfaces
- [x] Migrate location/contact/events shared sections

## Tests

- [x] Run targeted verification commands
- [x] Capture results in verification artifacts

## Notes

- Assumptions:
  - “Across all the system” in this pass means shared customer-facing pages and reusable restaurant sections first.
- Deviations:
  - Browser-based DevTools MCP QA may remain a follow-up if the MCP tool is unavailable in this environment.
  - Chrome DevTools MCP remained unavailable in this session, so browser QA is still a follow-up.

## Batched Questions

- None.
