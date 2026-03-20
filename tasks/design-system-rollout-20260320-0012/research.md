---
task: design-system-rollout
timestamp_utc: 2026-03-20T00:12:08Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: Design System Rollout

## Requirements

- Functional:
  - Roll the new design-system foundation into the main marketing pages and shared restaurant sections.
  - Replace repeated hero, content-card, CTA, and info-panel class recipes with shared design-system recipes.
  - Keep existing copy, routing, and content contracts intact.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Preserve visible focus states, touch-target sizing, and semantic headings.
  - Avoid adding runtime dependencies or redesigning unrelated business logic.
  - Keep changes focused on consistency rather than introducing new UI behavior.

## Existing Patterns & Reuse

- `src/design-system/recipes.ts` already owns the first shared layer for buttons, cards, sections, CTA banners, and fields.
- Main page hero sections in `app/about/page.tsx`, `app/contact/page.tsx`, `app/book-a-table/page.tsx`, and `app/menu/_components/MenuHero.tsx` repeat nearly identical gradient hero structures.
- Shared restaurant sections such as `LocationSection`, `ContactInfoSection`, `ContactFeaturesSection`, `SocialMediaSection`, `EventsContactSection`, `EventsUpdatesSection`, and `AboutCTASection` repeat the same panel/card/button patterns with only minor color differences.

## External Resources

- None required; this pass is based on current repo patterns and the local design-system foundation.

## Constraints & Risks

- The repo is already dirty; avoid reverting unrelated work.
- This pass should not attempt a full migration of every blog page or every feature component in one turn.
- Chrome DevTools MCP verification is still required by policy for UI changes, but may remain unavailable in this environment.

## Open Questions (owner, due)

- Q: Should later passes create semantic React components for page heroes and information panels instead of recipe helpers only?
  A: Likely yes, but recipe consolidation is the safer near-term step because current pages still vary structurally.

## Recommended Direction (with rationale)

- Extend `src/design-system/recipes.ts` with higher-level page/section recipes:
  - page hero shell/title/description
  - standard content panels
  - callout panels
  - social icon buttons and chip lists
- Migrate the shared page cluster first:
  - `about`
  - `contact`
  - `book-a-table`
  - menu hero
  - shared contact/events/location sections
- Leave long-tail blog/article pages for a later rollout once the shared marketing surfaces are standardized.
