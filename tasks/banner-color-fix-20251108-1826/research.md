# Research: Banner Color Contrast

## Initial Requirements
- Top of the banner currently renders with a dark background.
- Requirement: adjust styling so the top area displays a light (nearly white) background that matches design intent.

## Success Criteria
- Top segment of the banner uses a light/white background on all supported viewports.
- No regressions to banner layout, text legibility, or surrounding sections.
- Solution reuses existing design tokens / DaisyUI theme values.

## Existing Patterns
- `components/restaurant/SeasonalPromoBanner.tsx` renders the site-wide promo alert stacked above the navbar. Its wrapper `div` applies `border-b border-brand-100 bg-brand-50/90 backdrop-blur`.
- `app/globals.css` already defines manual Tailwind backfill utilities such as `.bg-brand-50` and `.text-brand-50` to map directly to CSS variables when Tailwind cannot express them (see lines ~320+).
- Content authors consume the same class list via `config/content/components/consolidatedBanner.json`, so any style fix should keep the dataset and component aligned.

## External Resources
- [MDN `color-mix()`](https://developer.mozilla.org/docs/Web/CSS/color_value/color-mix) — handy for creating translucent surfaces out of CSS variables without converting to RGB triples.

## Technical Constraints
- Tailwind colors are configured as CSS variables (e.g., `'var(--color-brand-50)'`). When using slash-opacity utilities like `bg-brand-50/90`, Tailwind emits `background-color: rgb(var(--color-brand-50) / 0.9)`, which is invalid because the CSS variable resolves to a hex string rather than space-separated RGB tuple. Browsers drop the declaration, leaving the element transparent.
- Because the banner sits atop a dark hero slideshow, the transparent background makes the "top of the banner" appear dark, especially before the main nav background scrolls into place.
- We should avoid swapping in raw hex literals so the banner continues to benefit from centralized color tokens/daisyUI theme overrides.

## Recommendations
- Provide an explicit utility for `bg-brand-50/90` (and future similar translucent tones) inside `app/globals.css`, similar to the existing `.bg-brand-50` rule. We can set a fallback solid color followed by a `color-mix()` declaration to achieve the intended 90% opacity while preserving compatibility.
- Keep the JSON surface class list unchanged once the new utility exists, ensuring downstream consumers automatically inherit the fix.

## Open Questions
- None. The bug reproduces consistently because the Tailwind-generated class is invalid; adding a custom utility is a sufficient fix.
