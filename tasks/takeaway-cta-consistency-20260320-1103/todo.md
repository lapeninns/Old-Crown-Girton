---
task: takeaway-cta-consistency
timestamp_utc: 2026-03-20T11:03:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Checklist

## Core

- [x] Update shared takeaway CTA copy sources
- [x] Align active menu/takeaway button labels and fallbacks

## Tests

- [x] `git diff --check`
- [x] Targeted lint
- [x] Production build

## Notes

- Assumptions:
  - `Call for Takeaway` is the preferred label because the current action is a phone call, not an online ordering flow.
- Deviations:
  - Chrome DevTools MCP QA remains a follow-up because the MCP tool was not available in this session; the code and content changes were verified with targeted lint, search checks, and a full production build.
