---
task: cta-text-color-consistency
timestamp_utc: 2026-03-20T11:11:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Checklist

## Core

- [x] Remove the temporary white-text override from the shared dark banner CTA recipe
- [x] Move the affected CTA consumers onto the light CTA treatment with brown brand text

## Tests

- [x] `git diff --check`
- [x] Targeted lint
- [x] Production build
