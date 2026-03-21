---
task: old-crown-funnel-completion
timestamp_utc: 2026-03-21T13:39:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Revamp About page
- [x] Revamp Contact page
- [x] Revamp Press page
- [x] Revamp Takeaway page
- [x] Revamp blog index framing

## Core

- [x] Keep conversion paths visible across remaining public pages
- [x] Maintain consistency with earlier funnel revamp slices

## UI/UX

- [x] Preserve mobile responsiveness
- [x] Preserve accessibility and reduced-motion behavior

## Tests

- [x] Build smoke check
- [ ] Manual route verification

## Notes

- Assumptions:
  - Legal and utility pages are out of scope unless they block the funnel.
- Deviations:
  - `npm run build` initially failed against an incomplete build state; a clean rebuild (`npm run clean && npm run build`) succeeded.
