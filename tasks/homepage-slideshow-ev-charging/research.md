# Research

- **Home page slideshow entry point**: `components/ClientHomeContent.tsx` renders `<Showcase />` within the hero section. `Showcase` simply returns `<Slideshow autoplay interval />`, so any slide changes go through the core slideshow module.
- **Slides data source**: `components/slideshow/slides.ts` exports the canonical ordered `slides` array consumed by `Slideshow.tsx`. Slide objects provide `id`, `image`, `alt`, `eyebrow`, `headline`, `copy`, `badges`, and `ctas` attributes.
- **Image sourcing pattern**: Slides import assets from the alias `@cimages/Slideshow/...`, which maps (per `tsconfig.json`) to `src/assets/images/components/Slideshow`. Subdirectories group images (e.g. `interior`, `garden`, `exterior`, `cars`).
- **Existing first slides**: Currently the first three slides highlight a car meet (`cars/car-meet-up.jpeg`), an interior dining room, and the comfy lounge (`slides.ts` lines ~18–46). The user wants the new Electric Charging image somewhere in this top trio.
- **New asset location**: The provided `ElectricCharging.png` sits at repository root. To follow established organization, it should be moved into the slideshow image folder (likely `src/assets/images/components/Slideshow/cars/` given the automotive theme) with a semantic, kebab-case filename.
- **CTA expectations**: `Slide.tsx` cycles CTA button variants using consistent `bookUrl` / `callTel` data already present on each slide. Any new slide should keep these fields populated for parity.
- **Accessibility hooks**: `Slide.tsx` depends on descriptive `alt`, `eyebrow`, and `headline`; overlay ensures contrast. We must craft copy acknowledging EV charging while keeping reading level aligned with existing marketing tone.
- **Preloading considerations**: `Slideshow.tsx` preloads images using `useImagePreloader`. No extra config needed if we import statically; just ensure the asset path resolves and file size is reasonable.
