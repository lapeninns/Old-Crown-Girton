---
task: seo-geo-ranking-pass
timestamp_utc: 2026-03-20T10:36:07Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Audit current metadata, schema, robots, and sitemap implementation
- [x] Create a dedicated SEO/GEO task folder

## Core

- [x] Strengthen default metadata and robots directives
- [x] Expand reusable schema builders for site/entity/page coverage
- [x] Improve sitewide schema output in the root layout

## Discovery

- [x] Fix inaccurate robots route declarations
- [x] Expand sitemap coverage for real public pages
- [x] Add missing high-value page-level schema

## Tests

- [x] Run targeted verification commands
- [x] Record verification findings and remaining follow-ups

## Notes

- Assumptions:
  - GEO gains here come from clearer entities, stronger structured data, and better crawl/discovery signals.
- Deviations:
  - Search Console, Rich Results Test, and browser-level validation may remain follow-up work outside this environment.
  - External search validation tools were not available in this session, so those checks remain open.

## Batched Questions

- None.
