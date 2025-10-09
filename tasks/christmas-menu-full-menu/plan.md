# Plan – Christmas Menu Full Menu

## Goals
- Replace the "coming soon" experience on `/christmas-menu` with the full 2025 festive menu supplied by the user.
- Preserve existing page theming and accessibility patterns while introducing structured menu sections for both the multi-course offering and the chef selections bundle.
- Ensure metadata, schema.org markup, and call-to-actions reflect the menu being available to book now.

## Implementation Steps
1. **Model the menu data**
   - Define TypeScript-friendly constants for:
     - `FULL_CHRISTMAS_MENU` with description, sections (Starters, Mains, Sides, Desserts), footer content.
     - `CHEF_SELECTIONS` with description, items list, drink offer, price per person.
   - Each menu item should include `name`, `description`, optional `id`, and placeholder price objects only if required by consuming components (set to `{ amount: 0, currency: "GBP" }` when absent and hide visually).

2. **Update the hero & intro copy**
   - Swap "coming soon" messaging for language announcing the 2025 festive menu is ready to reserve.
   - Keep CTA buttons (online booking + phone) but adjust supporting text to emphasise limited availability rather than pre-launch interest.

3. **Render full menu sections**
   - Introduce a new section after the hero that:
     - Shows the overall description ("Build your festive feast…") and uses accessible headings/aria attributes.
     - Renders four sub-sections (Starters, Mains, Sides, Desserts) in responsive grids; reuse existing styling patterns (`grid gap-6`, cards with accent headers) inspired by `MenuSections` and wakes page highlight cards.
     - Include the footer note from the menu data (Experience, Location, Contact, Notes) using semantic elements (`dl` or `address`) with required non-breaking spaces for typographic polish (`01223&nbsp;277217`).

4. **Render Chef’s Christmas Selections block**
   - Add a dedicated section with heading, description, list of included dishes, and drink offer callout.
   - Surface the price `£44.99 per person` prominently; ensure accessible markup (e.g., `<p>` with `aria-live` polite?).
   - Optionally provide a link or CTA aligning with existing booking buttons (reuse MotionLinkButton or Link as secondary CTA).

5. **Refresh structured data & metadata**
   - Replace the current `Event` schema with a `Menu` schema featuring `hasMenuSection` arrays mirroring the new menu data plus a separate `Offer` for the chef selection price.
   - Update metadata description to reflect live festive menu availability (no longer "coming soon").

6. **Accessibility and motion safeguards**
   - Retain the existing `prefers-reduced-motion` style block.
   - For each new section, use `aria-labelledby` pointing to unique headings, maintain focusable CTA buttons with `focus-visible` rings, and ensure list semantics for menu items (`role="list"`/`listitem` or `<ul>`/`<li>`).

7. **Verification**
   - Run `npm run lint` to ensure no TypeScript/ESLint errors.
   - Manually review the rendered JSX for accessible semantics (headings order, aria labels, visible focus).

## Out of Scope / Questions
- No pricing provided for the multi-course menu; assuming we intentionally omit price displays.
- No imagery supplied; cards will remain text-only.
- Confirm whether to keep highlight cards/assurance section; default plan leaves them intact unless they clash with new layout.
