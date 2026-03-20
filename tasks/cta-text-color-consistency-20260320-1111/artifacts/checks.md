# Checks

## Formatting

- `git diff --check -- src/design-system/recipes.ts tasks/cta-text-color-consistency-20260320-1111`
- Result: passed

## Lint

- `./node_modules/.bin/next lint --file src/design-system/recipes.ts --file app/menu/_components/MenuHero.tsx --file components/restaurant/sections/CallToActionSection.tsx --file components/restaurant/sections/MenuCTASection.tsx`
- Result: passed with no ESLint warnings or errors

## Build

- `npm run build`
- Result: passed
