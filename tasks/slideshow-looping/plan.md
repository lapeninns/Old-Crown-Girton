# Plan – Seamless loop for DaisyUI slideshow

## Goal
Make `DaisyUISlideshow` feel like an infinite carousel: when advancing past the last slide (via autoplay, buttons, or swipe) it should continue forward into slide 1 without “rewinding” through intermediate slides. Maintain existing accessibility (aria-live, focus rings), autoplay controls, and reduced-motion considerations.

## Proposed approach
1. **Extend the rendered slide list**
   - Derive an `extendedSlides` collection via `useMemo`.
   - For `totalSlides > 1`, render `[lastSlide, ...sessionSlides, firstSlide]`. For 0/1 slides, keep the original list.
   - Adjust keys so sentinel clones still use stable IDs (e.g. `${slide.id}-clone-start`).

2. **Start the carousel on the first real slide**
   - When `extendedSlides` change, scroll instantly to extended index `1` (the first real slide) and set `currentIndex` to `0`.
   - Guard against `prefers-reduced-motion`: if reduced, keep `behavior: 'auto'` to avoid forced smooth scrolls.

3. **Refactor navigation helpers to operate on extended indexes**
   - Update `scrollToSlide` to accept extended indexes and compute `scrollLeft = width * extendedIndex`.
   - Create helper `getExtendedIndex(actualIndex)` returning `actualIndex + 1`.
   - When wrapping forward from last → first, scroll to `extendedIndex = totalSlides + 1` (clone of first); backward wrap uses `extendedIndex = 0`.
   - Immediately after reaching a sentinel (see step 4), jump back to the matching real slide with `behavior: 'instant'` (or `'auto'`).

4. **Synchronize on user scroll / sentinel detection**
   - Attach a `scroll` handler (throttled with `requestAnimationFrame`) to:
     - Compute the current extended index from `scrollLeft / slideWidth`.
     - If we’re at sentinel indexes (`0` or `totalSlides + 1`), reposition to the true slide (index `totalSlides` or `1`) with `behavior: 'instant'`, keeping the perceived position identical.
     - Otherwise, set `currentIndex = extendedIndex - 1` so dots/aria-live stay in sync during user swipes.
   - Maintain a ref that distinguishes programmatic smooth scrolling from user-driven scroll to avoid redundant state updates.

5. **Update controls & autoplay**
   - `advanceSlide` and `goToSlide` should use the helper from step 3 and keep the existing pause/resume flow.
   - Ensure autoplay uses `scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'` to align with accessibility guidance.

6. **Account for resize / layout shifts**
   - On resize (`resize` event + effect) re-run `scrollTo` with `'auto'` to maintain alignment.

## Verification
- Manual: click next/prev buttons across wrap boundaries (forward/back) and confirm direction stays consistent.
- Manual: swipe/drag on touch device emulator; ensure sentinel repositioning feels seamless.
- Manual: pause autoplay (hover) and resume; confirm wrap still works.
- Accessibility: verify dot buttons reflect active slide and aria-live announces the correct slide number after looping.
