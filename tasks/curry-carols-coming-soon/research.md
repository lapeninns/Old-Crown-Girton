# Research – Curry & Carols Coming Soon Page

## Codebase patterns relevant to event-style landing pages
- `RestaurantLayout` from `@/components/restaurant/Layout` wraps marketing pages (eg, `app/events/page.tsx`, `app/christmas-menu/page.tsx`) for consistent nav/footer.
- Motion helpers (`FadeIn`, `FadeInUp`, `MotionLinkButton`, `BouncyEmoji`) reside in `@/components/animations/MotionWrappers` and are used for hero badges, CTA buttons, and section reveals.
- SEO metadata is declared via `getSEOTags` in `@/libs/seo`; pages frequently export `metadata` and include structured data with `renderSchemaTags` and `SchemaInjector`.
- Contact/card details come from `getContactInfo()` (`@/lib/restaurantData`) to avoid hardcoding numbers, addresses.
- Existing "coming soon" page (`app/christmas-menu/page.tsx`) blends hero CTA, highlight cards, assurance lists, and uses animated badges with `aria` labelling for accessibility.
- Main events index (`app/events/page.tsx`) showcases content card grids with Tailwind, event highlights, focus states, emoji icons, and uses strong contrast backgrounds.

## Accessibility + UX baseline from repo & guidelines
- Focus-visible styling is already embedded in CTA components (`MotionLinkButton` classes include `focus-visible:ring`).
- Patterns emphasise semantic structure: headings in order, `<section>` with `aria-labelledby`, emoji provided as decorative with `aria-hidden` or `role="img"` when meaningful.
- Motion wrappers respect `prefers-reduced-motion` via global `<style>` injection (see `app/christmas-menu/page.tsx`).

## Assets & placeholders
- No dedicated image assets yet for Curry & Carols; placeholder can mirror Christmas menu approach (use `div` with gradient + `sr-only` caption or `aspect-[3/2]` block awaiting image).
- Public images live in `public/` and marketing hero backgrounds often rely on gradients rather than static assets.

## Considerations for new route
- Route convention: new pages live under `app/<slug>/page.tsx` or nested segments (`app/events/<event-slug>/page.tsx`). No existing dynamic `[slug]` route, so create folder `app/events/curry-and-carols/`.
- Need to add structured data for an event (dates 16 & 17 December 2025, price £35). See Christmas menu page for Schema example – adapt for specific dates/pricing.
- For placeholders, can pull contact CTAs (book table link/phone) or keep minimal if event not yet bookable; ensure call-to-actions align with "coming soon".

## Open questions / assumptions
- Assume hero copy should highlight "Curry & Carols" with Coming Soon messaging and December dates (16 & 17 December 2025, £35 per head).
- Assume no booking CTA yet; will include "Register interest" or "Check back soon"? Need to decide in plan – leaning toward interest CTA linking to contact form or general bookings.
- Placeholder image: use accessible `figure` with visually hidden caption instructing upcoming imagery.
