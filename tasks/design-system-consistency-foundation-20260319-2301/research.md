---
task: design-system-consistency-foundation
timestamp_utc: 2026-03-19T23:01:16Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: Design System Consistency Foundation

## Requirements

- Functional:
  - Establish one reusable design-system layer for shared buttons, panels, headings, and form controls.
  - Migrate representative, high-visibility UI surfaces onto that shared layer instead of leaving styles duplicated inline.
  - Preserve current brand language and existing routing/content behavior.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Preserve keyboard focus visibility and minimum touch-target sizing.
  - Avoid adding heavy runtime abstractions or extra dependencies.
  - Keep the change focused on presentation consistency, not content-system refactors.

## Existing Patterns & Reuse

- `src/design-system/primitives/Button.tsx` and `src/design-system/primitives/Card.tsx` already exist and are the best starting point for shared primitives.
- `theme/colors.js`, `tailwind.config.js`, and `app/globals.css` already define the brand palette and semantic CSS variables.
- `components/ui/Button.tsx` and `components/restaurant/Button.tsx` already route local variant names through the primitive button.
- Repeated CTA/button/panel/form recipes appear across homepage sections, menu sections, booking flows, the install prompt, and micro-interaction helpers.

## External Resources

- None required for this pass; the work is based on existing repo patterns and AGENTS policy.

## Constraints & Risks

- The worktree is already dirty, including prior design-system-related changes, so edits must stay narrowly scoped and avoid reverting unrelated work.
- `app/globals.css` is already overloaded with theme variables, utility overrides, and component-level styling; this pass should avoid making it even more central.
- The repo contains many bespoke UI class strings, so a full migration is out of scope for one pass.

## Open Questions (owner, due)

- Q: Should later passes migrate all homepage/section components to semantic primitives rather than Tailwind class recipes?
  A: Not required for this pass; build the shared foundation first and migrate representative surfaces.

## Recommended Direction (with rationale)

- Add a shared design-system recipe module in `src/design-system/` that owns button, card, heading, section, and field class recipes.
- Make primitive components consume those recipes so wrapper components inherit consistency automatically.
- Migrate the highest-leverage surfaces first:
  - homepage content sections and CTAs
  - menu CTA section
  - booking form controls
  - install prompt and animated button/input helpers
- Leave broad page-by-page visual redesign for later tasks once the foundation is stable.
