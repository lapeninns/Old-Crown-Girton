---
task: brand-asset-cleanup
timestamp_utc: 2026-03-20T11:23:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Plan: Brand Asset Cleanup

## Objective

We will remove any remaining legacy starter-brand residue from app-facing assets and replace those surfaces with Old Crown branding.

## Success Criteria

- [ ] No app-facing logo or icon surface uses legacy starter branding.
- [ ] App icon and related branding assets use Old Crown artwork.
- [ ] The app still builds successfully after asset replacement.

## Architecture & Components

- Audit current generated icons and social assets.
- Update the relevant asset files and any direct references that still point at incorrect branding.

## Testing Strategy

- `git diff --check`
- Targeted lint if code references change
- Production build
