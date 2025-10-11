# Research: Navbar Responsiveness Rollback

## Existing Patterns
- `components/restaurant/Navbar.tsx` and `NavbarStatic.tsx` share structure via helpers in `NavbarParts.tsx`; both provide desktop (`DesktopNavLinks`) and mobile (`MobileNavLinks`) views with Tailwind `md:` breakpoints and Framer Motion / manual drawer toggles.
- `NavbarParts.tsx` layers custom styling such as gradients, focus rings, seasonal indicators, and responsive `hidden md:flex` or `md:hidden` toggles around DaisyUI primitives (`btn`, `menu`).
- Theme-color swapping, body scroll locking, and safe-area padding live inside Navbar variants to support the animated mobile drawer.
- Other surfaces (e.g., `MenuInteractive` in `app/menu/_components/MenuInteractive.tsx`) read navbar height dynamically but ultimately rely on a fixed top nav being present, not on the responsive drawer itself.

## External Resources
- DaisyUI Navbar defaults: https://daisyui.com/components/navbar/ (baseline behavior without custom animation/responsive scripting).

## Technical Constraints
- Navbar must remain fixed at the top; multiple layouts import it (`components/restaurant/Layout.tsx`, `SeamlessLayout.tsx`, `ClientHomeContent.tsx`).
- Seasonal link highlighting (`isSeasonal`) currently introduces gradients/span wrappers; removing bespoke styling should either drop or drastically simplify this state.
- Removing the hamburger/drawer means mobile and desktop share one layout; ensure markup still passes accessibility basics (nav landmark, focusable links).
- Body scroll locking and theme-color mutations become unnecessary once the drawer is gone and should be removed to avoid side effects.

## Recommendations
- Collapse the helper components so `DesktopNavLinks` returns a simple unordered list without breakpoint-specific classes; drop `MobileNavLinks` entirely.
- Replace custom class strings with DaisyUI defaults (`btn-ghost`, `navbar`, etc.) keeping only minimal spacing so design stays usable when responsiveness is removed.
- Strip Framer Motion imports/usage from `Navbar.tsx` and reduce `NavbarStatic.tsx` to a single simplified implementation (or make both share an even smaller surface if the static variant becomes redundant).
- Verify any remaining reference to removed exports (e.g., `MobileNavLinks`) to avoid type errors.
- After simplification confirm resulting nav height is still within 40–120px so `MenuInteractive` heuristics continue to work without extra adjustments.
