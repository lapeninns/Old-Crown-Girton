# Research — Slideshow Overhaul

## Task Outline & Subtask Breakdown
- **Overall objective**: deliver every story across the three-sprint “React Slideshow Optimization” roadmap (SLIDE-001 → SLIDE-024) while satisfying the accessibility/performance rules supplied in the brief.
- **Sprint 1 focus** (Accessibility, Loading, Architecture):
  - Keyboard support, touch-action, reduced-motion strategy, ARIA/live region instrumentation.
  - Skeleton loader + progressive image status indicators.
  - Extract navigation & gesture hooks; introduce slideshow-specific error boundaries.
- **Sprint 2 focus** (Performance & Smart Loading):
  - Priority-based preloading tuned by connection quality, parallel transitions & queuing.
  - Memory/resource management: image eviction, AbortController cleanup, performance telemetry.
- **Sprint 3 focus** (Advanced UX & Production polish):
  - Visibility-aware autoplay, user interaction pauses, dedicated controls + slide indicators.
  - Swipe velocity handling, analytics & A/B hooks, final optimisation and audits.

## Existing Implementation Recon
- **Entrypoint composition**: `components/ClientHomeContent.tsx:9-167` orchestrates progressive loading and renders `<Showcase />`, which simply instantiates `<Slideshow autoplay interval>` (`components/slideshow/Showcase.tsx:5-7`).
- **Core slideshow logic**: `components/slideshow/Slideshow.tsx:1-348` already handles slide selection, autoplay timing, network-aware preloading, gesture detection (touch + mouse + framer-motion drag) and manages crossfade transitions.
- **Slide presentation**: `components/slideshow/Slide.tsx:1-174` controls image normalisation (primary/fallback AVIF/JPEG), CTA layout, and overlay transitions, with dynamic CTA pairing logic.
- **Image preloading**: `components/slideshow/useImagePreloader.ts:1-156` preloads neighbour images with decode gating, tracking `loaded`/`failed` states and exposing `waitFor(src)`.
- **Data source**: `components/slideshow/slides.ts` exports the slide catalogue with rich metadata (eyebrow/headline/copy/badges/CTAs) and ensures required slides appear.
- **Debug tooling**: `components/slideshow/SlideshowDebugger.tsx` uses `PerformanceObserver` to log slideshow image resource timings in dev.

## Patterns & Utilities to Reuse
- **Error boundaries**: `components/ErrorBoundary.tsx` already implements a reusable class-based boundary for wrapping slideshow (SLIDE-009).
- **Loading context**: `components/LoadingStates.tsx` & `hooks/useSeamlessLoading.tsx` provide progressive loading markers we can tap into for skeleton readiness signals (SLIDE-005/006).
- **Live region precedent**: `components/ui/Notifications.tsx:1-73` offers a pattern for shared polite live regions and screen-reader announcements (relevant for SLIDE-004, SLIDE-012 failure states, SLIDE-019 controls).
- **Analytics plumbing**: `/app/api/analytics/route.ts` and `components/StickyCallButton.tsx:108-149` showcase dispatch patterns we can reuse for slideshow analytics/feature-flag hooks (SLIDE-022/023).
- **Performance monitoring**: `lib/performance.ts:1-132` provides wrappers for custom metric dispatch (can integrate with slideshow metrics for SLIDE-016).

## Verification & External Guidance
- **Repo search tooling**: ripgrep (`rg`) confirmed slideshow-related assets and existing tasks (e.g., `tasks/slideshow-analysis-home` for prior investigation) ensuring we align with prior research.
- **Source inspection**: `sed -n` used to read critical files above, verifying code structure line-by-line.
- **Accessibility conformance reference**: Retrieved W3C ARIA carousel pattern via `curl https://www.w3.org/WAI/ARIA/apg/patterns/carousel/` (see raw HTML snapshot saved in terminal output) to cross-check the keyboard/support requirements for SLIDE-001/004.
- **Cross-check vs prior tasks**: Reviewed `tasks/slideshow-analysis-home/research.md` to ensure we incorporate historical findings and avoid duplicating work.

## Existing Strengths & Gaps
- **Strengths**:
  - Network-aware config already adjusts preload counts and autoplay interval (`Slideshow.tsx:42-105`).
  - `useImagePreloader` tracks loading state and exposes `waitFor` promise gating (foundation for SLIDE-010/011).
  - Touch + drag gestures partially implemented; we can extract into dedicated hook as per SLIDE-008.
  - Fallback UI for empty slides and error handling already present (`Slideshow.tsx:216`).
- **Gaps vs roadmap**:
  - No explicit keyboard controls, focus management, or live region announcements.
  - CSS lacks `touch-action: manipulation`; accessibility labels minimal (`role="region"` only).
  - Autoplay doesn’t pause on hover/focus/visibility and has no user controls.
  - No skeleton loader or loading indicators; preloading cache has no LRU eviction or AbortController cleanup.
  - Transition queuing & velocity-based navigation absent; analytics/performance dashboards not wired.
  - No slide indicator UI or A/B testing hooks.

## Risks, Unknowns, Alternative Angles
- **Scope risk**: Implementing all 24 stories touches multiple subsystems (hooks, UI, analytics). Need phased delivery and strong regression testing.
- **Potential hidden coupling**: Slideshow integrates with progressive loading context; extracting hooks must preserve behaviour. Will double-check via jest/vitest snapshots once hooks are modularised.
- **Animation dependencies**: heavy reliance on framer-motion—must ensure prefers-reduced-motion fallbacks remain when reworking transitions.
- **Performance budgets**: Additional controls/indicators risk DOM bloat; must measure bundle impact (use `npm run analyze` or `next build --profile` later).
- **Alternative approach**: consider splitting slideshow into state machine with XState for clarity; rejected for now to avoid new dependency, but we should keep architecture open.

## Next Steps
- Validate whether existing tests cover slideshow; if not, plan to introduce targeted unit/integration tests.
- During planning, map each SLIDE-### to concrete modules with reuse of identified patterns.
- Confirm progressive loading interplay when adding skeletons to avoid double placeholders.

