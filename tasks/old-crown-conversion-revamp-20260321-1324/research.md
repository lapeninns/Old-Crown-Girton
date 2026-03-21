---
task: old-crown-conversion-revamp
timestamp_utc: 2026-03-21T13:24:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: Old Crown Conversion Revamp

## Requirements

- Functional:
  - Refresh the public-facing experience to better convert visitors into bookings, calls, event enquiries, and takeaway orders.
  - Keep the existing route structure intact for this first pass.
  - Preserve strong Old Crown identity: historic thatched pub, Nepalese food, Cambridge-adjacent convenience.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Maintain current keyboard accessibility and visible focus treatment.
  - Reuse existing image assets and motion patterns to avoid introducing performance regressions.
  - Avoid any changes that require secret handling, auth changes, or backend updates.

## Existing Patterns & Reuse

- Shared page shell already exists through `components/restaurant/Layout.tsx`, `components/restaurant/Navbar.tsx`, and `components/ClientFooter.tsx`.
- Homepage is assembled in `components/ClientHomeContent.tsx` using reusable sections.
- Existing content and slideshow are driven from `config/content.json` and page-specific JSON files.
- Existing design system helpers in `src/design-system` should be reused rather than creating one-off styling systems.

## Constraints & Risks

- The homepage currently mixes strong destination signals with a few generic sections; the revamp should sharpen hierarchy without creating a full information architecture migration.
- Some supporting components contain stale or inconsistent content and links, so changes to one surface may reveal mismatches elsewhere.
- The first pass should focus on the highest-conversion surfaces rather than attempting a full-site rewrite.

## Open Questions (owner, due)

- Q: Should press and legal/info pages be moved out of the main nav in a later pass?
  A: Not in this pass; keep route structure stable and focus on homepage/shared CTA alignment. Owner: maintainers. Due: later IA pass.

## Recommended Direction (with rationale)

- Lead with a full-bleed, image-led homepage that sells Old Crown as a distinctive destination and makes booking the default next step.
- Reframe mid-page sections around decision support: proof, signature food, audience/occasion paths, visit planning, and clear conversion blocks.
- Tighten shared nav/footer CTA behavior so the strongest actions stay visible across the site.
