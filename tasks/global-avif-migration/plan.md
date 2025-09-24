# Plan

1. **Snapshot existing images**
   - Copy `public/images/**` and `src/assets/images/**` (plus any other raster assets) into a versioned backup directory (e.g. `backups/images-<timestamp>/...`).
   - Preserve folder structure so we can roll back individual files if required.

2. **Automate AVIF generation**
   - Write a Node.js script (using the repo’s optional `sharp` dependency) that walks configurable directories, skipping SVG/GIF while processing PNG/JPG/JPEG/WebP.
   - For each source image, emit a sibling `.avif` file (same basename) using quality/effort settings aligned with `scripts/image-optimizer.js`.
   - Ensure the script is idempotent (skip conversion when `.avif` already exists) and logs a summary report.

3. **Run conversion & restore file structure**
   - Execute the script across all target directories so every image now has an AVIF counterpart.
   - Spot-check a few generated files to confirm fidelity and that sizes meaningfully reduce versus originals.

4. **Update application references**
   - For static imports under `src/assets/images/**`, update modules (e.g. slideshow slides, SEO schema) to import the new `.avif` assets while keeping the original files as fallbacks when needed.
   - Adjust registries (`src/lib/images.ts`, JSON content, preload lists, manifests) to point to the new `.avif` paths and, where appropriate, store a `fallback` pointer to the legacy extension.
   - Introduce a lightweight helper/component that prefers AVIF but gracefully falls back (e.g. wrap `next/image` to choose AVIF when supported, use fallback path otherwise) and migrate existing `Image`/`img` consumers to it.

5. **Verify & document**
   - Run lint/type checks on touched files.
   - Optionally execute a local smoke test (e.g. `npm run dev`) to confirm pages render with AVIF sources.
   - Record conversion summary and backup location in task notes for future reference.
