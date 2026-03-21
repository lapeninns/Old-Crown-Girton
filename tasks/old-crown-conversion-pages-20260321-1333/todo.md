---
task: old-crown-conversion-pages
timestamp_utc: 2026-03-21T13:33:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Refactor menu page messaging and CTA hierarchy
- [x] Refactor booking page reassurance and visit-fit framing
- [x] Refactor events page into a clearer private-hire funnel

## Core

- [x] Keep conversion actions visible and relevant on each page
- [x] Preserve existing functional behavior and route structure

## UI/UX

- [x] Keep mobile responsiveness intact
- [x] Preserve accessibility and reduced-motion behavior

## Tests

- [x] Build smoke check
- [ ] Manual route verification

## Notes

- Assumptions:
  - This phase stays focused on the three most conversion-critical interior pages.
- Deviations:
  - Manual browser QA remains pending because Chrome DevTools MCP is not available in this session.
