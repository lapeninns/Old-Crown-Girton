# Checks

## Search

- `rg -n "Order Takeaway|order takeaway|Call for Takeaway|call for takeaway" app components config 'app/menu/_content/menu-content.json' 'config/content/core/ui.json' 'config/content/pages/menu.json' 'config/content.json'`
- Result: active shared/menu CTA copy resolves to `Call for Takeaway`; the only remaining `order takeaway` phrasing is descriptive aria text in `components/restaurant/TakeawayBanner.tsx`

## Formatting

- `git diff --check -- CONTINUITY.md config/content/core/ui.json config/content/pages/menu.json config/content.json app/menu/_content/menu-content.json app/menu/page.tsx components/menu/MenuHero.tsx components/restaurant/sections/MenuCTASection.tsx tasks/takeaway-cta-consistency-20260320-1103`
- Result: passed

## Lint

- `./node_modules/.bin/next lint --file app/menu/page.tsx --file components/menu/MenuHero.tsx --file components/restaurant/sections/MenuCTASection.tsx`
- Result: passed with no ESLint warnings or errors

## Build

- `npm run build`
- Result: passed
