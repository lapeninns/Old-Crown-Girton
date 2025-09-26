# Plan — Replace Homepage Slideshow with DaisyUI Carousel

1. Audit current slideshow render path and constraints
   - Re-read `components/slideshow/Slideshow.tsx` and `Slide.tsx` to map which elements receive focus, gestures, live regions, skeletons, and motion props so that DaisyUI classes can wrap them without breaking logic.
   - Verify no other component depends on the old class names (search for `slides-wrapper`, `rounded-3xl`, etc.) to avoid regressions.

2. Define DaisyUI-compatible structure & overrides
   - Decide where to introduce `carousel w-full` and `carousel-item` wrappers so the existing Framer Motion element remains the interactive surface.
   - Identify any DaisyUI defaults that must be neutralized (e.g., `inline-flex`, `overflow-x: scroll`, `scroll-snap-type`). Prepare Tailwind utility overrides (`block`, `overflow-x-hidden`, `snap-none`, `scroll-auto`) or scoped CSS if utilities are insufficient.
   - Determine how to expose prev/next controls: either integrate DaisyUI `btn btn-circle` buttons tied to `requestAdvance` or preserve control-less UI if that matches current behavior.

3. Implement markup refactor in `Slideshow.tsx`
   - Wrap the existing motion container with DaisyUI carousel markup while keeping skeletons, live regions, gesture bindings, and focus management untouched.
   - Apply necessary utility overrides to keep layout full-width and non-scrollable, and ensure active slide retains `aria` metadata (optionally add `aria-current` alongside announcements).
   - If adding DaisyUI buttons, wire them to existing handlers and ensure they are conditionally rendered only when multiple slides exist; include proper `aria-label` and `type="button"` to avoid hash navigation.

4. Regression checks & polish
   - Run or outline relevant tests (component/unit if available) and consider whether snapshots need updates; ensure TypeScript builds cleanly.
   - Manual QA checklist: keyboard arrows, focus rings, swipe gestures, autoplay pause/resume, reduced-motion path, skeleton fallback, multiple breakpoints.
   - Draft migration note summarizing the UI change, pointing to DaisyUI usage and emphasizing logic parity.
