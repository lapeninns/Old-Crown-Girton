# Implementation Plan: Website Performance Audit

## Objective
Evaluate runtime performance across all public pages of the Restaurant_BP Next.js site by running Chrome DevTools performance traces and documenting bottlenecks plus cross-page trends.

## Success Criteria
- [ ] Every page under `app/**/page.tsx` visited with cache disabled.
- [ ] `performance_start_trace` collected per page covering initial load and first viewport interactions.
- [ ] Findings captured per page (key metrics, notable issues, suggested follow-ups).
- [ ] Cross-cutting recommendations distilled for future optimization work.

## Architecture & Tooling Strategy
- **Runtime Target**: Local Next.js dev server via `npm run dev` (port 3000). If results differ from prod expectations, note in findings.
- **Profiling Tool**: Chrome DevTools MCP `performance_start_trace` / `performance_stop_trace` / `performance_analyze_insight` for each route.
- **Navigation Flow**: Use DevTools to open new tab for each route to avoid stale state; ensure network throttling (Fast 3G + 4x CPU) applied for worst-case scenario and repeat with no throttling if necessary.
- **Data Capture**: After each trace, download or screenshot summary metrics (if MCP supports) or record metrics manually (LCP, CLS, TBT, scripting time, long tasks, layout shifts, network waterfalls).

## Page Inventory & Prioritization
- **Marketing Core**: `/`, `/menu`, `/book-a-table`, `/takeaway-menu`, `/wakes-menu`, `/christmas-menu`, `/curry-and-carols-menu`, `/events`, `/events/curry-and-carols`, `/contact`, `/about`.
- **Content/Blog**: `/blog`, plus each article route (10 entries).
- **Utility/Policy**: `/menu-information`, `/press`, `/privacy-policy`, `/tos`, `/offline`, `/test-hours`, `/cls-optimized`.
- Verify no dynamic segments requiring params beyond listed pages.

## Data Flow for Profiling
1. Launch dev server.
2. Open Chrome DevTools MCP session targeting `http://localhost:3000`.
3. For each route:
   - Navigate directly via URL.
   - Clear storage/cache via DevTools if supported.
   - Start performance trace just before page load completes (or reload while tracing to capture navigation).
   - Interact minimally (scroll to hero/first interactive component) while tracing.
   - Stop trace after 8-10 seconds; note metrics + visible long tasks.
4. Append findings to `verification.md` (per instructions) and summarise for final response.

## Testing & Validation Strategy
- Manual: Chrome DevTools Performance panel (record traces, inspect main thread, layout, network).
- Accessibility/Console: note any console warnings or errors discovered during traces.
- Optional: Use Lighthouse within DevTools if time allows for cross-checking metrics.

## Edge Cases & Considerations
- Ensure blog article pages with large content or media do not cause layout shifts.
- Validate offline page by toggling DevTools network offline before trace.
- Watch for heavy scripts from third-party embeds (analytics, Crisp chat, Stripe) that may behave differently in dev.
- Document if dev-mode React instrumentation inflates timings vs. expected prod metrics.

## Rollout / Deliverables
- Deliver consolidated performance observations (per page + global) via `verification.md` and final assistant message.
- Highlight top areas needing optimization, grouped by severity (critical, major, minor).
- Suggest follow-up actions (code-level or asset-level) for future tasks.
