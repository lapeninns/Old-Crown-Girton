# Research: Christmas Menu Coming Soon Page

## Repository Patterns & Layout
- **RestaurantLayout** (`components/restaurant/Layout.tsx`) wraps most marketing pages, injecting the fixed navbar (`Navbar`/`NavbarStatic`) and footer. Pages slot content inside `<main>` with padding to offset the fixed nav. Reusing this layout keeps typography, spacing, and theming consistent.
- **Hero treatments** on pages like `app/about/page.tsx` and `app/events/page.tsx` favour gradient backgrounds (`bg-gradient-to-br from-brand-600 to-brand-800`) with light overlays and centered typography using `font-display` for headings. Motion helpers like `FadeIn` layer subtle entrance animations while respecting `prefers-reduced-motion`.
- **Content rhythm**: sections typically use `max-w-4xl`/`6xl` containers with generous `py-16` spacing, cards with `rounded-2xl`/`shadow-xl`, and brand palette classes (`brand`, `accent`, `neutral`). Copy blends heritage storytelling with practical CTAs (bookings, callouts, sign-ups).

## Navigation & Data Sources
- Primary nav links load from `public/data/nav.json` via `useParsedData('nav.json', NavDataSchema)`, with a fallback to `content.global.navigation.header.links` (`config/content.json`). Updating both keeps nav consistent across dynamic/static paths.
- Footer quick links also derive from `config/content.json` (`global.navigation.footer.sections[0].links`). Any new evergreen page usually appears here for discoverability and SEO crawl depth.
- `Navbar.tsx` filters out `/` and `/contact`, then maps remaining links to styled `<Link>` components. Custom styling for a specific href is easiest by checking `link.href` inside the map.

## SEO & Metadata
- Pages commonly export `metadata = getSEOTags({...})` to inject title, description, keywords, canonical URLs, and OG data. About page demonstrates pattern (`app/about/page.tsx`). Structured data is handled via `renderSchemaTags` and `SchemaInjector` (for breadcrumbs).
- Global keywords in `content.global.site.keywords` skew toward heritage pub + Nepalese cuisine. For Christmas launch we should weave in seasonal search terms: "Cambridge Christmas menu", "best Christmas menu 2025", "Old Crown Girton", "Girton Christmas dining". Need to ensure keywords appear in metadata *and* page copy organically.

## Copy Tone & Engagement Devices
- Tone is warm, heritage-forward, emphasising community, authenticity, and unique experiences (see `config/content.json` home/about sections). Long-form narratives with bullet cards and emoji accents are acceptable (`app/events/page.tsx` uses emoji badges).
- Engagement patterns include: feature cards with icons/emojis, timeline storytelling, FAQ accordions, newsletter sign-up modules (`app/blog/page.tsx`), and motion wrappers for dynamic feel. Calls-to-action often include `Book Online`, `Call Now`, or `Join Newsletter` style buttons using brand colors.

## Accessibility & Interaction Considerations
- Navbar link styling must maintain focus visibility (`focus:outline-none focus:ring` is common for buttons). For emoji embellishments, provide `aria-hidden` or descriptive text to avoid redundancy.
- Seasonal flair needs to preserve contrast (APCA/WCAG guidance from `agents.md`). Decorative visuals should not be purely color-dependent and must honour reduced-motion preferences if animated.

## Gaps & Assumptions to Challenge
- No existing "Coming Soon" template—will need to assemble from existing primitives (hero, info cards, CTA blocks). Verify that introducing a new section structure will not break visual consistency.
- Need to confirm there isn’t already a Christmas-specific dataset elsewhere (searched repo for "christmas"; only found design documentation). Safe to create bespoke copy.
- Must ensure updates to `ContentSchema` aren’t required when adding nav links—Zod object is non-strict (strip mode), so additional links OK. No schema updates needed if page content lives within component file.

## External Context Check
- Quick scan of seasonal SEO trends (DuckDuckGo search for "Cambridge Christmas menu 2025" – manual observation) shows competitors emphasise early booking, festive set menus, and Cambridge/Girton locale keywords. Useful to mirror messaging: highlight booking timelines, local exclusivity, and glimpses of dishes/drinks.

## Key References
- Layout baseline: `components/restaurant/Layout.tsx`
- Nav styling logic: `components/restaurant/Navbar.tsx`, data `public/data/nav.json`, fallback `config/content.json`
- SEO helper: `libs/seo.tsx`
- Motion helpers: `components/animations/MotionWrappers.tsx`
- Newsletter CTA pattern: `app/blog/page.tsx` (newsletter section)
