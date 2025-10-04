# Plan: Wakes Menu Page & CTA

## Scope
- Create a dedicated `/wakes-menu` Next.js page presenting the wakes food offering with prices and add-ons.
- Add a prominent CTA on `/menu` (likely in `MenuHero.tsx`) linking to the new page without disrupting existing buttons.
- Maintain brand styling, accessibility (keyboard/focus, ARIA labels, reduced motion), and performance best practices.

## Implementation Steps
1. **Page Structure & Metadata**
   - Create `app/wakes-menu/page.tsx` using `RestaurantLayout`.
   - Use `getSEOTags` for metadata (title/description/keywords) mirroring takeaway-page pattern; include canonical to `/wakes-menu`.
   - Generate structured data via `renderSchemaTags` for menu items (bundle price + add-on) referencing `getContactInfo()`.

2. **Hero & CTA Section**
   - Build gradient hero similar to takeaway page with `FadeIn`/`FadeInUp` animations, introducing the wakes menu (headline, supporting copy, badges if useful).
   - Primary CTAs: `MotionLinkButton` linking to phone call (`tel:`) and maybe booking? Confirm requirements—minimum is informational hero with at least “Call to arrange” using contact number; include `Link` back to main menu.

3. **Menu Content Block**
   - Create accessible list/grid for items: highlight £10 wakes bundle combos (Egg & Mayo Sandwich, Bacon & Cheese Sandwich, Chicken Wings, Veg Samosa, Meat Samosa), note optional Chicken Pakora (+£2.50) and hot drinks.
   - Use semantic HTML (`section`, `article`, `dl` or `ul` with `li`s) with prices and description, ensuring min target sizes and focus states; align to brand card styling (rounded, border, background) referencing `takeaway` cards.
   - Provide price clarity (bundle price vs add-on) and dietary info placeholders if needed; ensure text handles long content.

4. **Menu Page CTA Update**
   - Update `app/menu/_components/MenuHero.tsx` to add a new button linking to `/wakes-menu` (probably before/after existing “Takeaway Menu” button). Ensure focus order and responsive layout remain intact.
   - Confirm button styling matches existing variants and meets hit-target requirements.

5. **Testing & Verification**
   - Run relevant lint/build command (`npm run lint` or `npm run typecheck` if lightweight) to ensure page compiles.
   - Manually review for TypeScript errors from new imports.
   - Verify `/menu` renders with new CTA and `/wakes-menu` page loads without runtime errors (via development run if feasible, otherwise static reasoning).

## Notes & Assumptions
- Phone/booking CTAs: reuse numbers/links from `getContactInfo()` or existing menu hero copy for consistency.
- No PDF asset provided, so content is inline; if future download needed, structure allows easy addition.
- Ensure hero supports reduced motion (existing wrappers comply) and maintain accessible color contrast.
