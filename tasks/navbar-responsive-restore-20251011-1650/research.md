# Research: Navbar Responsive Restore

## Existing Patterns
- Current navbar (post-simplification) renders a single horizontal layout via `Navbar.tsx` using `NavLinks` from `NavbarParts.tsx`. No mobile toggle exists, so links overflow on small screens.
- Prior implementation (before simplification) used Framer Motion drawers, scroll detection, and meta theme color syncing. That approach is overkill for the new goal but shows required data hooks (`useNavContent` supplies accessibility labels and CTA text).
- DaisyUI provides a built-in pattern for responsive navbars using `menu` + `dropdown`/`collapse` toggles which can be composed with Tailwind utilities for small/mobile layouts.
- `NavbarStatic.tsx` historically mirrored `Navbar.tsx` for reduced-motion contexts; with animations removed, both can share a common responsive markup.

## External Resources
- DaisyUI navbar docs: https://daisyui.com/components/navbar/
- Tailwind flex wrap utilities for stacking content responsively: https://tailwindcss.com/docs/flex-wrap

## Technical Constraints
- Navbar must remain fixed at the top (`position: fixed`) so other layouts (e.g., `MenuInteractive`) can accurately measure its height.
- Accessibility requirements from content schema include custom menu button labels (`ariaLabels.menuButton`, `ariaLabels.closeMenu`); we should expose them again for the responsive toggle.
- Keep styling aligned with DaisyUI tokens (avoid bespoke gradients unless reintroduced intentionally).
- Maintain server-safe client component usage (`"use client"`), and avoid reintroducing Framer Motion to keep implementation lightweight.

## Recommendations
- Extend `useNavContent` to return the open/close labels again so the mobile toggle is accessible.
- Enhance `NavLinks` to support horizontal (desktop) and vertical (mobile drawer) orientations while keeping DaisyUI classes.
- Add a mobile toggle button in `Navbar.tsx` that displays nav links and CTA in a stacked block when viewport is below `md` breakpoint.
- Reuse the same responsive component for `NavbarStatic` to prevent divergence; the static variant can wrap or re-export the shared implementation.
- Ensure `ContactCTA` can render full-width (`btn-block`) for mobile drawer while staying inline on desktop.

## New Styling Requirements (2025-10-11)
- Navbar background should be pure white with light shadow to differentiate from content.
- Contact CTA must use brand palette (e.g., `bg-brand-700` / `hover:bg-brand-800`) instead of DaisyUI primary default.
- `christmas-menu` navigation link needs decorative treatment (icon + styling) while keeping DaisyUI structure responsive.
