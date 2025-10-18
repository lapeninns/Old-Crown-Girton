# Research: Homepage Slideshow Seasonal Slides

## Existing Patterns
- `components/slideshow/DaisyUISlideshow.tsx` sources slide data from `components/slideshow/slides.ts` and automatically rotates CTA variants (`book`, `call-takeaway`, `call-booking`) based on slide index.
- Required slides are controlled by the `REQUIRED_SLIDE_IDS` set (currently `slide-ev-charging` and `slide-11`) so they always appear amongst the 5-session rotation.
- Slide assets live under `src/assets/images/components/Slideshow/*` and are imported via the `@cimages` path alias to feed `next/image`.
- CTA buttons come from `SlideCTAButton.tsx`, which renders a Link/anchor with iconography driven by the `variant` key.

## External Resources
- No external documentation needed beyond existing project components. Conversions can be handled locally with `ffmpeg` if we need AVIF assets from the root-level PNGs.

## Technical Constraints
- `Slide` type presently only supports `bookUrl` and `callTel` on `ctas`. We must add `menuUrl` support for the requested CTA combination.
- Carousel session is capped at 5 slides unless we update `SESSION_SLIDE_COUNT`. Making additional slides “permanent” requires adjusting `REQUIRED_SLIDE_IDS`.
- Images should follow existing pattern (primary AVIF + fallback PNG/JPEG) for optimal loading with `next/image`.

## Findings & Considerations
- Root directory holds `Christmas.png` and `Curry&carols.png`; they need to be moved/converted into the slideshow asset tree to keep import conventions consistent.
- The Christmas menu page (`app/christmas-menu/page.tsx`) offers strong headline and copy that can be repurposed for slide eyebrow/headline/body content.
- The Curry & Carols event page (`app/events/curry-and-carols/page.tsx`) features messaging about the dates, pricing, and experience—ideal for the second slide’s narrative.
- Existing slides all reuse the same booking URL and phone number; new slides should follow this formatting while replacing the booking CTA with a menu CTA link.

## Recommendations
- Extend `Slide` CTAs with a `menuUrl` property and introduce a `menu` CTA variant (`View Menu`) inside `SlideCTAButton`.
- Update `getCTAConfig` to prioritise `menuUrl` when present (paired with `callTel`), otherwise retain previous rotation logic to avoid regressions.
- Convert the seasonal PNG assets to AVIF (keeping PNG as fallback), place them under `src/assets/images/components/Slideshow/seasonal/`, and import them in `slides.ts`.
- Add two new slide objects (`slide-christmas-2025`, `slide-curry-carols-2025`) using copy distilled from their respective pages, and mark them as required while removing the previous required slides so the session still surfaces five unique cards.
- Ensure CTA links use `tel:+441223 277217` for calls and `/christmas-menu` or `/menu` (depending on slide) for the menu button.
