# Plan

1. **Improve caching/static generation**
   - Add ISR to home and menu pages (e.g., `export const revalidate = 300`) so content renders once per interval instead of per-request.
   - Confirm data loaders still function under ISR (filesystem cache already handles menu/content).

2. **Tighten hero/slideshow LCP behavior**
   - Ensure first slideshow image always preloads with high priority (`fetchPriority="high"`) and keep the crossfade logic tuned for quick swaps.
   - Verify no blocking animations occur before the hero renders.

3. **Menu page starter focus**
   - Update all site links pointing to `/menu` so they navigate to `/menu#starters`.
   - Default the interactive menu component to starters (already computed) and ensure hash navigation works on load.

4. **Verification**
   - Run lint/build after updates.
   - Recommend re-measuring LCP/TTFB post-deployment.
