# Research: Homepage Slideshow Viewport Alignment

## User Goal
- Ensure homepage slideshow slides remain visually aligned within a consistent viewport height across all breakpoints (small → extra-large).
- Typography and spacing must adapt responsively so long/short copy reads well without overflow, keeping accessibility + balance.

## Current Implementation Snapshot
- Hero rendered via `components/slideshow/Showcase.tsx` → wraps `DaisyUISlideshow` with autoplay (5 s) protected by `ErrorBoundary` + fallback.
- `components/slideshow/DaisyUISlideshow.tsx`
  - Outer wrapper `div` has `relative w-full h-[57.6svh] md:h-[62.4svh] lg:h-[67.2svh] overflow-hidden`.
    - Fixed svh tiers mean ~58–67% viewport height; however inner content padding (`py-6 sm:py-10 lg:py-12`) + multiline copy can exceed the hard height → text + CTA stack risk clipping, especially when badges + two buttons render.
    - `overflow-hidden` on the container will hide anything taller than the viewport assignment rather than expanding.
  - Slide content block: `flex items-center justify-center w-full h-full px-6 sm:px-8`.
    - Inner card `max-w-4xl mx-auto text-center text-white px-6 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12`.
    - Typography uses Tailwind step classes `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` for headlines, `text-base sm:text-lg md:text-xl` for body copy → abrupt jumps vs fluid scaling; large headings + generous line heights inflate vertical footprint.
  - CTA buttons clamp width with `truncate`, but vertical spacing (`gap-2 sm:gap-3 xl:gap-4`, `py-2.5 → md:py-4`) further stretches layout.
  - Badges block (`flex flex-wrap gap-2 mb-6 sm:mb-8`) adds height variance when present.
  - All slides render simultaneously (1 per `carousel-item`) with `absolute` image overlay + gradient; layout relies on DaisyUI `.carousel` horizontal snap.
- Slide data (`components/slideshow/slides.ts`) shows variable-length copy (1–3 sentences), optional badges, two CTA buttons by default, so total content height fluctuates meaningfully per slide.

## Existing Patterns / References
- Tailwind config extends breakpoints (`xxs`, `xs`, `sm480`, `fhd`, `uw3440`). Fluid typographic tokens defined globally in `app/globals.css` (`h1`/`h2` use `clamp`) but slideshow overrides with Tailwind utility classes instead of relying on element defaults.
- `SlideshowFallback.tsx` also sets explicit svh heights with padding, indicating precedent for viewport-based sizing but still susceptible to overflow if copy grows.
- Other hero sections (e.g., `AboutSection`, `MenuHighlights`) lean on container classes and fluid tokens; nothing else defines carousel-specific CSS helpers.
- Accessibility helpers include `styles/accessibility.css` (focus widths, large touch targets). Current slideshow uses `btn btn-circle` controls without custom focus-visible tokens; content announces via `aria-live` region already.

## Key Constraints / Considerations
- Must support keyboard & pointer interactions already in place; avoid breaking autoplay/pointer logic.
- Need consistent height without clipping: likely shift from fixed `h-[…svh]` to `min-h` + intrinsic content sizing (e.g., clamp-based vertical rhythm, allow safe padding while maintaining max height).
- Typography should move toward fluid `clamp()` values and consistent line heights to stabilise layout across breakpoints, aligning with global tokens.
- Spacing should compress on smaller viewports (hit targets ≥24 px; buttons currently meet requirement) while giving breathing room on large screens.
- Ensure focus styles remain visible (`:focus-visible` rings on controls/buttons) and maintain accessible color contrast over gradients.
- Slides share gradient overlay + centered column; adjusting layout will need to preserve overlay and maintain responsive padding respecting safe areas.

## Open Questions / Follow-Ups
- Whether we should cap content width more aggressively on ultra-wide screens (currently `max-w-4xl`).
- Confirm if badges are required on every slide; their presence adds height jitter. (Assume yes for now.)
- Determine acceptable minimum hero height on very small devices (currently ~58 svh). User emphasized covering "small devices to extra large"; may need custom breakpoints beyond md/lg to fhd/uw.

