---
task: fix-about-section-missing-image
timestamp_utc: 2026-03-22T15:19:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Plan: Fix About Section Missing Image

## Objective

We will restore the about section's main image so homepage visitors can see the intended interior photography instead of a broken image.

## Success Criteria

- [ ] The primary about-section image resolves to an existing asset.
- [ ] The homepage layout and responsive image behavior remain unchanged.
- [ ] Alt text remains accurate enough for screen readers.

## Architecture & Components

- `app/_components/AboutSection.tsx`: update the broken image path and alt text if needed.

## Data Flow & API Contracts

- No API changes.

## UI/UX States

- Success: the image loads normally in the existing card layout.
- Error: n/a after correcting the static path.

## Edge Cases

- Ensure the chosen replacement asset exists in `public` and is compatible with `next/image`.
- Avoid overwriting unrelated in-progress edits in the component.

## Testing Strategy

- Manual verification in the rendered homepage.
- Confirm the file path exists on disk.

## Rollout

- No feature flag required.
- Ship with normal deploy.
- Kill-switch: revert the single path change if needed.
