---
task: book-a-table-page
timestamp_utc: 2025-12-30T14:21:14Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Plan: Book a Table page

## Objective

Create a public "Book a Table" page with booking info and CTA, matching the provided screenshots and using existing components where possible. Add the page to the marketing navigation.

## Success Criteria

- [ ] `book-a-table` route renders with hero, info cards, booking tips, and contact sections similar to screenshots.
- [ ] Navigation includes a "Book a Table" link.
- [ ] Mobile-first responsive layout looks correct at 375px, 768px, and 1280px+.
- [ ] A11y: headings are hierarchical; focus-visible on interactive elements; keyboard navigation works.

## Architecture & Components

- New page component under public marketing app directory.
- Reuse Shadcn `Card`, `Badge`, `Button` patterns where available.
- Use existing typography and guest-theme classes for consistency.

## Data Flow & API Contracts

- No API calls; static content only.

## UI/UX States

- Default view only; no loading or error states required.

## Edge Cases

- Long text wraps cleanly on mobile.
- CTA buttons remain reachable and readable on small screens.

## Testing Strategy

- Manual QA via Chrome DevTools MCP (required): console, responsive layouts, a11y.
- Optional unit tests not required for static content.

## Rollout

- No feature flag.
- Deploy with standard release flow.
