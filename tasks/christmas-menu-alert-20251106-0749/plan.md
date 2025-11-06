# Implementation Plan: Christmas Menu Alert Banner

## Objective
Introduce a DaisyUI-styled alert banner at the top of the site that promotes the Christmas Menu and links to `/christmas-menu`, matching the stakeholder-provided blueprint while maintaining accessibility and responsiveness.

## Success Criteria
- [ ] Banner appears above the navbar on all layouts and links to `/christmas-menu`.
- [ ] Styling evokes the provided blueprint while aligning with brand colors and DaisyUI tokens.
- [ ] Keyboard users encounter the banner first and receive proper focus outlines.
- [ ] Layout offset adapts to the combined banner + navbar height to prevent content overlap.
- [ ] Banner remains legible and tappable on mobile viewports (≥16px text, ≥44px touch height).

## Architecture
### Components
- `SeasonalPromoBanner` (new) — encapsulates DaisyUI alert markup and festive copy.
- `Navbar` (existing) — renders the new banner and sets a CSS custom property storing its computed height.
- `RestaurantLayout` (existing) — consumes the CSS custom property to offset `<main>` instead of relying on the hard-coded 64px padding.

### State Management
- Local `useLayoutEffect` in `Navbar` to measure banner + nav height and update `document.documentElement.style.setProperty('--navbar-offset', value)`; update on resize via `ResizeObserver` for robustness.

### Data Flow
- Static content string constants inside `SeasonalPromoBanner`; uses `DebugLink` for navigation.
- Height measurement flows from the DOM (banner + nav container) to the root CSS variable consumed by layout.

### UI/UX Considerations
- Mobile-first design: stack badge + copy gracefully, ensure spacing scales.
- Provide accessible name via visible text + `aria-label` on the link.
- Include inline festive badge similar to blueprint (monospace block with "Christmas Menu").
- Ensure hover/focus states meet contrast requirements (use brand blues against base backgrounds).

## Implementation Steps
1. Scaffold `SeasonalPromoBanner.tsx` with DaisyUI `alert` markup, brand-driven styling, and accessible copy linking to `/christmas-menu`.
2. Integrate the banner at the top of `Navbar`, wrapping existing nav content in a container measured by `ResizeObserver`; update CSS variable `--navbar-offset` on mount and resize.
3. Refactor `RestaurantLayout` to read `--navbar-offset` (with fallback) instead of hard-coded `64px` padding; add inline style fallback for SSR.
4. Verify focus order and responsive behavior in Chrome DevTools (mobile, tablet, desktop) and check for console warnings.
5. Update `tasks/christmas-menu-alert-20251106-0749/todo.md` checklist during implementation.

## Edge Cases
- Banner hidden if `SeasonalPromoBanner` fails to render? Provide graceful fallback (nav still works, layout offset defaults to 64px via CSS fallback value).
- Users with reduced motion: banner is static, so no animation required.
- Very narrow viewports: ensure text wraps without overflowing; use `text-center` and `gap` utilities.

## Testing Strategy
- Manual QA using Chrome DevTools per AGENTS.md requirements (responsive, accessibility, console checks).
- Potential React testing for presence of banner could be added later; for now manual verification suffices due to visual nature.

## Rollout Plan
- Feature ships globally (no flag). CSS variable fallback ensures safe deployment. Document in verification report for stakeholder sign-off.
