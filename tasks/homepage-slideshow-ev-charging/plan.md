# Plan

1. **Normalize the new asset**
   - Relocate `ElectricCharging.png` into `src/assets/images/components/Slideshow/cars/` to match the slideshow image convention.
   - Rename the file to a descriptive, kebab-case name (e.g. `electric-vehicle-charging-bays.png`) so future imports stay readable.
   - Verify the alias `@cimages/Slideshow/...` resolves the new path.

2. **Integrate the image into the slide data**
   - Import the renamed asset in `components/slideshow/slides.ts` alongside the existing `cars` imagery.
   - Add a new slide object featuring this image within the first three entries so it appears near the top of the carousel rotation.
   - Provide marketing copy, `eyebrow`, `headline`, `copy`, and `badges` that highlight EV charging, keeping tone aligned with current slides and populating `ctas` with the standard booking/contact links.
   - Ensure the slide `id` is unique and that inserting the object preserves array order without breaking other slide references.

3. **Review supporting preload hooks**
   - Check `hooks/useSeamlessLoading.tsx` (and similar utilities) for any hard-coded lists of hero/slideshow assets; append the new `/images/slideshow/...` path if those lists preload top slides so the charging photo isn’t omitted.

4. **Verification**
   - Run a lightweight type-check or lint targeting the modified files if available, otherwise rely on `tsc --noEmit`/`pnpm lint` as appropriate to catch import or typing mistakes.
   - Manually inspect `components/slideshow/slides.ts` ordering to confirm the new slide is within the top three and references the renamed asset.
