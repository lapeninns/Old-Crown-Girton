# Plan: Takeaway Menu Download Page

## Goal
Create a `/takeaway-menu` page where guests can instantly download the takeaway PDF and access supporting information (ordering instructions, contact details), aligned with existing branding and accessibility standards.

## Steps
1. **Page Setup**
   - Add `app/takeaway-menu/page.tsx` using `RestaurantLayout`.
   - Export metadata via `getSEOTags` with keywords around Cambridge/Girton takeaway, delivery, collection.
   - Inject simple JSON-LD describing the takeaway menu PDF via `renderSchemaTags` (type `Menu` or `CreativeWork`).

2. **Content Structure**
   - Hero section with title/subtitle, emphasising downloadable menu and CTA.
   - Primary CTA button linking to `/documents/takeaway-menu.pdf` with `download` attribute (`old-crown-takeaway-menu.pdf`).
   - Secondary CTA: call to order by phone (`tel:` link) or contact form.
   - Supporting section (3 cards/bullets) outlining ordering process, collection/delivery details, and allergen guidance.
   - Include note instructing staff where to place the PDF (so team knows to upload file later).

3. **Accessibility & Styling**
   - Maintain high-contrast gradient background akin to other pages (`bg-gradient-to-br from-brand-700 ...`).
   - Buttons with `focus-visible` rings, comfortable padding.
   - Provide sr-only text for icons, use `aria-live="polite"` optional for status message.

4. **Verification**
   - Run `npm run lint` (acknowledge unrelated repo errors).
   - Confirm download link path matches future upload expectations.
