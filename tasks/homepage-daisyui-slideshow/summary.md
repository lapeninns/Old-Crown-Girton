# Summary
- Reintroduced slideshow logic with DaisyUI styling while restoring hero captions, badges, and CTA buttons.
- Added session-based slide selection (5 slides with required slide guarantee) and autoplay with hover pause.
- Carousel height now targets ~60% viewport (`h-[60svh]` responsive) and uses refined prev/next/dot navigation.
- Retained Next.js `<Image>` optimization, accessible live region messaging, and confirmed lint passes via `npm run lint -- --file components/slideshow/DaisyUISlideshow.tsx`.
- Reinstated rotating CTA pairing (Book/Call variants with emoji buttons) using shared `SlideCTAButton` helper for consistent styling.
- Ensured hydration-safe initial render by using deterministic slide ordering during SSR and introducing client-side randomisation post-mount.
