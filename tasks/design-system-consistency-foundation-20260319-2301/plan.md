---
task: design-system-consistency-foundation
timestamp_utc: 2026-03-19T23:01:16Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Plan: Design System Consistency Foundation

## Objective

We will create a single shared recipe layer for core UI styling so that key Old Crown surfaces render from the same button, card, heading, section, and form-field rules instead of repeating divergent Tailwind strings.

## Success Criteria

- [ ] Shared recipes exist in `src/design-system/` for core interactive and surface primitives.
- [ ] Primitive button/card components consume the shared recipes.
- [ ] Representative homepage/menu/booking/install surfaces are migrated to the shared recipes.
- [ ] The updated surfaces retain accessible focus, readable contrast, and consistent spacing/radius/shadow language.

## Architecture & Components

- `src/design-system/recipes.ts`
  - Centralizes class recipes for buttons, cards, section shells, headings, and form controls.
- `src/design-system/primitives/Button.tsx`
  - Delegates class generation to the shared recipe layer.
- `src/design-system/primitives/Card.tsx`
  - Delegates panel styling to the shared recipe layer and exposes tone-based reuse.
- Representative consumers
  - `components/ui/MicroInteractions.tsx`
  - `components/restaurant/BookingForm.tsx`
  - `components/ui/InstallPrompt.tsx`
  - `app/_components/AboutSection.tsx`
  - `app/_components/MenuHighlights.tsx`
  - `components/restaurant/sections/CallToActionSection.tsx`
  - `components/restaurant/sections/MenuCTASection.tsx`

## Data Flow & API Contracts

- No API or content contract changes.
- This pass changes style ownership only.

## UI/UX States

- Buttons should retain default, loading, disabled, hover, and focus-visible states.
- Cards/panels should share radius, border, and shadow rules across light surfaces.
- Form controls should share field spacing, border, focus, and placeholder treatment.

## Edge Cases

- Preserve existing wrapper-component variant names in `components/ui/Button.tsx` and `components/restaurant/Button.tsx`.
- Keep external/internal link behavior intact in CTA sections.
- Do not force a repo-wide migration of every button or panel in one pass.

## Testing Strategy

- Run targeted lint/build validation for touched files where possible.
- Review searches for duplicated CTA/button recipes in migrated surfaces.
- If browser-based MCP is unavailable, record the limitation and use local build/lint verification instead.

## Rollout

- No feature flag required.
- Land the shared foundation and representative migrations together so new UI work has a canonical pattern to follow.
