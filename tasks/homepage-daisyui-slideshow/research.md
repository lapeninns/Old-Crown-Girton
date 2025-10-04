# Research Notes: DaisyUI Slideshow Replacement

## Current Implementation
- `Showcase.tsx` wraps `DaisyUISlideshow` inside an `ErrorBoundary`, passing `autoplay` and `interval` props.
- `DaisyUISlideshow.tsx` implements a bespoke slider using React state, timers, keyboard listeners, and smooth scroll to move through slides.
- Slide data (image imports, copy, CTAs) resides in `components/slideshow/slides.ts`.

## Target Reference
- User provided DaisyUI carousel sample: static markup with `div.carousel` and anchor-based navigation, no React state or autoplay.
- Sample relies solely on DaisyUI classes (`carousel`, `carousel-item`, `btn btn-circle`) and `href="#slideX"` anchors for navigation.

## Considerations for Replacement
- Need to integrate DaisyUI anchor-based pattern while continuing to use existing slide assets and alt text.
- Should preserve previous hero sizing (e.g., `h-screen`) unless instructed otherwise.
- `Showcase` currently expects `DaisyUISlideshow` to accept `autoplay`/`interval`; component should keep props to avoid breaking call sites, even if ignored.
- Accessibility: add `aria-label` to navigation buttons since anchors contain glyphs.
- Ensure IDs generated for slides remain unique (`slide-1`, `slide-2`, ...).
