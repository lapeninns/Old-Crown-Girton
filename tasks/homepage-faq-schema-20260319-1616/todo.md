---
task: homepage-faq-schema
timestamp_utc: 2026-03-19T16:16:30Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Review existing homepage schema injection flow
- [x] Gather repo-backed facts for cuisine, hours, bookings, and amenities
- [x] Create task folder and documentation

## Core

- [x] Add homepage FAQ data in `app/page.tsx`
- [x] Generate `FAQPage` JSON-LD from those items
- [x] Append FAQ schema to homepage `schemaEntries`

## Verification

- [x] Review resulting code for JSON-LD validity
- [x] Search for the new homepage FAQ questions
- [x] Record post-deploy validation recommendation

## Notes

- Assumptions:
  - Homepage FAQ schema does not need a visible FAQ accordion to satisfy the user's request.
  - Existing repo copy about dog-friendly spaces, parking, and the largest thatched pub is acceptable as the factual source for answers.
- Deviations:
  - Chrome DevTools MCP QA is not applicable because this task changes structured data only, not rendered UI behavior.
  - Full runtime validation was limited to code inspection because project dependencies are not installed in this workspace.

## Batched Questions

- None.
