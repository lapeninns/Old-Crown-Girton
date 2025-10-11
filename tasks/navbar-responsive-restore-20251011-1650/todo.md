# Implementation Checklist

## Prep
- [x] Update `NavbarParts.tsx` to support responsive orientations and expose menu button labels.

## Navbar Implementation
- [x] Add responsive toggle + mobile menu in `Navbar.tsx`.
- [x] Reuse the responsive navbar for `NavbarStatic.tsx`.
- [x] Make navbar background white and adjust CTA/seasonal styling.
- [x] Apply brand color to all navbar links and logo text.

## QA
- [x] Run `npm run lint` (capture pre-existing failures).
- [ ] Manual QA via Chrome DevTools MCP. *(Blocked: DevTools MCP connection fails with `http://localhost:9222/json/version` fetch error.)*

## Notes
- Document any limitations if Chrome DevTools MCP remains unavailable.
- `npm run lint` fails with existing warnings/errors across unrelated API/blog/components (see command output).
