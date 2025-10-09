# Research – DaisyUI Slideshow wrapping

## Problem statement
- Current behaviour: `components/slideshow/DaisyUISlideshow.tsx` wraps by calling `scrollToSlide(0, 'smooth')` when moving from the last slide to the first (e.g. buttons/autoplay). Because the carousel is a plain horizontal scroll area, this animates back through every intermediate slide instead of appearing as a forward loop.
- Touch interactions rely on native scroll snap; when the user swipes past the last slide the browser snaps back to the start, producing the same backwards animation.

## Relevant implementation details
- `DaisyUISlideshow` renders `sessionSlides` directly without sentinel slides. Navigation helpers (`goToSlide`, `advanceSlide`) normalise indexes with modulo arithmetic and always call `scrollToSlide(normalized, behavior)` where `scrollToSlide` multiplies the index by `carousel.clientWidth`.  
  Ref: `components/slideshow/DaisyUISlideshow.tsx:195-267`.
- The component keeps autoplay state, manual controls, and aria-live updates; any change should preserve these behaviours.

## Existing patterns in the codebase
- `components/slideshow/Slideshow.tsx` (primary slideshow) uses an alternate, motion-based renderer with request/advance logic, but it is not built on the DaisyUI carousel and does not provide a drop-in infinite scroll pattern.
- `components/restaurant/AutoMarquee.tsx` implements a continuous marquee by duplicating the content (`duplicates` prop >= 2) and resetting the transform when reaching sentinel copies.  
  Ref: `components/restaurant/AutoMarquee.tsx:1-160`. This offers a precedent for cloning items to create seamless loops and for imperatively resetting scroll/transform.

## External tactics to consider
- Standard infinite carousel approach: render sentinel copies (`[last, ...slides, first]`), start the scroll position at the first real slide, and jump instantly to the matching real slide when the user reaches a sentinel. This keeps perceived motion direction consistent.
- Listen to `scroll` events (debounced with `requestAnimationFrame`) to update the active index after user-driven swipes, ensuring the UI state (dots, aria-live) stays in sync.

## Constraints & opportunities
- Need to honour existing autoplay/pause-on-hover logic; pausing should not break the loop.
- Must remain accessible: maintain focus management, button labels, aria-live announcements, and keep keyboard nav intact.
- Should remain compatible with reduced-motion users (currently relies on native smooth scrolling; consider falling back to `auto` when `prefers-reduced-motion` is set).
- The slideshow height/width is full viewport width; calculating slide width via `carousel.clientWidth` (already used) will work for sentinels as long as we keep them the same layout.
