---
task: remove-shipfast-branding
timestamp_utc: 2026-03-24T21:27:00Z
owner: github:@openai
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Audit the repo for Shipfast/starter-template branding and placeholder behavior.

## Core

- [x] Remove fake app/share placeholders from the web manifest.
- [x] Replace dead `/images/logo.png` references with the Old Crown logo asset.
- [x] Replace generic starter CTA text with booking-focused copy.
- [x] Clean obvious starter-template comments from shipped UI code.

## Tests

- [x] Production build
- [x] Search verification for removed runtime placeholders

## Notes

- Assumptions:
  - Internal docs-only `Restaurant_BP` mentions are not user-facing branding.
- Deviations:
  - Docs-wide housekeeping was intentionally left out of this pass to keep the change narrow.
