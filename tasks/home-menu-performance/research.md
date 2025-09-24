# Research

- **Current metrics**: User reports LCP ≈ 3.0 s and TTFB ≈ 0.81 s on `/` and `/menu`. Slow LCP likely due to the hero slideshow (large AVIF) while TTFB suggests server still doing synchronous data loading per request.
- **Home page data flow**: `app/page.tsx` fetches marketing + content every request via `getMarketingSmart`/`getContentSmart`. These loaders already cache filesystem data in `globalCache`, so we can turn the page static/ISR by declaring `export const revalidate`, reducing per-request work.
- **Slideshow first paint**: `Slide.tsx` uses `next/image` with `priority` for slide index 0, but we still wait for the session selection effect. We now pick session slides in a `useEffect`, meaning the initial render uses a deterministic static set. Ensuring the first image preloads (`priority`, `fetchPriority="high"`) plus a crossfade avoids grey gaps.
- **Menu page**: `app/menu/page.tsx` concurrently loads marketing, content, and menu data. It already defaults to starters via `defaultSelectedStarters`, but site links still reference `/menu`, not the `#starters` hash. Making the page ISR-ready and updating links will reduce TTFB and open at the desired section.
- **Navigation links**: `config/content.json` defines primary and footer menu links with `
