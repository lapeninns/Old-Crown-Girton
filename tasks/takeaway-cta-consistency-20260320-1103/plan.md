---
task: takeaway-cta-consistency
timestamp_utc: 2026-03-20T11:03:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Plan: Takeaway CTA Consistency

## Objective

We will make takeaway ordering CTAs read and behave consistently so users immediately understand that takeaway orders are placed by phone, not through an online checkout flow.

## Success Criteria

- [ ] Phone-based takeaway CTAs use the same label.
- [ ] No active takeaway CTA embeds the phone number in the button text.
- [ ] The active menu surfaces and related content/config sources stay in sync.
- [ ] Touched files lint/build cleanly.

## Architecture & Components

- `config/content/core/ui.json`
  - Update the shared takeaway CTA copy.
- `config/content.json`, `config/content/pages/menu.json`, `app/menu/_content/menu-content.json`
  - Align page/content sources with the same CTA wording.
- `app/menu/page.tsx`, `components/menu/MenuHero.tsx`
  - Update fallbacks and button labels where needed.

## Testing Strategy

- Run `git diff --check`.
- Run targeted `next lint` on touched files.
- Run a production build.
