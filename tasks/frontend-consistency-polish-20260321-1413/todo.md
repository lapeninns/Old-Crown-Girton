---
task: frontend-consistency-polish
timestamp_utc: 2026-03-21T14:13:36Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Refine shared visual tokens and reusable recipes
- [x] Align shared shell components with the updated system
- [x] Audit the homepage and key interior routes against the new baseline

## Core

- [x] Improve navbar and footer consistency
- [x] Reduce inconsistent panel/card treatment where layout can do the job
- [x] Tighten typography, spacing, and CTA hierarchy across major sections
- [x] Add a reusable frontend style guide for future UI work
- [x] Reframe the shared system around the "Digital Maître d'" gastropub brief

## UI/UX

- [x] Keep mobile-first layout quality intact
- [x] Preserve accessibility, focus visibility, and reduced-motion behavior
- [x] Maintain strong contrast on all hero and CTA surfaces

## Tests

- [x] Production build smoke check
- [ ] Manual route verification

## Notes

- Assumptions:
  - This pass focuses on shared shell and high-traffic marketing routes rather than every long-tail page template.
- Deviations:
  - Chrome DevTools MCP verification remains pending because the tool is unavailable in-session.
  - Fallback screenshot smoke checks were captured for `/`, `/press`, and `/blog`, but a broader manual route pass is still needed.
  - The latest pass concentrated on global tokens, fonts, recipes, and navbar styling so the new design language propagates through shared primitives first.
