---
task: cta-text-color-consistency
timestamp_utc: 2026-03-20T11:11:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Research: CTA Text Color Consistency

## Requirements

- Ensure dark banner CTA buttons render a consistent readable text color.
- Fix the affected `Call for Takeaway` and `What's On` buttons at the shared design-system layer when possible.

## Existing Patterns & Reuse

- Shared CTA banner styling is defined in `src/design-system/recipes.ts` via `bannerButtonRecipe`.
- The affected buttons are using `bannerButtonRecipe('dark')` from menu and CTA sections.

## Constraints & Risks

- Keep the fix narrow and avoid changing light/heritage CTA variants.
- Worktree is already dirty; do not disturb unrelated changes.

## Recommended Direction

- Move the affected CTA buttons onto the light banner-button treatment so they keep the system's brown text styling instead of inheriting the dark CTA appearance.
