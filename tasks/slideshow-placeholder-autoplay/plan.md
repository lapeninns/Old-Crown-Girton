# Plan

1. **Tweak slide placeholder rendering**
   - Remove the neutral fallback block in `components/slideshow/Slide.tsx` so the previous slide remains visible until the next image finishes loading.
   - Ensure we don’t regress accessibility by keeping the failure message and overlay behavior intact.

2. **Guarantee autoplay**
   - Update `components/slideshow/Slideshow.tsx` to keep the auto-advance timer active even when `config.reduceAnimations` is true, possibly using a slightly longer interval for those scenarios instead of cancelling autoplay outright.

3. **Verification**
   - Run targeted lint on the updated files and manually review transitions to confirm no grey flash and slideshow advances automatically.
