---
task: cta-text-color-consistency
timestamp_utc: 2026-03-20T11:11:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Verification Report

## Result

- [x] `Call for Takeaway` and `What's On` now use the light CTA treatment with brown brand text.
- [x] The temporary white-text override was removed from the shared dark banner recipe.
- [x] Affected menu and CTA section consumers inherit the corrected style through shared CTA mappings.

## Checks

- [x] `git diff --check -- src/design-system/recipes.ts tasks/cta-text-color-consistency-20260320-1111`
- [x] `./node_modules/.bin/next lint --file src/design-system/recipes.ts --file app/menu/_components/MenuHero.tsx --file components/restaurant/sections/CallToActionSection.tsx --file components/restaurant/sections/MenuCTASection.tsx`
- [x] `npm run build`

## Notes

- Chrome DevTools MCP QA remains a follow-up requirement for UI changes; the MCP tool was unavailable in this session.
