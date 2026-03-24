---
task: search-console-coverage-remediation
timestamp_utc: 2026-03-24T21:14:00Z
owner: github:@openai
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Review the supplied Search Console coverage export.
- [x] Audit the existing sitemap, robots, and metadata implementation.

## Core

- [x] Remove the legacy `next-sitemap` postbuild step.
- [x] Delete stale generated crawl files from `public/`.
- [x] Remove canonicals from `noindex` utility pages.
- [x] Add explicit `noindex` metadata to internal demo/debug routes.

## Tests

- [x] Production build

## Notes

- Assumptions:
  - The stale committed sitemap/robots artifacts are the highest-confidence technical source of crawl noise in this repo snapshot.
  - App Router metadata routes are the intended long-term source of truth.
- Deviations:
  - Search Console URL-level export data was not supplied, so remediation is based on code-level evidence rather than individual affected URLs.
