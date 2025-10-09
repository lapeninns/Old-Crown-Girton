# Research – DaisyUI manual swipe desync

## Problem observations
- `components/slideshow/DaisyUISlideshow.tsx` drives navigation from a `currentIndex` state that is only changed via button handlers / autoplay helpers. Touch or mouse swipes scroll the `div.carousel` but never update `currentIndex`, so after a manual swipe `currentIndex` is stale.
- Autoplay (`startAutoplay` interval) continues while the user swipes. When the interval ticks it calls `advanceSlide`, which uses the stale `currentIndex` and snaps the carousel back toward that index, producing the jump.
- Pause-on-hover (`onMouseEnter`) does not cover touch or pointer interactions, so mobile users always fight against the interval.
- Follow-up user feedback: the request is to restore bounce-style autoplay (1 → 2 → … → N → N-1 → … → 1) while keeping manual swipe smoothness. The current scroll-listener prototype feels slow and changes the wrap behaviour to hard-loop (N → 1), which is undesirable.

## Relevant implementation details
- Scroll positioning relies on `scrollToSlide(index)` which multiplies the carousel width by `index` and calls `scrollTo`. Manual swipes change `scrollLeft` without touching React state. Ref: `components/slideshow/DaisyUISlideshow.tsx:200-213`.
- Indicators (`sessionSlides.map` dots) and the aria-live region read from `currentIndex`, so the desync also affects accessibility feedback.
- No `scroll` listener exists today; the DaisyUI carousel relies on native scroll snap (`snap-x snap-mandatory`).

## Existing patterns to reuse
- We already pause autoplay on hover by calling `stopAutoplay` / `startAutoplay` in mouse handlers (`components/slideshow/DaisyUISlideshow.tsx:243-258`). We can mirror that behaviour for pointer/touch start & end, using the same helpers.
- Other components (e.g. `components/restaurant/AutoMarquee.tsx`) manage animation ticks via refs and requestAnimationFrame to stay in sync with DOM state. Pattern: check DOM measurement, update state only when values change.

## External references / best practices
- Carousels that mix autoplay with manual scroll typically debounce `scroll` events and round `scrollLeft / slideWidth` to derive the active index. Using `requestAnimationFrame` or a micro task avoids excessive state updates while the user is mid-drag.
- Pointer events (`pointerdown` / `pointerup` / `pointercancel`) provide a unified way to detect both mouse drags and touch swipes, letting us pause autoplay and resume after the gesture settles.

## Risks / constraints
- Updating `currentIndex` from scroll must avoid feedback loops: only set state when the rounded index differs from the current value.
- Need to guard against `clientWidth === 0` during resize and ensure `scrollLeft` uses `Math.round` to respect scroll snap rounding.
- Restarting autoplay immediately on pointer up can clash with inertial scrolling; better to delay slightly or wait for scroll position to settle (e.g. via `setTimeout`).
