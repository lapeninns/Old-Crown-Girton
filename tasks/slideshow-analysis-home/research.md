# Research — Home Slideshow Analysis

## Task Outline
- Map the full slideshow flow from the home page entry point through slide rendering.
- Extract architecture, state, events, data, and performance considerations for the existing implementation.
- Determine whether a non-framework (plain HTML/CSS/JS) variant exists in the repo; if absent, record that gap for later reporting.

## Codebase Recon
- Entry point: `components/ClientHomeContent.tsx:9-167` renders `<Showcase />` inside the hero section with progressive loading scaffolding.
- `components/slideshow/Showcase.tsx:5-7` simply instantiates `<Slideshow autoplay interval>` — all logic resides in `Slideshow.tsx`.
- Core implementation: `components/slideshow/Slideshow.tsx` (≈350 LOC) manages slide selection, autoplay, gestures, and animation using React state + Framer Motion.
- Slide presentation: `components/slideshow/Slide.tsx` handles image loading/fallback, text overlays, and CTA button orchestration.
- Slide data: `components/slideshow/slides.ts` exports an ordered array of slide definitions with image assets imported via the `@cimages` alias.
- Supporting utilities: `components/slideshow/useImagePreloader.ts` preloads neighbor images; `SlideshowDebugger.tsx` logs image performance in development; `SlideCTAButton.tsx` standardizes CTA buttons.

## Implementation Notes (React slideshow)
- **Architecture**: Single React component (Slideshow) orchestrates state; dedicated child components for slide rendering and CTA UI; utility hook for preloading.
- **State**: Local state tracks current + previous index (`index`, `prevIndex`, `showPrev`, `sessionSlides`) and uses refs for gesture capture and transition locking (`transitioningRef`, pointer coords).
- **Slides Selection**: On mount and when `slides` prop changes, `selectSessionSlides` ensures required slides appear and randomizes others while capping to 5 slides (`Slideshow.tsx:84-155`).
- **Autoplay / Timing**: `useEffect` schedules `requestAdvance(1)` respecting network/device heuristics and `prefers-reduced-motion` (`Slideshow.tsx:198-214`). Interval adjusts for low-bandwidth or reduced-motion contexts.
- **Navigation**: `goPrev/goNext` wrap modulo slide count and call `requestAdvance`; touch and mouse handlers detect swipe distance; Framer Motion’s `drag` fallback handles pointer drags (`Slideshow.tsx:221-307`).
- **Animation**: Incoming/outgoing states defined via Framer Motion variants; crossfade achieved by layering previous slide with AnimatePresence while new slide mounts below (`Slideshow.tsx:134-347`).
- **Image Handling**: `Slide.tsx` normalizes primary/fallback sources, toggles to fallback on error, and drives opacity transitions off `imageLoaded`; overlay ensures contrast (`Slide.tsx:35-157`).
- **CTA Logic**: Slide index modulo 3 rotates button variants A/B/C to vary call-to-action emphasis (`Slide.tsx:67-133`); `SlideCTAButton.tsx` ensures accessible labels and external link handling.
- **Preloading**: Custom `useImagePreloader` keeps ahead/behind window of images (tuned by mobile/network heuristics) and exposes `waitFor` to block transitions until images decode (`Slideshow.tsx:157-195`).
- **Performance Optimizations**: Device/network sniffing adjusts preload counts and autoplay intervals; `requestAnimationFrame` gate prevents layout thrash; first slide uses `fetchPriority="high"`; overlay transitions avoid flashes; debug observer exists for dev profiling.
- **Edge Cases**: Transition guard prevents overlapping animations; modulo navigation handles wrap-around; fallback UI shows when slides array empty; image load failures trigger fallback or text placeholder.

## Plain HTML/CSS/JS Variant Search
- Repository scan (`rg --files -g '*.html' | xargs rg -n "slideshow"`) returned no non-React slideshow implementation. Existing logic appears exclusively React-based.

## Open Questions / Flags
- No standalone vanilla JS slideshow to analyze — need to clarify expectation (document this gap in final analysis).
- Confirm whether any other modules (e.g., `hooks/useSeamlessLoading.tsx`) influence slideshow behavior for completeness during planning.
