# Research: Christmas Menu Alert Banner

## Initial Requirements
- Promote the Christmas Menu across the site with a prominent DaisyUI `alert` banner similar to the provided Blueprint example.
- Banner should link to `/christmas-menu` and reuse existing design tokens/patterns.
- Must integrate with current restaurant layout without breaking fixed navigation behavior.

## Existing Patterns
- `components/restaurant/Navbar.tsx` renders a fixed, full-width navigation bar with DaisyUI utility classes and uses `NavLinks` / `ContactCTA` from `NavbarParts.tsx`.
- Seasonal nav treatment already exists: `NavLinks` marks `/christmas-menu` links as `isSeasonal` and decorates them (emoji + styling), so festive cues are familiar to users.
- The site wraps pages with `components/restaurant/Layout.tsx`, which applies `paddingTop: '64px'` to `main` to offset the fixed navbar height.
- DaisyUI components are used throughout (buttons, badges) and `Link` wrappers come from `@/lib/debugLink` for routing safety.

## External References
- DaisyUI `alert` component: https://daisyui.com/components/alert/ provides accessible markup for inline banners.
- Blueprint example supplied by stakeholder shows an anchor-styled `alert` with monospaced badge and copy inside a flex container; we can adapt styling while aligning with brand tokens (brand blues/reds, focus outlines).

## Technical Constraints & Considerations
- Because the navbar is fixed, introducing a banner above it increases the header height; we must ensure page content is still offset correctly.
- Multiple layouts (dynamic `Navbar` and `NavbarStatic`) share the same component, so banner logic should live in the shared `Navbar` tree.
- Need to maintain keyboard focus order (banner should be first interactive element) and provide visible focus styles consistent with accessibility requirements.
- Ensure the banner collapses gracefully on mobile widths while remaining tappable (touch target ≥24px high, min font-size 16px).

## Opportunities & Recommendations
- Add a dedicated `SeasonalPromoBanner` (client component) rendered directly above the existing navbar content within `<nav>` or via a wrapping header.
- Use DaisyUI `alert` styling combined with Tailwind utilities to match the blueprint look but tune copy to “Christmas Menu” messaging (e.g., `🎄 Christmas Menu 2025` + call-to-action).
- Introduce a CSS custom property (e.g., `--navbar-offset`) whose value equals the runtime height of the nav + banner, and update `Layout.tsx` to consume it instead of the hard-coded 64px offset. This keeps layout resilient to future banner adjustments.
- Reuse `DebugLink` for internal navigation, ensure `aria-label` describes the destination, and include supporting copy that communicates limited-time availability to drive clicks.

## Open Questions
- Confirm whether the banner should appear on every page (assumed yes because navbar is global).
- Should the banner persist after dismiss? No dismissal requested, so banner remains always visible until feature sunset.
