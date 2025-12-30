---
task: book-a-table-page
timestamp_utc: 2025-12-30T14:21:14Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Research: Book a Table page

## Requirements

- Functional:
  - Add new public page `book-a-table` with booking information and sections resembling provided screenshots.
  - Add a navigation item linking to the new page.
  - Reuse existing components/patterns where possible; prefer DaisyUI.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Keyboard navigation and focus-visible states must work.
  - Mobile-first layout with responsive sections.
  - No sensitive data; static informational content only.

## Existing Patterns & Reuse

- Public booking wizard page: `src/app/(public)/(marketing)/restaurants/[slug]/book/page.tsx` (layout, guest-theme wrapper).
- Public restaurant sections and hero styling: `src/components/restaurants/PublicSections.tsx` (heading patterns, badges, gradients).
- Shadcn Card component: `components/ui/card.tsx` (card layout base).
- Design tokens for button/card styles: `docs/DESIGN_TOKENS.md`.
- Ops navigation config exists at `src/components/features/ops-shell/navigation.tsx` (pattern for nav config; likely separate for marketing nav).

## External Resources

- None required.

## Constraints & Risks

- Must follow AGENTS SDLC phases; no coding before plan.
- Must use Chrome DevTools MCP for manual QA in verification.
- DaisyUI components preferred; no DaisyUI Blueprint MCP server found.

## Open Questions (owner, due)

- Is this page under public marketing routes or a different section? (owner: github:@maintainers, due: 2025-12-30)
- Should the booking CTA link to existing booking wizard route or be informational only? (owner: github:@maintainers, due: 2025-12-30)

## Recommended Direction (with rationale)

- Place the page under public marketing routes and reuse existing guest-theme styles to align with current brand.
- Compose sections with existing card/button patterns and DaisyUI utility classes for speed and consistency.
