---
task: cta-text-color-consistency
timestamp_utc: 2026-03-20T11:11:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Plan: CTA Text Color Consistency

## Objective

We will align the affected CTA buttons with the light banner-button treatment so they render with the design system's brown brand text instead of white text.

## Success Criteria

- [ ] `Call for Takeaway` and `What's On` render with the light CTA treatment and brown brand text.
- [ ] The fix is applied through shared CTA mappings rather than one-off inline overrides.

## Architecture & Components

- Revert the temporary dark-variant text override in `src/design-system/recipes.ts`.
- Move affected CTA consumers to `bannerButtonRecipe('light')`:
  - `app/menu/_components/MenuHero.tsx`
  - `components/restaurant/sections/CallToActionSection.tsx`
  - `components/restaurant/sections/MenuCTASection.tsx`
- Align the inline takeaway CTA on `app/menu/page.tsx` to the same light button treatment.

## Testing Strategy

- `git diff --check`
- Targeted lint
- Production build
