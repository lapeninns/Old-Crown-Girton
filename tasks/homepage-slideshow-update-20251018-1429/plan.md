# Implementation Plan: Homepage Slideshow Seasonal Slides

## Objective
Introduce permanent Christmas and Curry & Carols slides into the homepage slideshow, reusing messaging/images from their dedicated pages and ensuring each slide surfaces call and menu CTAs.

## Success Criteria
- [ ] Christmas and Curry & Carols slides always appear within the slideshow session rotation.
- [ ] Seasonal slides display imagery sourced from the root PNG assets (converted for `next/image` best practices).
- [ ] Each new slide includes functional CTAs: one `tel:` call button and one menu link.
- [ ] Existing slides retain previous behaviour with no console/runtime errors.

## Architecture

### Components
- `components/slideshow/slides.ts`: add new slide definitions and update required slide IDs.
- `components/slideshow/DaisyUISlideshow.tsx`: adjust CTA resolver to support menu links and new required set.
- `components/slideshow/SlideCTAButton.tsx`: add `menu` variant styling/text.
- `components/slideshow/types.ts`: extend `ctas` type to include `menuUrl`.

### Assets
- Convert `Christmas.png` and `Curry&carols.png` to AVIF (keep PNG fallbacks) and place both formats under `src/assets/images/components/Slideshow/seasonal/`.

## Data Flow
- Slideshow consumes `slides` array; new slide objects will carry `menuUrl` property.
- `getCTAConfig` will detect `menuUrl` and return deterministic CTA ordering (`menu` + `call`).

## API Contracts
- No external APIs. Internal CTA variant contract expands with a `menu` option.

## UI/UX Considerations
- Maintain existing typography, badges, and DaisyUI styling for visual consistency.
- Ensure CTA ordering respects mobile-first layout (stacked buttons) and accessibility (aria labels handled in button component).
- Copy should be precise but concise to avoid overflow on smaller screens.

## Testing Strategy
- Unit/logic: rely on TypeScript type checks for new `menuUrl` and CTA variant coverage.
- Manual QA: confirm slides render, CTA buttons navigate correctly, and carousel still cycles.
- Accessibility: ensure buttons have descriptive aria labels and focus rings remain visible.
- Performance: verify AVIF conversions load and fallbacks exist.

## Edge Cases
- Slides lacking `menuUrl` should continue to display existing call/book CTA rotation.
- Missing seasonal assets should fall back to PNG without breaking the carousel.
- Ensure new required slide IDs do not exceed session count (5) to avoid empty optional slots.

## Rollout Plan
- Local verification (carousel render + DevTools checks).
- If feature flagged elsewhere, no additional rollout needed (slideshow loads by default).
- Monitor for regressions during next deployment preview.

## Implementation Steps
1. Convert seasonal root PNGs to AVIF and relocate both formats into the slideshow asset tree.
2. Update `Slide` types and CTA button component to support a `menu` variant.
3. Revise slideshow CTA resolver to prioritise menu+call when available and refresh required slide IDs.
4. Append new seasonal slide objects with imported assets/copy to `slides.ts`.
5. Run lint/build (if applicable) and perform manual QA via Chrome DevTools (carousel rendering, CTA behaviour, accessibility).
