---
task: old-crown-funnel-completion
timestamp_utc: 2026-03-21T13:39:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: Old Crown Funnel Completion

## Requirements

- Functional:
  - Bring the remaining public-facing funnel pages into alignment with the homepage, menu, booking, and events revamps.
  - Focus on `About`, `Contact`, `Press`, `Takeaway`, and the blog index.
  - Keep route structure, supporting components, and content sources intact where possible.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Preserve keyboard access and reduced-motion support.
  - Reuse existing design-system and motion patterns.
  - Avoid backend or API changes.

## Existing Patterns & Reuse

- `About` already has a useful history/timeline section but needs stronger framing and conversion support.
- `Contact` already has the right primitives: contact info, hours, feature list, and map.
- `Press` already has trust-rich data and benefits from reordering and stronger CTA context.
- `Takeaway` is structurally sound but can better frame convenience and next steps.
- The blog index already has filtering and strong article coverage; it mainly needs better conversion framing.

## Constraints & Risks

- The site already contains several content inconsistencies, so this pass should avoid deep content-model surgery and instead improve presentation and CTA clarity.
- Blog articles themselves are numerous; updating the index provides better leverage than rewriting every article page in this phase.
- Manual browser verification remains important because these pages rely on layout rhythm, CTAs, and responsive behavior.

## Recommended Direction (with rationale)

- Use each page to answer one main question:
  - About: why this place is worth choosing
  - Contact: how easy it is to visit
  - Press: why people should trust the brand
  - Takeaway: how quickly dinner can be sorted
  - Blog: why the editorial layer matters and where to go next
