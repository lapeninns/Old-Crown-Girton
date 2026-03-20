---
task: localbusiness-schema-and-ai-robots
timestamp_utc: 2026-02-11T16:00:16Z
owner: github:@amankumarshrestha
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Locate homepage head implementation location.
- [x] Locate canonical robots definition file.

## Core

- [x] Add requested `Restaurant` JSON-LD in `<head>`.
- [x] Add AI crawler directives in `app/robots.ts`.
- [x] Preserve existing Semrush/Ahrefs/MJ12 block behavior.
- [x] Mirror policy updates to `public/robots.txt`.

## UI/UX

- [x] N/A (no layout or interactive changes).

## Tests

- [x] Static diff review for schema and robots updates.
- [ ] Rich Results Test on deployed homepage URL.

## Notes

- Assumptions:
  - Global head placement is acceptable for homepage schema requirement.
- Deviations:
  - None.

## Batched Questions

- None.
