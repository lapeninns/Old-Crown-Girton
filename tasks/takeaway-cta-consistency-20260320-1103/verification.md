---
task: takeaway-cta-consistency
timestamp_utc: 2026-03-20T11:03:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Verification Report

## Copy Consistency

- [x] Shared takeaway CTA copy now resolves to `Call for Takeaway`
- [x] Menu hero copy now says `Book or call for takeaway`
- [x] Remaining `order takeaway` phrasing is limited to descriptive aria text in `components/restaurant/TakeawayBanner.tsx`

## Checks

- [x] `git diff --check -- CONTINUITY.md config/content/core/ui.json config/content/pages/menu.json config/content.json app/menu/_content/menu-content.json app/menu/page.tsx components/menu/MenuHero.tsx components/restaurant/sections/MenuCTASection.tsx tasks/takeaway-cta-consistency-20260320-1103`
- [x] `./node_modules/.bin/next lint --file app/menu/page.tsx --file components/menu/MenuHero.tsx --file components/restaurant/sections/MenuCTASection.tsx`
- [x] `npm run build`

## Notes

- JSON content files were validated through search checks and the production build rather than `next lint`.
- Chrome DevTools MCP QA is still a follow-up requirement for UI changes; the tool was unavailable in this session.
