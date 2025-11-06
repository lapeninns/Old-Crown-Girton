# Implementation Checklist

## Banner layout
- [x] Update `SeasonalPromoBanner` flex/grid classes to ensure centered alignment on all breakpoints.
- [x] Override DaisyUI alert min-height / padding to reduce banner impact on navbar height.
- [x] Refresh banner copy and point CTA to `/christmas-menu` route.

## Navbar offset sanity
- [x] Re-evaluate navbar height measurement; adjust logic only if banner still causes undesirable offset after tightening styles.

## Slideshow layout
- [x] Convert overlay wrapper in `DaisyUISlideshow` to centered flex layout with adaptive min-height.
- [x] Validate CTA/button wrapping with new alignment across breakpoints.
- [x] Implement dynamic typography scaling for headlines and copy based on content length.
- [x] Confirm consistent padding/margins across slides with long copy.

## Verification
- [ ] Run lint/tests as appropriate (spot-check).
- [x] Manual QA with Chrome DevTools (mobile + desktop) focusing on banner + slideshow spacing and typography scaling.
- [x] Update `verification.md` with findings.
