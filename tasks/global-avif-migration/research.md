# Research

- **Image directories in scope**: Major assets live under `public/images/**` (~105 files across slideshow, brand, food, optimized variants) and `src/assets/images/**` (~14 component-level imports such as slideshow images via `@cimages` alias). Repo-wide total ~169 raster images (PNG/JPG/JPEG/WEBP/GIF) per `find`.
- **Alias usage**: `tsconfig.json` maps `@cimages/*` to `src/assets/images/components/*`, enabling static `import foo from '@cimages/...jpg'` primarily in slideshow components. `src/lib/images.ts` references public assets by string paths (e.g. `/images/slideshow/...jpeg`).
- **Next.js image config**: `next.config.js` already sets `images.formats = ['image/avif', 'image/webp']`, letting Next Image serve AVIF/WebP when available. However most assets remain JPEG/PNG on disk, so converting originals to AVIF aligns with the user requirement for “primary AVIF + fallback”.
- **Existing tooling**: `scripts/image-optimizer.js` uses `sharp` to generate WebP and AVIF variants inside `public/images/optimized/**` (not overwriting originals). Configuration demonstrates preferred quality settings and size handling we can reuse.
- **Consumption patterns**:
  - Slideshow slides import statically (`components/slideshow/slides.ts`) – swapping extensions would require code updates.
  - Registry `src/lib/images.ts` exposes string URLs used across the app; to support dual-format fallback we likely need to expand this structure or introduce helpers that surface both AVIF and original paths.
  - No `<picture>` usage currently; everything relies on `<Image>` from Next.js or raw string paths.
- **Backup requirement**: No built-in script exists to snapshot image directories. Need to create a new backup workflow (e.g. copy `public/images` and `src/assets/images` into versioned `backups/*`).
- **Optional dependencies**: `sharp` is declared (optional). We can leverage it for bulk AVIF conversion via a Node script.
