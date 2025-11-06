# Research: Christmas Menu Download CTA

## Initial Requirements

- Add a prominent call-to-action on `/christmas-menu` so guests can download the festive menu PDF.
- Reuse the provided `OldCrownMenu-01.pdf`, but store it in an organised public location suitable for static serving.
- Ensure the link triggers a direct download with a sensible filename for users.

## Existing Patterns

- `app/takeaway-menu/page.tsx` uses a hero CTA with an anchored link to a static asset kept under `public/takeaway-menu/`, applying similar styling and a `download` attribute.
- Static documents already live inside `public/documents/` (e.g. `old-crown-girton-takeaway-menu.pdf`), suggesting this as the right home for menu PDFs.
- `MotionLinkButton` from `components/animations/MotionWrappers.tsx` accepts `download`, `target`, and `rel` props, allowing animated CTA buttons that still operate as regular anchors.

## Technical Constraints & Notes

- `/christmas-menu` is a Next.js App Router page (`app/christmas-menu/page.tsx`) wrapped in `RestaurantLayout` and uses `FadeIn`/`FadeInUp` motion wrappers for staged hero content.
- Buttons in the hero already employ `MotionLinkButton`; adding another should maintain consistent interaction patterns.
- Accessibility standards from `AGENTS.md` require visible focus rings, keyboard navigation support, and meaningful accessible names.
- Static assets served from `public` are cacheable via Next.js; moving the PDF there avoids bundler involvement.

## Open Questions

- Exact placement of the download CTA (hero vs. lower on page). Hero placement alongside booking CTAs seems most discoverable and mirrors the takeaway page.
- Preferred download filename; propose `old-crown-girton-christmas-menu.pdf` for consistency.

## Recommendations

- Move `OldCrownMenu-01.pdf` into `public/documents/` and rename to a descriptive kebab-case filename.
- Introduce `const CHRISTMAS_MENU_PDF_PATH = "/documents/old-crown-girton-christmas-menu.pdf"` near the top of the page module.
- Add a new hero CTA using `MotionLinkButton` with emoji iconography and `download` attribute, ensuring spacing works for mobile-first layout.
- Optionally provide a secondary reassurance line (e.g. contact info if download fails) if space permits.

