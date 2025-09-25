# Plan – Events Special Booking CTA Banner

## Goal
Insert a prominent banner at the top of `/events` encouraging visitors to arrange special bookings, aligning with existing design language and accessibility guidelines.

## Approach
1. **Locate insertion point**: Review `app/events/page.tsx` to position the banner immediately inside the layout, before the current hero section, preserving page flow.
2. **Design banner structure**:
   - Use a full-width `<section>` with a high-contrast gradient background using brand tokens (e.g., `from-brand-800 via-crimson-600 to-cardamom-700`).
   - Wrap content in a centered container (`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8`) mirroring hero spacing.
   - Include a badge or emoji-led label signalling "Special booking spotlight" to catch attention.
   - Provide headline and short description highlighting bespoke celebrations and private hires.
3. **CTA buttons**:
   - Primary button: `MotionLinkButton` linking to `/contact` or `/book-a-table` (decide on contact for tailored bookings, include aria-label).
   - Secondary button: `MotionLinkButton` linking to `tel:` for immediate enquiries.
   - Maintain `.px-6 .py-3` sizing, focus-visible rings, and `touch-action: manipulation` for accessibility per UI rules.
4. **Accessibility details**:
   - Ensure headings follow hierarchy (banner H2 leading to hero H1 to keep unique page H1 unchanged, or restructure hero to keep H1 but allow top banner heading as visually prominent with `h2`).
   - Provide `aria-hidden` on decorative emoji, and `sr-only` text where necessary.
   - Guarantee copy meets contrast requirements on gradient background (use white text, brand accent for secondary text).
5. **Testing & verification**:
   - Run `npm run lint` (acknowledge existing unrelated warnings) to ensure no new lint errors.
   - Update `tasks/events-special-booking-banner/verification.md` with command results and manual check notes.

## Notes
- Keep markup server-compatible (avoid importing client-only CTA components).
- Use `FadeIn` wrapper to stay consistent with page animation, while respecting reduced-motion guard already applied to hero (no additional global styles needed).
