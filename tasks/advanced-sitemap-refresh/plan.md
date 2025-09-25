# Plan – Advanced Sitemap Refresh

## Goal
Enhance `app/sitemap.ts` to incorporate new Curry & Carols event page and apply more maintainable, extensible generation logic.

## Steps
1. **Assess current page coverage**
   - Review existing arrays for static and blog entries, confirm missing event slugs (notably `/events/curry-and-carols`).

2. **Refactor sitemap builder**
   - Introduce typed helper `createEntry` to simplify object creation and allow default values for `changeFrequency` and `priority` by page category.
   - Define structured groups (`corePages`, `eventPages`, `blogPages`, etc.) using the helper for clarity and easy future edits.
   - Set dynamic dates for seasonal/event pages (use `currentDate` or targeted `new Date('2025-12-16')`) to reflect freshness.

3. **Add Curry & Carols entry**
   - Within new `eventPages` group, include `/events/curry-and-carols` with `changeFrequency: 'weekly'`, `priority: 0.88`, `lastModified: currentDate`.
   - Keep `/events` hub entry with appropriate metadata.

4. **Combine and sort**
   - Merge groups into final array, ensure sorting by priority remains.
   - Optionally deduplicate using a `Map` keyed by URL to prevent accidental duplicates.

5. **Verification**
   - Run `npm run lint` to ensure no new lint errors (acknowledging existing warnings elsewhere).
   - Update `tasks/advanced-sitemap-refresh/verification.md` with results and any manual checks (e.g., inspect generated entries via console if necessary).
