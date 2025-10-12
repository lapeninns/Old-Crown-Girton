# Implementation Checklist

## Setup

- [x] Append `/press` link to `public/data/nav.json` (place near other informational pages).
- [x] Mirror the new link inside `config/content.json` → `global.navigation.header.links`.

## Core Functionality

- [x] Add `app/press/page.tsx` with metadata, reduced-motion guard, and `RestaurantLayout`.
- [x] Feed `PressFeatureBanner` with local content for hero coverage.
- [x] Expand media highlights grid to include new external coverage links (Cambs Edition, Cambridge Independent, CAMRA, Visit South Cambs).
- [x] Create press resources/contact section with DaisyUI-styled CTAs.
- [x] Surface Food Standards Agency hygiene rating card linking to official listing.

## UI/UX

- [x] Ensure heading hierarchy, breadcrumbs, and focus states align with accessibility standards.
- [ ] Validate responsive layout (mobile → desktop) for new sections.

## Testing

- [ ] Run lint/build command if available (`pnpm lint`).
- [ ] Complete Chrome DevTools QA pass and record results in `verification.md`.

## Questions/Blockers

- Chrome DevTools MCP bridge is unavailable (`Failed to fetch browser webSocket URL from http://localhost:9222/json/version`), so responsive validation via DevTools remains blocked.
