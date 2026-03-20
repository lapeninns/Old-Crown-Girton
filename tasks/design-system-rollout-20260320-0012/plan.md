---
task: design-system-rollout
timestamp_utc: 2026-03-20T00:12:08Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Plan: Design System Rollout

## Objective

We will extend the current design-system foundation to cover page-level heroes and shared information panels, then migrate the main marketing and restaurant-section cluster so the site presents one consistent visual system rather than several similar-but-different styling dialects.

## Success Criteria

- [ ] Shared recipes exist for page heroes, content panels, soft callouts, social icon actions, and pill/chip rows.
- [ ] About, Contact, Book a Table, and Menu hero surfaces use the shared design-system recipes.
- [ ] Shared restaurant/contact/events sections use the same panel, heading, and action treatments.
- [ ] The touched pages still build and lint cleanly.

## Architecture & Components

- `src/design-system/recipes.ts`
  - Extend with page-hero and info-panel helpers.
- Main pages
  - `app/about/page.tsx`
  - `app/contact/page.tsx`
  - `app/book-a-table/page.tsx`
  - `app/menu/_components/MenuHero.tsx`
- Shared sections
  - `components/restaurant/LocationSection.tsx`
  - `components/restaurant/sections/ContactInfoSection.tsx`
  - `components/restaurant/sections/ContactFeaturesSection.tsx`
  - `components/restaurant/sections/SocialMediaSection.tsx`
  - `components/restaurant/sections/EventsContactSection.tsx`
  - `components/restaurant/sections/EventsUpdatesSection.tsx`
  - `components/restaurant/sections/AboutCTASection.tsx`

## Data Flow & API Contracts

- No API changes.
- No content-shape changes.
- Existing external booking/contact links remain unchanged.

## UI/UX States

- Hero sections should share one gradient shell, spacing rhythm, and typography hierarchy.
- Informational cards should share border, radius, surface, and shadow language.
- Social/contact/event action links should share the same button semantics and focus treatment.

## Edge Cases

- Preserve external-link targets and `rel` attributes.
- Do not break client-only `BasicTest` behavior inside `AboutCTASection`.
- Keep `RestaurantHoursCard` and `InteractiveMap` integrations unchanged apart from their surrounding styling.

## Testing Strategy

- Run targeted `next lint` on touched design-system/page/section files.
- Run a production build to ensure the rollout compiles in context.
- Document missing Chrome DevTools MCP validation if the tool remains unavailable.

## Rollout

- No feature flag required.
- Land the page/section cluster together so the shared visual language becomes the new default for future edits.
