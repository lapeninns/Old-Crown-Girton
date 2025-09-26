# Research — Replace Homepage Slideshow with DaisyUI Carousel

## Code entry points & data flow
- The homepage (`app/page.tsx`) dynamically loads `ClientHomeContent` with SSR enabled and skeleton fallback (`app/page.tsx:6-47`).
- `ClientHomeContent` renders the hero showcase via `<Showcase />` inside the first `ProgressiveSection`, so swapping the slideshow affects above-the-fold layout (`components/ClientHomeContent.tsx:145-188`).
- `Showcase` is a thin wrapper that renders `<Slideshow autoplay interval={5000} />` within an error boundary (`components/slideshow/Showcase.tsx:6-13`).
- Slides data lives in `components/slideshow/slides.ts` (array of structured objects with id, image, alt, eyebrow, headline, copy, badges, and ctas). It imports AVIF/JPEG fallbacks via the `@cimages` alias (`components/slideshow/slides.ts:1-120`).

## Current slideshow implementation (must keep logic intact)
- `components/slideshow/Slideshow.tsx` drives everything: session slide selection, autoplay, reduced-motion handling, analytics, keyboard navigation, swipe gestures, and Framer Motion transitions (~650 LOC).
  - It derives a runtime config from network/device heuristics (`components/slideshow/Slideshow.tsx:46-141`).
  - Session slides are randomized with required IDs always included (`components/slideshow/Slideshow.tsx:142-213`).
  - Core state includes `index`, `prevIndex`, `isAutoplaying`, preload caches, and transition guards (`components/slideshow/Slideshow.tsx:214-370`).
  - Image preloading uses `useImagePreloader` and respects network priorities; we must keep the same hook usage (`components/slideshow/Slideshow.tsx:342-391`).
  - Navigation helpers `goToIndex`/`requestAdvance` queue transitions if another is in-flight; `useSlideNavigation` wires keyboard controls, and `useGestureHandling` wires swipe support (`components/slideshow/Slideshow.tsx:392-571`).
  - Autoplay timer respects `prefers-reduced-motion`, pause/resume, and `interval` prop (`components/slideshow/Slideshow.tsx:534-555`).
  - Rendering currently wraps everything in a `motion.div` with `aria-roledescription="carousel"`, a live region, skeleton overlay, and `Slide` component layering via `AnimatePresence` for outgoing frames (`components/slideshow/Slideshow.tsx:594-667`).
- Individual slide layout lives in `components/slideshow/Slide.tsx`, which:
  - Normalizes image sources to AVIF with fallback and uses `<Image fill>` with fade-in once loaded (`components/slideshow/Slide.tsx:1-112`).
  - Handles load errors with retry UI and uses dynamic CTA button pairing logic based on slide index modulo 3 (`components/slideshow/Slide.tsx:114-213`).
  - Provides overlay copy, badges, and CTA buttons with existing Tailwind classes; this markup should remain functionally unchanged.

## Existing styling & accessibility patterns
- Slideshow root adds keyboard instructions via visually hidden paragraph and announces changes through `useLiveAnnouncements` live region (`components/slideshow/Slideshow.tsx:609-618`).
- `Slide` component sets `aria-hidden` when rendered as `visualOnly` (for outgoing frame) and includes a `role="status"` span for image load state (`components/slideshow/Slide.tsx:121-205`).
- Current container uses Tailwind classes (`rounded-3xl`, focus rings, `touchAction: 'manipulation'`) but no DaisyUI classes yet.

## DaisyUI availability & patterns in repo
- Tailwind config already enables DaisyUI via `plugins: [require('daisyui')]` with light/dark themes; no extra setup required (`tailwind.config.js:1-205`).
- DaisyUI button classes (`btn`, `btn-primary`, etc.) are already used across the app (e.g., `app/offline/_components/OfflineActions.tsx`, `components/Hero.tsx`), so introducing carousel classes maintains consistency.
- No existing component currently uses the DaisyUI `carousel` class, so we must ensure new markup does not conflict with custom CSS.

## Observations / constraints for the conversion
- We must preserve the Framer Motion-driven transition logic, image preload, and live announcements. DaisyUI classes should wrap or augment existing elements without removing hooks/effects.
- The current implementation renders only the active and previous slide (for crossfade). DaisyUI’s default pattern expects all slides as siblings, so we’ll adapt by applying DaisyUI classes to the existing active/previous wrappers rather than reworking logic to render every slide at once.
- Navigation is currently keyboard + swipe + autoplay only (no visible prev/next buttons). If we surface DaisyUI arrow buttons, they must call `requestAdvance`/`goToIndex` without altering behavior; alternatively, keep controls hidden if parity requires it.
- Touch handling depends on `touchAction: 'manipulation'` on the motion root; DaisyUI defaults shouldn’t remove this attribute.
- Skeleton and debugger overlays rely on the root remaining `position: relative`; DaisyUI container must preserve stacking context.

## Risks / unknowns
- DaisyUI’s `.carousel` introduces `display: flex; overflow-x: scroll; scroll-snap` by default, which could conflict with the existing absolute/fixed positioning and Framer Motion drag gestures. We may need to override or contain the DaisyUI layout to avoid unintended scrolling.
- DaisyUI might apply `scroll-snap-type` causing focus/scroll jumps. Need to verify and potentially disable with `carousel-center` or custom utility classes if necessary.
- Snap-based anchor navigation in DaisyUI example uses hash navigation; we must keep existing controlled state instead of relying on anchor snapping.
- Tests snapshotting the slideshow (if any) will need updates once markup/classes change; currently no direct unit tests were found, but manual verification is essential.
