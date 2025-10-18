# Implementation Checklist

## Setup
- [x] Confirm slug (`/curry-and-carols-menu`) and scaffold `app/curry-and-carols-menu/page.tsx`.
- [x] Model Curry & Carols menu dataset and helper utilities (slugify, JSON-LD builder).

## Core Functionality
- [x] Implement metadata via `getSEOTags` and inject `renderSchemaTags` / breadcrumbs.
- [x] Build hero section with DaisyUI-inspired CTAs and motion wrappers.
- [x] Render menu sections from dataset with accessible semantics.
- [x] Add supporting highlight / reassurance content (e.g., event details, contact info).
- [x] Update `/events/curry-and-carols` CTA stack to include link to new menu page (if consistent).
- [x] Refresh `/events/curry-and-carols` copy, CTAs, and overview now that the menu is live.

## UI/UX
- [x] Ensure `prefers-reduced-motion` handling, `touch-manipulation`, and focus-visible styles on interactions.
- [x] Verify heading hierarchy and aria labels for emoji/sections.
- [x] Apply DaisyUI button classes where appropriate.

## Testing
- [x] Run lint or relevant tests (fails due to pre-existing repository warnings/errors; noted in verification).
- [x] Perform Chrome DevTools QA across viewports and update verification log.

## Questions/Blockers
- Assume hyphenated slug unless stakeholder requests otherwise.
