# Plan – Curry & Carols Highlight CTA on Events Page

1. **Identify insertion point**
   - Locate the Live Sports section in `app/events/page.tsx` and prepare to insert a new section immediately above it within the main content container.

2. **Build highlight section**
   - Create a `<section>` with gradient background and rounded container to spotlight the event.
   - Include a heading (`h2`), supporting copy detailing dates (16 & 17 December 2025) and price (£35 per guest), and a brief bullet/feature line.
   - Optionally add subtle badge or emoji for festive tone while keeping accessibility (`aria-hidden` as needed).

3. **Add CTA button**
   - Use `MotionLinkButton` linking to `/events/curry-and-carols` (aligns with provided localhost URL while remaining environment-agnostic).
   - Ensure button uses brand colors, focus-visible rings, and `ariaLabel` clearly stating destination.

4. **Review heading hierarchy & spacing**
   - Confirm hero retains sole `<h1>`, highlight uses `<h2>`, and subsequent sections maintain logical order.
   - Adjust margins/padding to keep consistent spacing above/below highlight and adjacent sections.

5. **Verification**
   - Run `npm run lint` to ensure no new lint errors (acknowledge existing ones).
   - Update task verification notes summarizing command results and manual check status.
