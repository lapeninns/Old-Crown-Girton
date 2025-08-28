Image Organization and Usage

Overview
- All image paths are centralized via a single registry: `src/lib/images.ts`.
- Code should import image paths from this registry rather than hardcoding strings.
- This keeps references consistent and makes future moves/optimizations trivial.

Structure (physical folders)
- Public brand assets
  - `public/images/Oldcrowngirtonlogo.png`
  - `public/images/slideshow/OldCrownGirtonBuilding.png`
- Venue photos (slideshow set)
  - `public/images/slideshow/*.jpg|png`
  - Sub‑grouping in the registry: interior, exterior, garden
- Dish photos
  - `public/dishes/*.jpeg`

Registry (logical groups)
- File: `src/lib/images.ts`
  - `brand`: logo/building
  - `venue`: interior/exterior/garden images
  - `dishes`: curated dish images used across home and menu highlights
  - `blog`: canonical images for each blog post hero

How to use
- Import and reference a logical image, e.g.:
  - `import { Images } from '@/src/lib/images'`
  - `<Image src={Images.venue.exterior} ... />`

Adding new images
1) Place the image under the appropriate public folder:
   - Venue: `public/images/slideshow/`
   - Dish: `public/dishes/`
   - Brand: `public/images/`
2) Add a stable mapping in `src/lib/images.ts`.
3) Use the new key in the UI.

Required slideshow photos (filenames)
- Place the following JPEGs in `public/images/slideshow/`:
  - interior-buddha-wall.jpg
  - exterior-deck-umbrellas.jpg
  - terrace-seating-umbrellas.jpg
  - bar-lounge-jackpot-tv-1.jpg
  - bar-lounge-jackpot-tv-2.jpg
  - dining-room-floral-banquets.jpg
  - kids-playground-slide-blue.jpg
  - beer-garden-long-view-benches.jpg
  - garden-lawn-round-bench.jpg
  - car-park-gravel-wide.jpg

Notes
- Legacy placeholder slideshow images were removed to prevent accidental reuse.

Removed placeholders
- Deleted: `public/hero-restaurant.jpg`
- Deleted: `public/restaurant/bar-area.jpg`, `public/restaurant/dining-room.jpg`
- Updated schema images to only use real venue photos.

Virtual folders via rewrites
- We use Next.js rewrites to keep clean URLs without moving binaries immediately:
  - `/images/dishes/:path*` → `/dishes/:path*`
  - `/images/slideshow/(interior|exterior|garden)/:path*` → `/images/slideshow/:path*`
- This means you can organize paths semantically today; the underlying files remain unchanged for now.

Future (optional) physical re‑org
- If/when you want, we can physically move binaries into the virtualized structure; no code changes required thanks to the registry and rewrites.
