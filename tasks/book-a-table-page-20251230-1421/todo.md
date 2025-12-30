---
task: book-a-table-page
timestamp_utc: 2025-12-30T14:21:14Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Locate existing marketing navigation and route patterns
- [x] Add `book-a-table` page under public marketing routes

## Core

- [x] Build hero section (title, description, badges)
- [x] Add booking info cards (hours + contact) per screenshots
- [x] Add booking tips panel section

## UI/UX

- [x] Ensure mobile-first responsive layout
- [x] Apply DaisyUI/guest-theme styling and reuse components
- [x] Add accessible labels/structure and focus-visible interactions

## Tests

- [x] Manual QA via Chrome DevTools MCP (console, a11y, responsive)
- [x] Capture artifacts and fill verification.md

## Notes

- Assumptions:
  - The page is a public marketing page.

- Deviations:
  - Device emulation resize failed in DevTools MCP; needs manual viewport check.

## Batched Questions

- Where should CTA link (booking wizard vs contact)?
