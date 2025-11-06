# Implementation Plan: Christmas Menu Download CTA

## Objective

Enable guests visiting `/christmas-menu` to download the festive PDF menu quickly by introducing a clearly styled CTA in the hero and hosting the asset within the public documents directory.

## Success Criteria

- [ ] `OldCrownMenu-01.pdf` is stored under an organised `public` path with a descriptive filename.
- [ ] `/christmas-menu` renders a visible “Download” CTA that fits the existing hero layout on mobile and desktop.
- [ ] Clicking the CTA starts a download of the PDF (verified in the browser).
- [ ] Page maintains accessibility standards (focus styles, aria-label).

## Architecture & Data Flow

- No backend changes. Static asset served directly from Next.js `public` directory.
- Page module `app/christmas-menu/page.tsx` imports animation helpers and defines constants; we will add a new constant for the PDF path and reference it inside the hero CTA.
- Motion CTA leverages existing `MotionLinkButton` component (Framer Motion animated anchor).

## Component Breakdown

- `app/christmas-menu/page.tsx`
  - Add `CHRISTMAS_MENU_PDF_PATH` constant and optionally a `DOWNLOAD_FILENAME`.
  - Insert a third `MotionLinkButton` (or adjust layout) within the hero CTA stack.
- Static asset: move PDF into `public/documents/`.

## UI/UX Considerations

- Maintain mobile-first spacing: ensure stacked CTAs wrap gracefully (`flex-col sm:flex-row`).
- Pick emoji/icon consistent with brand (e.g. `⬇️` or `📄`).
- Provide accessible label `Download the Christmas menu`.
- Ensure button uses focus ring classes like existing CTAs.

## Testing Strategy

- Manual test in browser:
  - Load `/christmas-menu`.
  - Activate download CTA; confirm file downloads with expected name.
  - Keyboard focus order with Tab.
- Optional: check Lighthouse/console for regressions (as part of verification).

## Edge Cases

- Users with reduced motion: rely on existing motion wrappers respecting `prefers-reduced-motion`.
- Asset 404: ensure path correct; consider fallback message (not required now).

## Rollout Plan

- No feature flag; change is safe to deploy immediately.
- After deploy, monitor analytics or server logs for 404 on new PDF path.

