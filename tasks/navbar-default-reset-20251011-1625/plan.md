# Implementation Plan: Navbar Responsiveness Rollback

## Objective
Remove bespoke responsive behavior, styling, and animations from the restaurant navbar so it renders as a single DaisyUI-default layout across viewports.

## Success Criteria
- [ ] Navbar renders identically on mobile and desktop without hamburger/drawer behavior.
- [ ] No Framer Motion or manual animation/theme-color logic remains in `Navbar.tsx` or `NavbarStatic.tsx`.
- [ ] Navigation links use DaisyUI baseline classes without custom gradients or hover animations.
- [ ] Build (`npm run lint` if available) passes without TypeScript errors.

## Architecture
### Components
- `components/restaurant/Navbar.tsx`: Consolidate into simple fixed navbar, remove motion hooks, maintain top positioning.
- `components/restaurant/NavbarStatic.tsx`: Mirror the simplified markup; consider re-exporting shared JSX.
- `components/restaurant/NavbarParts.tsx`: Keep shared helpers (`NavbarLogo`, CTA, generic `NavLinks`) but drop mobile-only exports.

### State Management
- Only keep minimal state if needed for scroll styling; otherwise remove toggle state entirely.

### Data Flow
- Continue using `useNavContent` for link data and labels; no changes to schema.

### API Contracts
- No external API changes.

## UI/UX Considerations
- Display all links inline with DaisyUI default spacing; seasonal links fall back to same button style without emoji/animation.
- Maintain focus states provided by DaisyUI; ensure nav landmark & link labels remain accessible.
- Keep navbar fixed and bounded width (`max-w-7xl`) to avoid layout shift.

## Testing Strategy
- Smoke-test in browser via DevTools to confirm nav shows consistently and no drawer appears.
- If tooling permits, run `npm run lint` to catch TypeScript regressions.
- Manual check that `MenuInteractive` still positions content correctly (no major overlap).

## Edge Cases
- Ensure error badge still renders without layout issues when nav data fails.
- Confirm contact CTA remains visible since mobile layout no longer hides it.

## Rollout Plan
- Update both navbar variants in same PR.
- No feature flag; change takes effect immediately after deploy.
