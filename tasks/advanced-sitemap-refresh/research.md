# Research – Advanced Sitemap Refresh

## Current sitemap implementation
- Located at `app/sitemap.ts`; defines static arrays for top-level pages and blog posts, merging into a single list sorted by priority.
- `BASE_URL` pulled from `NEXT_PUBLIC_BASE_URL` with fallback to production domain.
- No automated inclusion of new event subpages (`/events/curry-and-carols` missing).
- Lacks segmentation for event-specific pages or automatic timestamps beyond manual `new Date` assignments.

## Potential enhancements (“advanced methods”)
- Introduce helper to build entries consistently (centralised `createEntry` function).
- Automatically include event landing pages via configuration array, enabling easier future additions.
- Provide structured change frequencies per page type and dynamic `lastModified` (e.g., use `new Date()` or relative offsets) to signal freshness for seasonal promos like Curry & Carols.
- Add image/alternate data not currently used; Next.js sitemap supports alternate languages; not available now—can keep placeholder for future but ensure structure supports extension.
- Could add detection for environment base URL; already handled.

## Additional pages to include
- `/events/curry-and-carols` (new page), high seasonal priority (0.9) with weekly change frequency until event passes.
- `/events` retains existing entry.
- Check if other event-related pages exist (use `find app/events -maxdepth 2 -type f -name 'page.tsx'`).
 EOF
