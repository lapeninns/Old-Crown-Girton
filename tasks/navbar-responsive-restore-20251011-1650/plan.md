# Implementation Plan: Navbar Responsive Restore

## Objective
Reintroduce responsive behavior so the restaurant navbar works on mobile and desktop, using lightweight DaisyUI components without custom animations.

## Success Criteria
- [ ] Navbar shows a toggle button on small screens that reveals navigation links and contact CTA in a vertical stack.
- [ ] Desktop layout remains horizontal with logo, links, and CTA aligned.
- [ ] Accessibility labels for the menu button use content-managed strings.
- [ ] `NavbarStatic` uses the same responsive markup to avoid divergence.

## Architecture
### Components
- `components/restaurant/NavbarParts.tsx`: Extend shared helpers to support vertical orientation and return menu labels.
- `components/restaurant/Navbar.tsx`: Implement responsive toggle and conditional rendering of mobile menu.
- `components/restaurant/NavbarStatic.tsx`: Reuse the responsive layout (wrap or re-export) to keep parity.

### State Management
- Local `isMenuOpen` state in navbar component to track mobile menu visibility; reset when user selects a link/CTA.

### Data Flow
- Continue fetching nav data via `useNavContent`; restore open/close labels from content `ariaLabels`.

### UI/UX Considerations
- Mobile menu should occupy full width under the navbar, using DaisyUI `menu menu-vertical` for links and `btn` for CTA.
- Ensure focus outlines and keyboard navigation remain intact; toggle button must be focusable and announce expanded state.
- When mobile menu is open, links should close it on activation to avoid stale state.

### Testing Strategy
- Run `npm run lint` (expect pre-existing failures unrelated to navbar; document them).
- Manual QA via Chrome DevTools MCP: verify toggle, tab navigation, and responsive layouts at 375px/768px/desktop (pending tool availability).

### Edge Cases
- No nav links (empty array) should not break layout; toggle can still show CTA.
- Error badge should display on both desktop and mobile layouts.

### Rollout Plan
- Update shared helpers first, then navbar components.
- Keep changes localized to navbar files and task documentation.

## Styling Adjustments
- Update navbar container to use `bg-white` and a subtle shadow so it reads as pure white on all devices.
- Reintroduce seasonal metadata in `NavLinks` to decorate the Christmas link (emoji + accent styling) without reintroducing heavy animation.
- Revise `ContactCTA` helper to apply brand colors consistently across desktop and mobile variants.
