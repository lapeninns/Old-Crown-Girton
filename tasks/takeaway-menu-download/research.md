# Research: Takeaway Menu Download Page

## Existing Pattern References
- Marketing pages use `RestaurantLayout` for consistent header/footer (e.g., `app/events/page.tsx`, `app/about/page.tsx`). We'll reuse it to keep typography and navigation aligned.
- Calls-to-action typically employ brand colors (`bg-brand-700`, `bg-accent-500`) with `focus-visible` rings to maintain accessibility (see navbar buttons and blog newsletter CTA).
- Static assets (images, PDFs) usually live under `public/`. Downloadable files can be linked directly: Next serves `/public/anything` at the same path without code changes.

## Download Link Behaviour
- Standard `<a>` elements with the `download` attribute prompt downloads (where browsers allow). Including descriptive filename improves UX: `download="old-crown-takeaway-menu.pdf"`.
- Since the PDF isn't uploaded yet, using a placeholder path (e.g., `/documents/takeaway-menu.pdf`) keeps implementation simple. Once the user adds the file to `public/documents/takeaway-menu.pdf`, the link will resolve.
- For SEO/accessibility, supply context text (e.g., file size/format) and fallback instructions if the download fails.

## Metadata & SEO
- `getSEOTags` should set keywords around takeaway/delivery for Cambridge/Girton insights.
- Structured data is optional here, but we can inject schema describing the takeaway menu as a `Menu` or `CreativeWork`. However, existing pattern relies on `renderSchemaTags` for custom JSON-LD when needed. We can provide a simple `Menu` schema referencing the PDF.

## Potential Enhancements
- Provide additional info: ordering process, contact numbers, hours, allergens, etc. Keep copy consistent with brand voice (warm, heritage-centric, informative).
- Include a secondary CTA (call to order) to encourage action if the PDF is unavailable.

## Risks / Edge Cases
- If the PDF path is wrong or file missing, download returns 404. To mitigate, include inline tip instructing to refresh or contact for menu—ensuring page still provides value.
- Ensure deep link works on mobile; large CTA button with >44px height meets touch target requirements.
