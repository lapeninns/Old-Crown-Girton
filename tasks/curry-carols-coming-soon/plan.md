# Plan – Curry & Carols Coming Soon Page

## Scope
Create a new marketing/event landing page at `/events/curry-and-carols` announcing the 2025 Curry & Carols event with coming-soon messaging, dates (16 & 17 December 2025), price (£35 per head), and a placeholder hero image area.

## Implementation steps
1. **Route setup**
   - Add folder `app/events/curry-and-carols/` with `page.tsx`.
   - Ensure the file exports Next.js metadata via `getSEOTags` and uses `RestaurantLayout`.

2. **SEO & structured data**
   - Configure `metadata` (title, description, keywords, canonical) tailored to the event.
   - Inject structured Event schema using `renderSchemaTags` and `SchemaInjector` (breadcrumb: Home → Events → Curry & Carols).
   - Include accurate event dates (`2025-12-16` to `2025-12-17`), location via `getContactInfo`, and price £35 in the schema.

3. **Hero & announcement section**
   - Build gradient hero similar to `christmas-menu` with `FadeIn` / `FadeInUp` wrappers.
   - Communicate "Curry & Carols" title, Coming Soon badge, event dates, price, and a short description referencing festive atmosphere.
   - Provide a primary CTA (e.g., link to general booking form or contact) and secondary "Stay tuned" message; ensure focus-visible styling and keyboard accessibility.
   - Add reduced-motion safeguard style block.

4. **Event details body**
   - Create sections for highlight bullets (e.g., Nepalese curry feast + live carols, price includes specifics, timings) using accessible cards with emoji icons (`aria-hidden` or `role="img"`).
   - Add a placeholder media block (e.g., `figure` with aspect ratio, dashed border, `aria-label`/sr-only text noting future image) that keeps layout intact.
   - Include FAQ or timeline style block to reiterate stay-tuned messaging and contact info (telephone/ email from `getContactInfo`).
   - Use `MotionLinkButton`/`MotionLinkButton` or simple `Link` for CTAs while respecting guidelines (touch target ≥24px, focus states, `aria-live` not required for static copy).

5. **Accessibility & finishing touches**
   - Ensure heading hierarchy (H1 for hero, H2/H3 for sections) and sections labelled using `aria-labelledby` when necessary.
   - Confirm text contrast with existing brand colors and include `aria-live` only if dynamic messaging (likely static, so omit).
   - Keep copy concise; include mention of limited seats and encourage sign-ups via contact.

## Verification
- Manual: Visit `/events/curry-and-carols` in dev to ensure layout loads without runtime errors.
- Automated (if time permits): run `npm run lint` for catch-all static analysis.
