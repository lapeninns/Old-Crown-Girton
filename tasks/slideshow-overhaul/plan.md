# Plan — Slideshow Overhaul (SLIDE-001 → SLIDE-024)

## Guiding Principles
- Honour the provided Accessibility/Performance/Design rules using MUST/SHOULD/NEVER language in implementation notes.
- Reuse existing patterns/components (`ErrorBoundary`, `LoadingStates`, `NotificationToaster`, analytics utilities) rather than introducing parallel systems.
- Keep React client component boundaries stable to avoid re-render churn; prefer extracting hooks/utilities under `components/slideshow/hooks` and `components/slideshow/utils`.
- Every sprint concludes with explicit verification: unit/integration tests (jest or testing-library), performance smoke checks, lint/type pass, and manual keyboard/touch audits.

## Sprint 1 — Foundation & Quick Wins

### SLIDE-001 Keyboard Navigation
- MUST implement `useSlideNavigation` hook (under `components/slideshow/hooks/useSlideNavigation.ts`) managing:
  - ArrowLeft/ArrowRight for prev/next, Home/End jump, Space/Enter toggles autoplay.
  - Escape MUST stop autoplay and announce status via polite live region.
  - Hook exposes handlers + focus management helpers; integrate into `Slideshow.tsx` root container.
- SHOULD follow WAI-ARIA carousel APG: roving tab index for indicators (once added Sprint 3) and maintain focus trap only when controls open.
- Verification: unit tests mocking key events to assert correct callbacks; manual keyboard traversal.

### SLIDE-002 touch-action CSS
- MUST add `touch-action: manipulation` (or `pan-y` + `manipulation` combo) to slideshow wrapper via Tailwind/inline style; ensure hit targets ≥24px.
- Verification: lighthouse/mobile emulation to confirm no double-tap zoom.

### SLIDE-003 Reduced Motion Handling
- Expand `useReducedMotion` usage:
  - MUST provide user preference toggle (store in localStorage via `useState` + effect, accessible button) overriding system setting but defaulting to `prefers-reduced-motion`.
  - SHOULD expose toggle in controls panel (Sprint 3) to avoid clutter now; interim location near slideshow top-right.
  - Animation variants MUST skip translate transforms when reduced motion active.
- Verification: jest snapshot ensuring reduced-motion variant uses opacity-only; manual test with DevTools `prefers-reduced-motion`.

### SLIDE-004 ARIA Labels & Live Regions
- MUST set `role="group"` or `region` with descriptive `aria-roledescription="carousel"`, `aria-label` summarising content.
- MUST add status live region (polite, aria-atomic) describing current slide (e.g., “Slide 2 of 5: Headline”).
- SHOULD announce autoplay start/stop events.
- Implement `useLiveAnnouncements` util (can reuse Notification pattern) to centralise updates.

### SLIDE-005 Skeleton Loader
- Create `components/slideshow/SlideshowSkeleton.tsx` using existing design system tokens; MUST mirror final layout (image block + text placeholders) to avoid CLS.
- Integrate with progressive loading context (`LoadingStates` or new prop) to show until first image decoded & copy ready.

### SLIDE-006 Image Loading Indicators
- Extend `Slide.tsx` to expose loading spinner/“Loading…” skeleton overlay while `imageLoaded` false and error fallback with retry button (idempotent).
- MUST maintain accessible status updates via `aria-live` + `role="status"` without causing announcement spam.

### SLIDE-007 Extract Navigation Hook
- Implement `hooks/useSlideNavigation.ts` returning `{ goToNext, goToPrev, goToIndex, canGoPrev, canGoNext }` with internal modulo logic and guard against double transitions.
- Slideshow state should consume hook; MUST keep behaviour identical but easier to test.
- Add tests verifying wrap-around and transition guard toggles.

### SLIDE-008 Extract Gesture Handling Hook
- New `hooks/useGestureHandling.ts` encapsulating touch/mouse drag logic, velocity thresholds, and event binding cleanup.
- Hook returns props to spread on root container plus `isDragging` state; ensures shared threshold config.
- MUST prevent gesture conflicts with keyboard focus (don’t steal focus during drag).

### SLIDE-009 Error Boundaries
- Wrap `<Slideshow>` usage with `ErrorBoundary` using tailored fallback (`SlideshowFallback.tsx`) offering retry & support link.
- SHOULD log errors via existing analytics endpoint if available.

## Sprint 2 — Performance & Smart Loading

### SLIDE-010 Priority-Based Preloading
- Enhance `useImagePreloader` to accept priority map (current, next, prev) and queue; MUST preload next slide first, previous second, ahead slides low priority.
- Introduce `PriorityQueue` util (lightweight) to manage decode order.

