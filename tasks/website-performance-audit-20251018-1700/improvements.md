# Performance Remediation Plan

## 1. Hero Media Optimization (High Impact)
- **Problem**: Marketing/blog pages delay Largest Contentful Paint by 400‑550 ms while Next Image discovers and renders hero assets.
- **Action**:
  - Add `priority` or `<link rel="preload">` for top-of-fold hero images.
  - Provide responsive `sizes` and audit `quality` to shrink transfer size.
- **Expected Outcome**: Reduce article LCP from ~700‑960 ms to <400 ms.

## 2. Fix Service Worker Registration (High Impact)
- **Problem**: `PWAUtils.tsx` logs “Service Worker registration failed” on every route, blocking offline caching and spamming the console.
- **Action**:
  - Review registration path (likely dev-only guard or path mismatch).
  - Add fallback logging with actionable context.
- **Expected Outcome**: Clean console, successful offline support, fewer main-thread blocks.

## 3. Defer Third-Party Analytics in Critical Path (High Impact)
- **Problem**: Vercel Analytics and Speed Insights execute during initial paint (even on `/offline`), adding scripting work to LCP window.
- **Action**:
  - Load analytics via `requestIdleCallback` / after `load` event or behind consent flag.
  - Skip entirely when `NODE_ENV !== 'production'` or when `navigator.onLine === false`.
- **Expected Outcome**: Lower main-thread contention and improved LCP/TBT.

## 4. Stabilize CLS Outliers (Medium Impact)
- **Problem**: `/test-hours` widget causes CLS ≈ 0.06; `/cls-optimized` demo still shifts ≈ 0.02 and references missing images.
- **Action**:
  - Reserve layout space or render placeholder skeleton before data arrives.
  - Restore assets for CLS demo or adjust to use existing media; verify zero shift.
- **Expected Outcome**: CLS ≤ 0.01 across specialty pages, demo credibility restored.

## 5. Offline Page Performance (Medium Impact)
- **Problem**: `/offline` page LCP ~463 ms despite being static; still loads analytics and other non-critical scripts.
- **Action**:
  - Strip analytics/3rd-party bundles from offline fallback.
  - Inline critical CSS and ensure hero content is lightweight.
- **Expected Outcome**: Faster recovery experience when users drop offline.

## 6. Instrumentation Hygiene (Low Impact, High Noise Reduction)
- **Problem**: `PerformanceProvider` and CLS observers warn about unsupported `buffered` flag and log verbose telemetry in production.
- **Action**:
  - Wrap dev-only instrumentation in `if (process.env.NODE_ENV === 'development')`.
  - Migrate to supported options or feature-detect before observing.
- **Expected Outcome**: Clean console, easier QA signal-to-noise.

## 7. External Booking CLS (Monitor Only)
- **Problem**: `/book-a-table` inherits 0.07 CLS from ToGo embed.
- **Action**:
  - Notify provider of layout shift; consider interim skeleton or transition screen.
- **Expected Outcome**: Mitigate external UX regression or document as dependency.

