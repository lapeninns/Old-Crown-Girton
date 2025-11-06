# Implementation Plan: Seasonal Promo Banner Adjustments

## Objective
Bring the Christmas seasonal banner back into alignment with the navigation experience by centering its content on all breakpoints, preventing it from noticeably shrinking the homepage slideshow viewport, and keeping slideshow hero content vertically balanced and readable even when copy is lengthy.

## Success Criteria
- [x] Banner text and CTA remain visually centered on mobile and desktop.
- [x] Navbar height increase from the banner no longer causes the slideshow hero to feel cropped compared to pre-banner layout.
- [x] Banner keeps existing accessibility (focus outlines, aria-label) and DaisyUI styling conventions.
- [x] Slideshow overlay content (eyebrow/headline/copy/CTAs) remains vertically centered regardless of viewport height.
- [x] Slides with long headlines/body copy auto-adjust typography so content stays within the viewport while preserving consistent padding/margins.
- [x] Banner CTA copy refreshed and links internally to `/christmas-menu` (accessible label updated).

## Architecture & Component Changes
- `components/restaurant/SeasonalPromoBanner.tsx`: adjust layout utilities to use `flex-col md:flex-row` with `text-center` and add `items-center`/`justify-center`. Override DaisyUI alert `min-height` to limit vertical expansion and tighten padding to reduce nav height impact.
- `components/restaurant/Navbar.tsx`: measure total nav stack and banner height separately, updating `--navbar-offset` (base nav) plus new `--navbar-stack-offset` (banner + nav) CSS variables so downstream layouts can distinguish spacing vs viewport calculations.
- `components/restaurant/Layout.tsx` & `components/ClientHomeContent.tsx`: consume the base offset for `min-height` and the stack offset for `padding-top` to keep the slideshow viewport consistent while clearing the banner visually.
- `components/slideshow/DaisyUISlideshow.tsx`: ensure overlay uses consistent padding/gap tokens, and introduce helper utilities to adjust headline/body font clamps based on copy length, trimming line-height for longer content while keeping CTAs accessible.

## Data / State Flow
No new data dependencies. Navbar still measures itself to update CSS variables; slideshow adjustments remain purely presentational and driven by static slide data.

## UI / UX Considerations
- Maintain mobile-first stacking: banner content should stack vertically on narrow widths without wrapping issues.
- Keep hit target sizes ≥44px via padding and button min-height.
- Ensure banner height reductions don’t clip content; emoji and badge remain visible.
- Slideshow overlay must preserve readable line lengths and CTA placement when centered; apply clamp-based typography that scales down gracefully for long text.
- Keep overlay padding/margins uniform to avoid layout jump between slides.

## Testing Strategy
- Visual inspection in Chrome DevTools (mobile + desktop) to verify banner centering, hero vertical alignment, typography scaling, and consistent padding.
- Check console for warnings/errors after adjustments.
- Validate CSS custom properties for navbar height via DevTools computed styles.

## Edge Cases
- Extremely long localized copy should still wrap gracefully and remain visible without clipping CTAs.
- Banner hidden or removed should leave navbar measurement unchanged (regression check).
- Slideshow fallback (when no slides) should remain unaffected by layout changes.

## Rollout Plan
- Pure frontend adjustment; no feature flags required.
- After manual QA, ship with standard deployment.
