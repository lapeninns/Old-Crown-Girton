---
task: old-crown-conversion-pages
timestamp_utc: 2026-03-21T13:33:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: Old Crown Conversion Pages

## Requirements

- Functional:
  - Revamp `/menu`, `/book-a-table`, and `/events` so they continue the stronger conversion logic introduced on the homepage.
  - Keep the existing route structure and booking flow intact.
  - Make the pages clearer for the top user intents: booking, takeaway, and event enquiries.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Preserve keyboard usability and reduced-motion support.
  - Reuse existing design-system patterns and avoid introducing heavy new dependencies.
  - Keep all booking/contact integrations as existing links only.

## Existing Patterns & Reuse

- Page shell and design system are already stable through `RestaurantLayout` and `src/design-system`.
- `/menu` already has strong interactive filtering and should retain it as the main functional surface.
- `/book-a-table` already has booking/contact/hours building blocks that can be reframed rather than rebuilt.
- `/events` already contains relevant content themes but needs a more conversion-oriented structure and clearer CTAs.

## Constraints & Risks

- The menu page already carries a lot of functional density, so conversion work should complement rather than bury the interactive menu.
- The events page currently uses inline content and duplicated utility styling; a cleanup pass should stay focused on messaging and hierarchy.
- Manual browser QA remains important because these pages rely on responsive hero and sticky navigation behavior.

## Open Questions (owner, due)

- Q: Should event enquiries eventually route to a dedicated form instead of generic contact?
  A: Not in this pass; continue using existing contact flows. Owner: maintainers. Due: later funnel pass.

## Recommended Direction (with rationale)

- Add concise pre-menu framing and stronger lower-page CTAs on `/menu`.
- Make `/book-a-table` feel more like a reassurance-and-action page with visit-fit signals and clearer urgency.
- Reframe `/events` around private hire and use-case paths so event planners can self-identify and act faster.
