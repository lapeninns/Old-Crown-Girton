# Plan: Book-a-Table Redirect Page

## Goal
Expose a `/book-a-table` route that instantly redirects visitors to the established Togo booking URL while providing basic metadata for SEO/context.

## Steps
1. **Create redirect page**
   - Add `app/book-a-table/page.tsx`.
   - Export metadata via `getSEOTags` (title, description, canonical `/book-a-table`).
   - Use `redirect()` from `next/navigation` inside the default export to send users to `https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true`.
   - Consider forwarding existing query parameters (not needed now; keep note in code comments if future campaigns arise).

2. **(Optional) Navigation updates**
   - Not required unless explicitly requested. Leave nav unchanged to avoid clutter; CTAs can link directly or to the new page if desired.

3. **Verification**
   - Ensure TypeScript compiles (page returns `never` from `redirect`).
   - Run `npm run lint` (acknowledge known unrelated lint failures).

## Risks / Notes
- If later CTA buttons point to `/book-a-table`, ensure they don’t already go to Togo directly to avoid mixing behaviours.
- For analytics, we may later append UTM parameters before redirecting; structure code so that can be extended easily.
