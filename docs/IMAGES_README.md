Image Organization and Usage

Overview
- All image paths are centralized via a single registry: `src/lib/images.ts`.
- Code should import image paths from this registry rather than hardcoding strings.
- This keeps references consistent and makes future moves/optimizations trivial.

Structure (physical folders)
- Public brand assets
  - `public/images/brand/Oldcrowngirtonlogo.png`
  - `public/images/brand/OldCrownLogo.png`
  - `public/images/slideshow/OldCrownGirtonBuilding.png`
- Venue photos (slideshow set)
  - `public/images/slideshow/{interior,exterior,garden}/*.{jpg,jpeg,png}`
  - Referenced via the registry or static imports
- Dish photos
  - `public/images/food/*.jpeg`

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
   - Venue: `public/images/slideshow/{interior|exterior|garden}/`
   - Dish: `public/images/food/`
   - Brand: `public/images/brand/`
2) Add a stable mapping in `src/lib/images.ts`.
3) Use the new key in the UI.

Required slideshow photos (current canonical set)
- Place images in the categorized folders:
  - `interior/the-old-crown-pub-restaurant-interior-dining.jpg`
  - `interior/stylish-pub-restaurant-dining-area-interior.jpeg`
  - `interior/cosy-pub-bar-area-with-games-machine.jpeg`
  - `interior/comfy-bar-lounge-with-armchairs-and-tv.jpeg`
  - `interior/premier-league-sky-tv-sports.jpeg`
  - `garden/family-friendly-pub-garden-with-picnic-tables.jpeg`
  - `garden/spacious-beer-garden-and-outdoor-seating.jpeg`
  - `garden/sunny-pub-garden-patio-seating-wellingborough-terrace.jpeg`
  - `garden/childrens-wooden-play-area-with-slide-in-pub-garden.jpeg`
  - `exterior/the-old-crown-pub-exterior-and-beer-garden.jpeg`
  - `exterior/large-gravel-car-park-at-the-old-crown-pub.jpeg`

Notes
- Legacy placeholder slideshow images were removed to prevent accidental reuse.

Removed placeholders
- Deleted: `public/hero-restaurant.jpg`
- Deleted: `public/restaurant/bar-area.jpg`, `public/restaurant/dining-room.jpg`
- Updated schema images to only use real venue photos.

URL conventions
- Dishes keep a stable virtual path (legacy compatible):
  - `/images/dishes/:path*` → `/images/food/:path*`
- Slideshow images are served directly from categorized folders under `/images/slideshow/...`.

Future (optional) physical re‑org
- If/when you want, we can physically move binaries into the virtualized structure; no code changes required thanks to the registry and rewrites.
