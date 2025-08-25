Images moved and slideshow updated
=================================

What I changed
--------------

- Added the new interior images (from your `images/` attachment) to `public/images/slideshow/`:
  - `InteriorView.jpeg`
  - `InteriorView1.jpeg`
  - `InteriorView2.jpeg`
- Replaced `public/restaurant-interior.jpg` with your `InteriorViewBar.jpeg` so the `AboutSection` uses the new bar interior.
- Updated `components/slideshow/slides.ts` to use three slideshow images from `public/images/slideshow/`.

Files touched
-------------

- `public/images/slideshow/InteriorView.jpeg` (copied)
- `public/images/slideshow/InteriorView1.jpeg` (copied)
- `public/images/slideshow/InteriorView2.jpeg` (copied)
- `public/restaurant-interior.jpg` (replaced)
- `components/slideshow/slides.ts` (updated to reference new images)

How the images are used
-----------------------

- Slideshow (homepage): uses `/images/slideshow/InteriorView.jpeg`, `/images/slideshow/InteriorView1.jpeg`, `/images/slideshow/InteriorView2.jpeg` (3 slides)
- About section (homepage): uses `/restaurant-interior.jpg` (now the provided bar interior image)

How to preview locally
----------------------

1. Install dependencies if needed:

   npm install

2. Run dev server:

   npm run dev

3. Open `http://localhost:3000` and verify the slideshow and About section images.

Notes
-----

- I ran the test suite (`npm test`) — tests reported no failures.
- A full production build (`npm run build`) failed due to unrelated TypeScript/webpack issues in API route files (duplicate variable name `environment` and downlevel-iteration settings). Those are not caused by the image updates. If you want, I can fix the build issues as a follow-up.

If you want different images used, or different ordering/alt text, tell me which filenames to use and I will update `components/slideshow/slides.ts` accordingly.
