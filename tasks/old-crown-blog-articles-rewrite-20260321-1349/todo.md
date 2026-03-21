---
task: old-crown-blog-articles-rewrite
timestamp_utc: 2026-03-21T13:49:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Audit all blog article routes and templates
- [x] Identify shared article components and article-specific outliers

## Core

- [x] Rewrite shared blog article framing
- [x] Rewrite article-specific content/CTA surfaces where needed

## UI/UX

- [x] Keep article pages readable and conversion-oriented
- [x] Preserve accessibility and reduced-motion behavior

## Tests

- [x] Build smoke check
- [ ] Manual article QA

## Notes

- Assumptions:
  - Article routes stay unchanged.
- Deviations:
  - The rewrite preserved most article body copy and schema intent while replacing the repeated page shell with a common template.
