# Verification

# Verification

## Automated Checks
- `npm run lint` *(fails)* — unchanged repository lint debt (unused vars, design-token lint, hook order). Slideshow file linted clean before global failures triggered.

## Manual Checklist
- [x] Confirmed slideshow wrapper no longer forces viewport height (content drives total height).
- [x] Verified CTA buttons wrap text gracefully while keeping ≥44 px targets and focus rings.
- [ ] Spot-check long-copy slide on mobile/tablet/desktop to confirm spacing stays balanced.
- [ ] Validate dot/arrow controls remain focus-visible after layout changes.
