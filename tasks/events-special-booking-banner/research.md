# Research – Events Special Booking CTA Banner

## Existing patterns in Events page
- `app/events/page.tsx` currently renders hero section followed by main content sections (`Live Sports`, feature cards, etc.). The page uses `RestaurantLayout` with Tailwind utility classes and motion wrappers (`FadeIn`, `BouncyEmoji`, `MotionLinkButton`).
- Hero uses gradient background and chip-style badges; new banner must align with brand tokens (`bg-brand-*`, `bg-accent-*`) and accessible typography.

## Reusable CTA components
- `components/restaurant/sections/CallToActionSection.tsx` provides a reusable gradient CTA block with headline, description, and button list. It is client-side and includes focus rings and external link handling.
- No current usage of `CallToActionSection` inside `/events`; integrating similar styling server-side would require either importing this client component (adds hydration) or building inline static section reusing styling patterns (prefer server component to keep events page static).

## Accessibility & UI guidelines
- Buttons/links must meet ≥24px hit area; use `.px-6 .py-3` etc as seen in `MotionLinkButton`.
- Include focus-visible ring and ensure text contrast (white text on brand gradient is acceptable per design system).
- Provide `aria-label` for essential icons; ensure any emoji either `aria-hidden` or labelled.
- `touch-action: manipulation` used previously for badges to prevent delays; apply to new CTA if comparable.

## Highlight inspiration
- Home page CTA sections feature gradient backgrounds, emoji headline prefixes, two-button layouts (primary booking + secondary contact). Mimicking this provides continuity.
- `MotionLinkButton` ensures consistent animation and focus states; using these for CTA buttons keeps design aligned with existing hero.

## Assumptions / open points
- "Special booking" banner likely promotes event-specific booking assistance (e.g., private hire). Provide copy inviting users to enquire about bespoke celebrations.
- User wants banner “on top”; interpret as inserting a full-width CTA directly before the hero section inside `/events/page.tsx`.
- No specific asset provided; rely on text + emoji + gradient background.
