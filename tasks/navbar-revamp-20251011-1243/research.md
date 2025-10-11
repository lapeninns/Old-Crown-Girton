# Research: Navbar Revamp

## Initial Requirements
- Refresh the restaurant navbar so that it feels smoother while keeping all existing navigation data, filtering rules, and layout responsibilities.
- Adopt DaisyUI primitives for structure (e.g., `navbar`, `menu`, `dropdown`, `btn`) instead of bespoke Tailwind compositions.
- Preserve current integrations with `useParsedData`, `useContent`, `sanitizeHref`, and the reduced-motion fallback exposed via `NavbarStatic`.

## Success Criteria
- Navbar continues to render dynamic links from `public/data/nav.json`, omitting `/` and `/contact`, and surfaces the dedicated contact CTA.
- Desktop layout remains fixed at the top with a ~64 px rail so progressive placeholders (`ClientHomeContent` + `.navbar-placeholder`) still align.
- Mobile menu opens/closes without jank, respects `prefers-reduced-motion`, and maintains accessible labeling/focus behaviour.
- Implementation relies on DaisyUI classes/components without regressing existing accessibility guarantees.

## Existing Patterns
- **Current navbar implementations** live in `components/restaurant/Navbar.tsx` (Framer Motion animations, manual inline `style` for fixed positioning) and `NavbarStatic.tsx` (reduced-motion variant without Framer Motion). Both already filter navigation links via `sanitizeHref` helpers and fetch data with `useParsedData`/`useContent`.
- **Layout expectations**: `ClientHomeContent.tsx` renders a fixed navbar inside a `ProgressiveSection` with a 64 px placeholder, while `SeamlessLayout.tsx` assumes the same height when setting `paddingTop`.
- **Global styling**: `.navbar-placeholder` in `app/globals.css` mirrors the current background/box-shadow, and scroll behaviour is tied to `window.scrollY` thresholds inside each navbar component.
- **Data pipeline**: `NavDataSchema` (`lib/schemas.ts`) constrains nav entries to `{ href, label }`, and `useParsedData` logs `nav.json` loads and guards schema parsing.
- **Shared utilities**: `sanitizeHref`, `createHrefKey`, `isValidHref`, and `logHrefIssue` in `utils/href` are already used by both navbar variants for safety.

## External Resources
- DaisyUI Navbar pattern reference: [https://daisyui.com/components/navbar/](https://daisyui.com/components/navbar/)
- DaisyUI Dropdown + Menu patterns for mobile drawer: [https://daisyui.com/components/dropdown/](https://daisyui.com/components/dropdown/), [https://daisyui.com/components/menu/](https://daisyui.com/components/menu/)
- WAI-ARIA Authoring Practices for navigation landmarks and disclosure widgets (already cited in `agents.md`).

## Technical Constraints
- `agents.md` mandates DaisyUI usage, mobile-first design, accessible focus handling, and `prefers-reduced-motion` support. Manual focus traps or aria labels must remain correct.
- Navbar must stay fixed at the top (z-index 50) to satisfy placeholders and menu scroll calculations (`MenuInteractive` probes `.navbar` height).
- Framer Motion is currently used for mobile drawer fades (`navMotion.mobileDrawer`). Any refactor must still support motion preferences or replace with CSS transitions that respect reduced-motion users.
- `NavbarStatic` is used when `noMotion` is true or in reduced-motion paths; both variants should share styling/APIs to avoid visual drift.
- Some code (e.g., `scripts/verify-images.mjs`) references `components/restaurant/Navbar.tsx`; file location/name should stay intact.

## Open Questions
- Do we replace Framer Motion with DaisyUI dropdown animations or keep Framer Motion for continuity? (Leaning toward CSS-based transitions to avoid animation jank while retaining `prefersReduced` guard.)
- Should `NavbarStatic` reuse the same JSX tree (minus animations) to prevent divergence? (Likely yes—introduce shared subcomponents or class constants.)
- Is the Christmas CTA styling still required post-revamp, or can DaisyUI badge styling cover it? (Need to retain until stakeholders remove seasonal link.)

## Recommendations
- Centralize shared nav link rendering (map + class decisions) so both animated and static variants consume the same component tree, differing only in motion wrappers.
- Use DaisyUI `navbar` container with `navbar-start`, `navbar-center`, `navbar-end` sections for desktop; pair with DaisyUI `btn`, `menu`, and `dropdown` classes for controls.
- For mobile, adopt DaisyUI `drawer`/`dropdown` patterns while ensuring the scrim covers the viewport and retains click-to-close semantics; respect `prefers-reduced-motion` by conditionally skipping transitions.
- Keep the Christmas link highlight but adapt it to DaisyUI tokens (e.g., `badge` or gradient `btn`) while preserving inline emoji + underline accent as per current UX.
- Audit focus states post-revamp (e.g., ensure `aria-expanded`, `aria-controls`, `role="dialog"` or `menu`) and plan verification via Chrome DevTools accessibility tooling.
