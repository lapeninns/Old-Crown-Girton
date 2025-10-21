# Research: Website Performance Audit

## Initial Requirements
- Investigate runtime performance of the marketing site across every routed page in the Next.js app.
- Capture Chrome DevTools performance traces (`performance_start_trace`) for each page view to quantify loading, scripting, and rendering costs.
- Surface recurring bottlenecks (long tasks, layout shifts, large scripting costs, repeated data fetching, etc.) and relate them to code locations when possible.

## Success Criteria
- DevTools performance trace collected for each page route exposed under `app/`.
- Documented metrics and qualitative findings per page (LCP candidate, scripting hotspots, layout shifts, blocking resources).
- Identified cross-cutting issues and existing mitigation patterns.
- Ready inputs for a remediation plan (e.g., prioritised list of optimizations).

## Existing Patterns & Tooling
- `components/performance/PerformanceMonitor.tsx` provides dev-only frame drop + scroll jank instrumentation; can reference its logs while profiling.
- Extensive scroll/animation optimization guidance in `docs/SCROLL_PERFORMANCE.md`, including recommended hooks like `usePerformantMountAnimation` and motion wrappers (`components/motion/DynamicMotion`).
- Progressive loading + content modularization guidance in `docs/PROGRESSIVE_LOADING_GUIDE.md` and `docs/MODULAR-CONTENT-*` documents describe lazy-loading, caching, and performance telemetry capabilities.
- `scripts/performance-monitor.js` (from package scripts) may offer additional automated monitoring to consult for thresholds.
- DaisyUI/Tailwind-based components likely share styling via existing design system (`design-system/`) that should already consider performance budgets.

## Technical Constraints & Context
- Next.js 14 App Router project (`app/` directory). Need to start dev server (`npm run dev`) locally for profiling.
- Manual QA requirements mandate using Chrome DevTools MCP tooling; traces must be run via `performance_start_trace` for each page.
- Site includes numerous marketing pages (home, menu variants, blog entries, contact, events, policy pages). Need systematic coverage to avoid omissions.
- Animations rely on Framer Motion (`framer-motion` dependency); ensure traces capture animation phases.
- Images optimized via Next Image & custom scripts (see `scripts/image-optimizer.js`, `docs/ENHANCED_MENU_IMPLEMENTATION.md` for menu page specifics).

## Recommendations & Approach Draft
- Start dev server in profiling mode (no unnecessary logging) and ensure caches reset between navigations to capture cold-load characteristics.
- Build master list of routes using `find app -name page.tsx` and map to expected URLs.
- For each page: load with cache disabled, run `performance_start_trace` for ~10s covering initial load + key interactions (scroll to hero, trigger animations), then analyse results (LCP, long tasks, total blocking time, layout shifts).
- Capture key findings in structured notes (per-page metrics table) to reuse in plan + verification phases.
- Watch for shared issues (e.g., heavy hero videos, large image payloads) that could be optimized globally (image compression, code-splitting).
- Validate results against existing performance docs to confirm whether hotspots already have recommended fixes or require new work.

## Open Questions
- Should traces target production build (`next build && next start`) or development server? (Assuming dev server acceptable for investigation unless specified otherwise.)
- Are there authenticated routes requiring sign-in? None observed under `app/` but confirm during navigation.
- Any environment flags (e.g., `NEXT_PUBLIC_*`) needed to mirror production performance characteristics?

