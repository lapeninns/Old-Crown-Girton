# Research: Banner Notch Background Alignment

## Task Setup

### Initial Requirements
- Match the notch/safe area background color with the banner component background on iOS devices (e.g., iPhone with notch).
- Ensure there is no visible color mismatch at the top safe area of the viewport.

### Success Criteria
- On iOS devices with a notch, the area around the notch inherits the banner's background color.
- Implementation integrates with existing styling patterns and does not introduce regressions on other devices/browsers.
- Solution maintains DaisyUI and Tailwind conventions already used in the project.

## Existing Patterns
- `components/restaurant/SeasonalPromoBanner.tsx` renders the top-of-page banner with DaisyUI `alert` markup, `bg-brand-50/90`, and `backdrop-blur` to create the translucent festive surface.
- `components/restaurant/Navbar.tsx` fixes the nav at the top with a white surface (`bg-white`) and stacks the seasonal banner inside it; there is no dedicated safe-area filler today.
- `app/layout.tsx` defines static `<meta name="theme-color" content="#f9fafb">`, which dictates the iOS Safari status bar/notch background tint.
- Prior navbar tasks removed dynamic theme-color mutations, so the project now relies solely on the static metadata value.

## External Resources
- [MDN: `theme-color` meta tag](https://developer.mozilla.org/docs/Web/HTML/Element/meta/name/theme-color) — controls browser UI colors (status bar) on mobile.
- [WebKit Safe Area Insets](https://webkit.org/blog/7929/designing-websites-for-iphone-x/) — explains how `env(safe-area-inset-*)` interacts with top cutouts.

## Technical Constraints
- Must preserve DaisyUI/Tailwind utility usage already applied to the seasonal banner.
- Cannot regress existing navbar offset calculations that depend on the element’s measured height.
- Need to avoid modifying unrelated surfaces (body background, other sections) so the rest of the page keeps its current neutral styling.

## Findings
- The mismatch occurs because the status bar/notch area takes its color from the global `theme-color` metadata (`#f9fafb`, a gray neutral), while the banner uses the terracotta brand palette.
- Simply adjusting DOM backgrounds will not affect the Safari status bar; the metadata (or a safe-area-specific filler) must change.
- The banner hue corresponds to Tailwind’s `bg-brand-50` token (hex `#fdf6f5`) with 90% opacity.

## Recommendations
- Update the light-mode `theme-color` meta to the closest opaque match to the banner (`#fdf6f5`) so the status bar inherits the same tone; keep the dark-mode variant unchanged.
- Optionally add a follow-up safe-area filler if further refinement is needed, but metadata change should address the reported notch mismatch.

## Open Questions
- Do we need a dynamic theme-color swap when the seasonal banner is removed post-holidays? (Out of scope for this request; stakeholders can re-tune the value when the top surface changes.)