### SLIDE-011 Connection-Aware Loading
- Integrate Network Information API: reduce preload distance & disable high-quality fetch on `save-data` or ≤3G.
- MUST expose hook return values so `Slideshow` can adapt interval & queue size; update analytics to log effectiveType for metrics.

### SLIDE-012 Non-blocking Transitions
- Refactor transition flow to start animation immediately while images load in background.
- MUST allow crossfade to begin regardless of load, but gracefully display placeholder overlay until decode resolves.
- Provide fallback for timeouts: after threshold, continue transition but keep spinner and mark image as pending.

### SLIDE-013 Transition Queuing
- Maintain queue of navigation intents; if user triggers multiple actions during transition, queue latest allowed after guard clears.
- MUST limit queue length (e.g., 2) to avoid backlog; drop stale events with announcement.

### SLIDE-014 Optimize Image Memory Usage
- Implement LRU cache within `useImagePreloader` storing decoded Image objects; MUST unload (delete references) for slides beyond window, relying on browser GC.
- Provide manual `dispose()` to clear on unmount.

### SLIDE-015 Preloader Cleanup
- Ensure `Image` objects use `AbortController` for fetch cancellation when slide exits window; remove event listeners to avoid leaks.
- Tests should mock AbortController to confirm `abort` called during cleanup.

### SLIDE-016 Performance Monitoring
- Hook into `performance.now()` deltas and `PerformanceObserver` to record load times; send via `lib/performance.ts` to `/api/analytics`.
- MUST expose dev console summary (toggleable) and optionally reroute to Vercel Analytics if enabled.

## Sprint 3 — Advanced Features & Polish

### SLIDE-017 Visibility-Based Autoplay
- Use `IntersectionObserver` (with fallback to `document.visibilityState`) to pause autoplay when slideshow off-screen or tab hidden.
- MUST restore autoplay respecting user preference (if user manually paused, don’t auto-resume).

### SLIDE-018 User Interaction Detection
- Pause autoplay on hover, focus within controls, or when pointer down; resume after configurable idle timeout when allowed.
- MUST announce state changes via live region.

### SLIDE-019 Autoplay Controls
- Surface control bar (Play/Pause toggle, progress indicator, reduced-motion toggle from Sprint 1).
- Controls MUST be keyboard-accessible, labelled, and maintain ≥24px targets; progress indicator SHOULD use ARIA `role="progressbar"`.

### SLIDE-020 Slide Indicators
- Add dot/thumbnail indicators with roving focus, `aria-controls`, and `aria-label` (e.g., “Go to slide 2: Headline”).
- MUST sync with keyboard navigation (Home/End/Tab) and maintain deep-link capability (update URL hash/query optional for Sprint 3 if feasible within time—log as stretch).

### SLIDE-021 Swipe Velocity
- Extend gesture hook to incorporate velocity-based navigation (fast swipes skip multiple slides) using momentum calculation capped to available slides.
- MUST respect reduced-motion (disable momentum leaps when reduced).

### SLIDE-022 Analytics
- Instrument events: slide change, autoplay toggles, errors, visibility changes.
- Use existing analytics endpoint (`/api/analytics`) with batching; MUST guard behind environment flag to avoid dev noise.

### SLIDE-023 A/B Testing Hooks
- Integrate feature-flag provider (reuse existing config or add lightweight context) so slideshow variants can toggle behaviours (e.g., autoplay interval, indicator style).
- Provide `useSlideshowVariant()` hook returning variant info consumed in components.

### SLIDE-024 Final Optimisation Pass
- Bundle audit: run `next build --profile`, evaluate chunk sizes (ensure <50 KB delta) and tree-shake unused features.
- Run lint, type-check, jest, vitest, Playwright smoke, Lighthouse (desktop/mobile) focusing on CWV.
- Document final metrics in `tasks/slideshow-overhaul/verification.md` (created in final step).

## Testing & Verification Strategy
- **Unit tests**: Expand jest coverage for hooks (`useSlideNavigation`, `useGestureHandling`, `useImagePreloader`, analytics dispatcher).
- **Integration**: Add React Testing Library tests for `Slideshow` verifying keyboard nav, live region updates, autoplay toggling.
- **E2E**: Update/author Playwright scenarios for keyboard + touch interactions, reduced motion, and autoplay controls.
- **Performance**: Script measuring image decode times and memory (Chrome DevTools protocol or `PerformanceObserver` logs) — log results during verification.
- **Accessibility**: Run axe-core (jest-axe or Playwright `page.evaluate`) to ensure no violations after new UI.

## Open Questions / Follow-ups
- Confirm location to surface reduced-motion toggle (control bar vs global settings). Will implement inline but flag for design review.
- Decide on storage for autoplay preference (localStorage vs server). Default to localStorage and note for future sync.
- Analytics payload schema: reuse existing shape from `lib/performance.ts` or define new? Plan to extend existing to avoid duplicate models.

