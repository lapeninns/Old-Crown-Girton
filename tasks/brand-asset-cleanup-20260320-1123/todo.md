---
task: brand-asset-cleanup
timestamp_utc: 2026-03-20T11:23:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Checklist

## Audit

- [x] Inspect current icon/social/logo assets for non-Old-Crown branding
- [x] Identify the canonical Old Crown logo source to reuse

## Core

- [x] Replace incorrect app-facing brand assets with Old Crown assets
- [x] Update any direct references if needed

## Tests

- [x] `git diff --check`
- [x] Targeted lint if references change
- [x] Production build

## Notes

- The main app icon files already matched the Old Crown logo; the remaining legacy residue was in the social preview images, favicon, and package metadata.
- No targeted lint run was needed because the cleanup only changed package metadata and binary assets.
