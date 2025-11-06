# Implementation Checklist

## Setup
- [x] Create `SeasonalPromoBanner` component under `components/restaurant/`.
- [x] Export banner from appropriate index if needed (direct import in `Navbar`, no shared index change required).

## Navbar Integration
- [x] Render `SeasonalPromoBanner` at the top of `Navbar` while keeping existing layout structure intact.
- [x] Implement height measurement via `ResizeObserver` to update `--navbar-offset` CSS variable.

## Layout Adjustment
- [x] Update `components/restaurant/Layout.tsx` to rely on `--navbar-offset` with sensible fallback padding.

## QA
- [ ] Run lint/tests if applicable (spot-check not required now but ready if needed).
- [x] Complete Chrome DevTools manual QA and document results in `verification.md`.

## Documentation
- [x] Update `verification.md` with findings once QA is done.
