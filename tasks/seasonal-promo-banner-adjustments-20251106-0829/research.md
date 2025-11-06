# Research: Seasonal Promo Banner Adjustments

## Existing Patterns
- `components/restaurant/SeasonalPromoBanner.tsx` renders the festive alert using DaisyUI `alert` styling plus utility classes for layout and focus states.
- `components/restaurant/Navbar.tsx` measures the full `<nav>` height (banner + nav) with `ResizeObserver` and stores it in the CSS custom property `--navbar-offset`.
- `components/restaurant/Layout.tsx` consumes `--navbar-offset` for `padding-top` and `min-height`, so any banner height directly shifts the hero/slideshow underneath.
- DaisyUI alerts default to `display: flex` with baseline alignment, so nested spans need explicit flex utilities for centering.
- `components/slideshow/DaisyUISlideshow.tsx` positions slide content via a flex-centered overlay with clamp-based padding; headline/copy font sizes are currently fixed clamps and don’t respond to longer copy blocks.

## External Resources
- [DaisyUI Alert Component](https://daisyui.com/components/alert/) — documents default flex behaviour and sizing (min-height 3.5rem) that can impact surrounding layout.
- [DaisyUI Carousel](https://daisyui.com/components/carousel/) — highlights that `carousel-item` elements behave like flex-none panels, so inner wrappers must handle their own vertical alignment.
- [Fluid Type Clamp Generator](https://material.io/design/typography/the-type-system.html) — reference for responsive typography using `clamp()`.

## Technical Constraints
- Banner must remain accessible (link focus styles, readable text, aria-label for CTA).
- Navbar height changes propagate to layout via CSS variables; careless adjustments can disrupt hero/slideshow composition.
- Slideshow content must stay responsive, support long copy, and coexist with CTA buttons without clipping.
- Need consistent horizontal/vertical padding across slides to avoid layout jump when content length varies.

## Observations & Questions
- Current headline clamp (`2.15rem`–`3.65rem`) is aggressive for long strings; longer copy wraps into many lines and can exceed vertical space, even with centered layout.
- Body copy uses a single clamp as well; tightening range for longer text could help maintain balance.
- Padding/gap utilities are consistent but we should confirm they don’t change per slide. We may enforce dedicated tokens to guarantee uniform spacing.

## Recommendations
- Adjust banner layout to center-copy by leveraging `flex-col` on small screens and keeping `md:flex-row` for larger widths while enforcing `text-center`.
- Reduce banner impact on layout by capping vertical padding/min-height, or decouple banner height from `--navbar-offset` by measuring nav sans banner if UX demands original hero height.
- Consider exposing a dedicated CSS custom property for the full navbar stack height so layouts can use base nav height for viewport calculations while still padding for the banner visually.
- Update slideshow overlay to compute typography classes based on content length (short/medium/long buckets), lowering font-size clamps and line-heights for longer strings.
- Keep overlay padding/gap tokens consistent across slides (e.g., shared constants) to prevent per-slide variation.
- Verify changes across breakpoints to ensure CTA buttons remain accessible and within viewport.
