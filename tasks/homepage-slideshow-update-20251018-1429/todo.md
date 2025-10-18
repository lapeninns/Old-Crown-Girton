# Implementation Checklist

## Assets
- [x] Convert `Christmas.png` and `Curry&carols.png` to AVIF (retain PNG fallback).
- [x] Move seasonal assets into `src/assets/images/components/Slideshow/seasonal/`.

## Code Updates
- [x] Extend slideshow `Slide` type with `menuUrl`.
- [x] Add `menu` CTA variant in `SlideCTAButton`.
- [x] Update `getCTAConfig` to prefer menu+call when available and revise required slide IDs.
- [x] Create Christmas and Curry & Carols slide entries in `slides.ts`.

## Verification
- [ ] Run relevant TypeScript/lint checks if feasible.
- [x] Perform manual QA with Chrome DevTools (rendering, CTA links, accessibility focus).

## Questions/Notes
- Ensure CTA copy stays concise to prevent wrapping issues on small viewports.
- `npm run lint` currently fails because of legacy warnings/errors unrelated to this task.
