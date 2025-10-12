# Research: Press Page

## Initial Requirements & Success Criteria

- Add a dedicated "Press" page accessible from the main navigation.
- Ensure the new navigation item follows existing styling and responsive behavior.

## Existing Patterns

- `components/restaurant/NavbarParts.tsx` sources links from `public/data/nav.json` (or `content.global.navigation.header.links`), sanitises hrefs, and drops `/` and `/contact`, so additional links must use unique paths like `/press`.
- Informational pages such as `app/privacy-policy/page.tsx` and `app/events/page.tsx` render within `RestaurantLayout`, start with a hero section, and layer content blocks with `FadeIn` motion wrappers and DaisyUI utility classes.
- `components/restaurant/sections/PressFeatureBanner.tsx` already presents a stylised press highlight block with CTA and quote, matching the home page press feature.
- Blog metadata for press coverage lives under `app/blog/page.tsx` (`Press & Media` category) and `app/blog/evening-standard-country-pub-of-the-week/page.tsx`, which we can reference or link to from the new page.

## External Resources

- Evening Standard feature already referenced in content: https://www.standard.co.uk/going-out/bars/old-crown-girton-hotel-pub-review-b1249473.html
- Food Standards Agency hygiene rating listing: https://ratings.food.gov.uk/business/1750898/old-crown-girton?utm_source=chatgpt.com
- Cambs Edition makeover article: https://cambsedition.co.uk/food-drink/the-old-crown-a-royal-makeover/?utm_source=chatgpt.com
- Cambridge Independent reopening coverage: https://www.cambridgeindependent.co.uk/lifestyle/revamped-old-crown-in-girton-celebrates-reopening-with-launch-party-9052915/?utm_source=chatgpt.com
- Cambridge CAMRA pub guide: https://pubs.cambridge-camra.org.uk/viewnode.php?id=1636&utm_source=chatgpt.com
- Visit South Cambs hospitality listing: https://visitsouthcambs.co.uk/hospitality/old-crown-girton/?utm_source=chatgpt.com

## Technical Constraints

- `NavDataSchema` (`lib/schemas.ts`) enforces `{ href: string; label: string }` for navigation entries; both `public/data/nav.json` and `config/content.json` should stay in sync.
- The content schema currently enumerates only existing pages, so bespoke `/press` copy can live within the page module rather than `config/content.json` unless the schema is extended.
- Navbar filtering omits `/contact`, so the dedicated CTA must remain for contact while new page must handle responsiveness via DaisyUI classes.
- Accessible design standards (focus management, `aria` landmarks, responsive breakpoints, reduced motion handling) should mirror existing informational pages.

## Open Questions

- Confirm whether press mentions should be hard-coded or eventually sourced from CMS/blog data—proceeding with static structured content and links for this iteration.
- Determine if additional assets (images for media logos) are required; current asset registry lacks press-specific images, so reuse existing venue imagery unless instructed otherwise.

## Recommendations

- Insert a `/press` link labeled “Press” into both `public/data/nav.json` and `config/content.global.navigation.header.links` to keep navbar data sources consistent.
- Create `app/press/page.tsx` using `RestaurantLayout`, a reduced-motion guard, and accessible hero structure similar to `privacy-policy`, reusing `PressFeatureBanner` for headline coverage and building follow-up sections (media highlights grid, press kit resources, contact info).
- Leverage DaisyUI button/badge classes for CTAs, include breadcrumbs for context, and surface `Press & Media` blog posts / external articles via cards with `aria-label` support.
- Prepare to add metadata via `getSEOTags` and `renderSchemaTags` to match SEO patterns across pages.
