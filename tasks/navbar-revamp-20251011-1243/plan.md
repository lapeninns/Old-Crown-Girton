# Implementation Plan: Navbar Revamp

## Objective
Rebuild the restaurant navbar with DaisyUI primitives so it feels smoother across breakpoints while preserving existing data loading, link filtering, and reduced-motion behaviour.

## Success Criteria
- [ ] Shared DaisyUI-based layout for both `Navbar` and `NavbarStatic`, keeping a fixed 64 px rail without layout shift.
- [ ] Dynamic links still originate from `nav.json`/CMS content, excluding `/` and `/contact`, and maintain the seasonal CTA styling.
- [ ] Mobile drawer uses DaisyUI components, honours `prefers-reduced-motion`, and exposes correct `aria-*` attributes.
- [ ] Contact CTA remains prominent (DaisyUI `btn`), meeting focus-visible and touch target guidelines.
- [ ] No regressions detected during Chrome DevTools QA (console, responsive, accessibility checks).

## Architecture
### Components & Utilities
- **`Navbar`**: primary interactive navbar with scroll-aware visuals and optional CSS transitions.
- **`NavbarStatic`**: reduced-motion variant reusing the same structural subcomponents but without animated wrappers.
- **Shared subcomponents** (defined once and reused): 
  - `NavbarLogo` for logo + brand text.
  - `NavbarDesktopLinks` for the horizontal menu (normal + Christmas variant).
  - `NavbarMobileMenu` for the drawer contents.
- **`useNavContent` helper** inside the navbar module to consolidate data loading, filtering, and derived labels.

### Styling Strategy
- Use DaisyUI `navbar`, `navbar-start`, `navbar-center`, `navbar-end`, `btn`, `menu`, and `dropdown` classes supplemented with Tailwind tokens for brand colours and focus rings.
- Replace imperative inline styles with Tailwind utilities (`fixed`, `inset-x-0`, `transform-gpu`, `will-change-transform`).
- Use `motion-safe` / `motion-reduce` utility classes to conditionally animate opacity/translate without manual Framer Motion hooks, keeping `prefersReducedMotion` fallback.

## Data Flow
- `useParsedData('nav.json', NavDataSchema)` → sanitized/filtered link list.
- `useContent()` continues to supply fallback nav labels, error copy, and aria strings.
- Shared helper function filters out `/` and `/contact`, logs invalid hrefs via existing utils, and returns derived `navLinks`, `contactLabel`, and `ariaLabels`.

## UI/UX Considerations
- Maintain sticky navbar shadow transition after 10 px of scroll (CSS class toggle).
- Desktop nav uses inline menu items with DaisyUI hover/focus treatments; highlight the seasonal link as a pill-style CTA.
- Mobile nav opens a slide-down panel (`absolute top-16`) with scrim coverage and body-scroll lock (by fixing the scrim to viewport). Drawer closes on link click or scrim tap.
- Ensure menu button is at least 44 px touch area and uses DaisyUI `btn-ghost` style.
- Keep consistent spacing with container width (`max-w-7xl`, `px-4 sm:px-6 lg:px-8`) to match rest of layout.

## Accessibility
- `nav` element retains `aria-label` (if provided by content) or defaults to "Main navigation".
- Hamburger button uses `aria-expanded`, `aria-controls`, and `aria-haspopup="menu"`.
- Mobile drawer uses `role="dialog"` & `aria-modal="true"` (matching existing semantics) and traps focus visually by auto-focusing first link on open (optional enhancement if simple to implement).
- All focus states leverage DaisyUI/Tailwind focus-visible rings with sufficient contrast.

## Testing Strategy
- Manual Chrome DevTools session (mobile/desktop, device emulation, accessibility pane, console).
- Verify scroll behaviour for desktop and mobile (open drawer, scroll page).
- Optional unit coverage: not critical, but we can keep TypeScript types strict (TS compile).
- Run lint/typecheck if time permits (`npm run lint`, `npm run typecheck`).

## Edge Cases
- `nav.json` missing/invalid: display inline error chip (desktop/mobile) like the current implementation.
- No Christmas link: ensure generic link styling still works.
- Reduced-motion users: confirm absence of `motion` transitions and fallback to instant show/hide.
- Very long labels: test responsive wrapping and truncation (DaisyUI `menu` handles by default; adjust `whitespace` if needed).

## Rollout Plan
- Refactor both navbar variants in one PR to avoid visual mismatch between motion/static paths.
- Smoke test on homepage, menu page (which reads navbar height), and any layout that consumes `Navbar`/`NavbarStatic`.
- Update `tasks/navbar-revamp-20251011-1243/verification.md` after DevTools QA.

## Implementation Steps
1. Create shared helper(s) in `Navbar.tsx` (or adjacent module) for data loading, filtering, and shared JSX sections.
2. Refactor `Navbar` to use DaisyUI `navbar` structure, replacing inline styles with Tailwind utilities and CSS transitions.
3. Rebuild mobile drawer with DaisyUI menu/dropdown styles and reduced-motion aware transitions (remove Framer Motion dependency if redundant).
4. Update `NavbarStatic` to reuse the shared subcomponents and DaisyUI classes, ensuring parity with animated variant.
5. Audit `MenuInteractive` height detection and adjust if navbar height changes; confirm placeholders still align.
6. Manually test across breakpoints using Chrome DevTools, document verification notes, and run lint/typecheck if feasible.
