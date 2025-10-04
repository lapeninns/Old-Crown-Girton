# Research Notes: Homepage Slideshow

## Scope Definition
- Homepage hero renders `components/slideshow/Showcase.tsx`, which wraps `DaisyUISlideshow` inside a reusable `ErrorBoundary` with `SlideshowFallback`.
- `Showcase` is imported by `components/ClientHomeContent.tsx` within the home page (`app/page.tsx`).
- Other slideshow-related modules (`Slideshow.tsx`, custom hooks, preloader) coexist in the same directory but are not currently used by the homepage entry point.

## File & Module Inventory
- `components/slideshow/Showcase.tsx`: thin client component enabling autoplay (5s) and catching runtime errors.
- `components/slideshow/DaisyUISlideshow.tsx`: active implementation powering homepage hero.
- Supporting assets/data:
  - `components/slideshow/slides.ts`: default slide dataset (rich AVIF/JPEG imports, metadata, CTA config).
  - `components/slideshow/SlideshowFallback.tsx`: rendered when Showcase error boundary trips.
  - Legacy/unused-but-present: `Slideshow.tsx`, `Slide.tsx`, `SlideCTAButton.tsx`, `SlideshowDebugger.tsx`, `SlideshowSkeleton.tsx`, hooks (`useGestureHandling`, `useSlideNavigation`, `useLiveAnnouncements`, `useSlideshowVariant`), `useImagePreloader.ts`, `slides-old.ts`, `DaisyCarousel.tsx`.

## High-Level Behavior of `DaisyUISlideshow`
- Client component with local state: `currentIndex`, carousel ref, interval timer ref.
- Reads slide definitions from `slides.ts`, deriving `totalSlides` (12+) on load—no dynamic props beyond optional `autoplay` and `interval`.
- Navigation helpers: `goToSlide`, `nextSlide`, `prevSlide` ensure index bounds then perform smooth horizontal scroll (`scrollTo`) on the carousel container using its width for offset.
- Autoplay: `useEffect` sets `setInterval` to call `nextSlide`, cleared on cleanup. Hover pause implemented via `onMouseEnter`/`onMouseLeave` that clear/refill timer.
- Keyboard: Global `keydown` listener on `window` arrows to call next/prev.
- Rendering: Tailwind/DaisyUI classes for full-height hero (`h-screen`) using `next/image` with `fill`. Semi-transparent overlay for contrast, centered text block, optional badges and CTA buttons.
- Controls: Prev/Next arrow buttons (circle buttons with unicode arrows) and dot indicators updating `currentIndex`. Buttons share `btn` classes; dot uses custom styles.
- Accessibility aids: outer wrapper `role="region"` + `aria-label`, nav buttons have `aria-label`, dots `aria-current`, screen-reader live region (`aria-live="polite"`) announcing current slide.

## Observed Strengths
- Lightweight: 1 component, minimal dependencies; easier to reason about vs legacy complex carousel.
- Uses `next/image` with AVIF-first asset strategy, fallback detection inside `slides.ts` (structured data) though component itself only picks `primary` property.
- Provides keyboard navigation and hover pause.
- Live region exists for assistive tech updates.
- Error boundary ensures graceful fallback if slideshow throws.

## Observed Weaknesses / Potential Issues (to deepen in analysis)
- Timer uses `setInterval` without clearing on hover resume (creates new interval without storing handle? Timer ref updated, but leaving hover resets without clearing existing intervals -> potential stacking?). Need to verify: `handleMouseEnter` clears; `handleMouseLeave` sets new interval; but when leaving component the effect's cleanup should have cleared last interval; however handleMouseLeave doesn’t clear before setting new interval, so repeated mouse leave may create parallel intervals unless existing `autoplayTimerRef` pointer reused (it does not clear previous before new). Should assess.
- `goToSlide` relies on `carousel.offsetWidth`, meaning slides must match container width; responsive issues when using snap scroll? Also `currentIndex` state update asynchronous vs scroll, but fine.
- Scroll container uses `.carousel` classes from DaisyUI requiring CSS for scrollbar hidden; dot/arrow controls not tied to focus ring (lack explicit `focus-visible` styling).
- Global keyboard handler always active even when focus elsewhere (accessibility). No cleanup for pointer events aside from effect cleanup.
- No touch gesture support, no swipe threshold customizing.
- No virtualization or preloading beyond Next Image defaults; heavy asset list (~12 slides) each `Image` component in DOM simultaneously.
- Autoplay interval fixed to prop; no dynamic user control.
- Layout uses `h-screen` causing mobile viewport issues (URL bars) maybe using `svh` would be better.
- Tab order: dot buttons 12+; but `carousel` scroller not focusable; arrow buttons not hidden; dot focus states rely on Tailwind base.
- Performance: All slides render simultaneously; each `next/image` `priority` only for first, others load lazily but still in DOM; scroll-based navigation may trigger layout thrash.
- `slides.ts` large static imports -> bundler cost; each slide includes two images (AVIF + fallback). Need to mention bundling/perf.

## External Dependencies & Styling
- Relies on Tailwind CSS + DaisyUI (class names like `btn`, `carousel`) – DaisyUI plugin expected elsewhere.
- `next/image` for optimized images; no third-party carousel libs.
- `ErrorBoundary` custom class component.
- Fallback uses plain React component.

## Testing & Tooling Context
- No dedicated tests found for slideshow components (`rg` for `Slideshow` in tests yields nothing). Need to mention.
- No storybook present.

## Questions/Clarifications (if needed)
- Should analysis also cover unused advanced `Slideshow.tsx`? (For now treat as reference/tech debt).

