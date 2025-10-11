# Implementation Checklist

## Prep & Shared Utilities
- [x] Draft shared helper for nav data (links, labels, aria strings).
- [x] Extract reusable logo + link list subcomponents.

## Navbar Refactor
- [x] Replace `components/restaurant/Navbar.tsx` markup with DaisyUI `navbar`/`menu` structure.
- [x] Update mobile drawer to DaisyUI-based panel with reduced-motion aware transitions.
- [x] Remove/adjust Framer Motion usage if redundant after DaisyUI migration.

## Static Variant
- [x] Apply the same shared pieces to `components/restaurant/NavbarStatic.tsx`.
- [x] Confirm scroll listener + fixed positioning align with refactored classes.

## Integration Checks
- [x] Verify `MenuInteractive` navbar height assumptions and adjust if new height differs.
- [x] Ensure progressive placeholder styles in `ClientHomeContent` still line up with final navbar.

## Status Bar Theming
- [x] Add baseline `theme-color` metadata so iOS status bar stays light.
- [x] Toggle `theme-color` when the mobile menu opens/closes.

## Testing & Verification
- [ ] Run available automated checks (lint/typecheck) if time permits.
- [ ] Perform Chrome DevTools manual QA (mobile/desktop, accessibility, performance).

## Questions/Blockers
- Lint suite currently fails due to numerous pre-existing errors unrelated to navbar changes.
