# Implementation Checklist

## Prep
- [x] Simplify `NavbarParts.tsx` helpers to remove responsive/mobile-only exports and custom gradients.

## Navbar Simplification
- [x] Refactor `Navbar.tsx` to drop animation/state for mobile drawer and use simplified layout.
- [x] Mirror the simplified layout in `NavbarStatic.tsx` (or share implementation).

## QA
- [ ] Run available lint/type checks (`npm run lint` if present).
- [ ] Manual QA via Chrome DevTools MCP.

## Notes / Deviations
- Document if seasonal styling removal introduces regressions to call out.
- `npm run lint` currently fails with pre-existing warnings/errors in unrelated app and API files.
- Chrome DevTools MCP connection unavailable (`http://localhost:9222/json/version` fetch failed) so manual QA could not run.
