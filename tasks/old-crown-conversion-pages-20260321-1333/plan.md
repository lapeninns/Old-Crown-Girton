---
task: old-crown-conversion-pages
timestamp_utc: 2026-03-21T13:33:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Plan: Old Crown Conversion Pages

## Objective

We will turn the menu, booking, and events pages into a connected conversion funnel so visitors can move from interest to action with less hesitation.

## Success Criteria

- [ ] `/menu` balances discovery with clear booking/takeaway next steps.
- [ ] `/book-a-table` makes reservations feel easy, practical, and tailored to different visit types.
- [ ] `/events` reads as an event and private-hire landing page rather than a generic info page.
- [ ] Shared visual language remains consistent with the homepage revamp.

## Visual Thesis

Warm, persuasive editorial hospitality layout: strong headings, fewer filler panels, clearer proof and clearer action at each stage of the page.

## Content Plan

- Menu: orient, browse, reassure, convert
- Booking: reassure, plan, contact, convert
- Events: attract, qualify, prove, enquire

## Interaction Thesis

- Keep motion restrained and present only where it improves hierarchy.
- Use chips, panels, and CTA groupings to make decisions feel easy on mobile.
- Ensure every page has a strong top action and a clear lower-page close.

## Architecture & Components

- `app/menu/page.tsx`, `app/menu/_components/MenuHero.tsx`
- `app/book-a-table/page.tsx`
- `app/events/page.tsx`
- Potential supporting additions in `app/_components` if reusable blocks help maintain consistency.

## Testing Strategy

- Production build verification
- Manual smoke on these three routes when browser tools are available

## Rollout

- No feature flags in this phase.
- Keep changes limited to these three routes and directly supporting components.
