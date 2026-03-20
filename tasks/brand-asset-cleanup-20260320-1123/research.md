---
task: brand-asset-cleanup
timestamp_utc: 2026-03-20T11:23:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: Brand Asset Cleanup

## Requirements

- Remove leftover legacy starter branding residue from the product.
- Replace any non-Old-Crown logo assets used by the app with the Old Crown logo.

## Existing Patterns & Reuse

- The repo already contains Old Crown logo assets in `public/images/brand/`.
- App icons and social images are exposed through `app/icon.*`, `app/apple-icon.*`, `app/opengraph-image.*`, `app/twitter-image.*`, and `public/icon-*`.

## Constraints & Risks

- Text search may miss branding residue embedded only in image assets.
- Replacing app icons/social images may affect metadata previews and install surfaces.
- Keep changes focused on branding assets and direct references only.

## Open Questions

- Which app/social image files currently still show non-Old-Crown branding?

## Recommended Direction

- Audit current icon/social assets and regenerate or replace any non-Old-Crown images with the canonical Old Crown logo assets.
