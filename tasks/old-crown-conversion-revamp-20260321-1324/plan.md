---
task: old-crown-conversion-revamp
timestamp_utc: 2026-03-21T13:24:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Plan: Old Crown Conversion Revamp

## Objective

We will sharpen the homepage and shared conversion surfaces so that visitors quickly understand why Old Crown is distinctive, practical to visit, and worth booking now.

## Success Criteria

- [ ] Homepage first screen clearly communicates Old Crown's brand, offer, and primary CTA.
- [ ] Homepage section order supports conversion instead of generic browsing.
- [ ] Shared CTA surfaces reinforce the primary user actions: book, call, event enquiry, takeaway.
- [ ] Existing public routes continue to work without structural regressions.

## Visual Thesis

Warm, cinematic village-pub atmosphere with one dominant visual idea per section and a poster-like first screen that makes Old Crown feel both distinctive and easy to choose.

## Content Plan

- Hero: destination-led promise, practical proof, direct CTAs
- Support: trust and proof
- Detail: signature food, occasions, and planning confidence
- Final CTA: book, call, or plan an event

## Interaction Thesis

- Hero overlay and entrance motion should feel calm and premium, not busy.
- Mid-page sections should reveal with restrained depth and clear affordances.
- Primary CTA surfaces should feel tactile and obvious on both mobile and desktop.

## Architecture & Components

- `components/ClientHomeContent.tsx`: reorder and reframe homepage narrative.
- `components/slideshow/DaisyUISlideshow.tsx`: preserve existing strong visual anchor.
- Home sections in `app/_components/*` and `components/restaurant/sections/*`: update copy hierarchy and CTA framing.
- Shared chrome in `components/restaurant/Navbar.tsx` and `components/ClientFooter.tsx`: align visible conversion paths.

## UI/UX States

- Homepage:
  - Hero / proof / occasion paths / food highlight / planning / CTA
- Shared:
  - Desktop and mobile nav
  - Footer quick access
  - Existing loading and reduced motion behavior remain intact

## Edge Cases

- Empty slideshow content should continue to fall back safely.
- Mobile layout must keep the hero and header within the first viewport budget.
- External booking links should remain clearly marked and accessible.

## Testing Strategy

- Manual smoke test via local build for homepage, nav, and footer.
- Verify reduced-motion and keyboard navigation behavior on updated surfaces.
- Run targeted lint/build checks if available without unrelated failures.

## Rollout

- No feature flag for this pass.
- Deploy as a contained visual/content revamp of the existing marketing surface.
- Follow-up work can expand the same blueprint across secondary pages once homepage performance is validated.
