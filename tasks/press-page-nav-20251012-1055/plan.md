# Implementation Plan: Press Page

## Objective

- Deliver a dedicated `/press` page highlighting media coverage and press resources, and expose it via the primary navigation bar.

## Success Criteria

- “Press” appears in the main navbar, respects existing sanitisation rules, and routes to `/press`.
- `/press` renders without console errors, matches the site’s visual language, and provides clear CTAs for media enquiries and key coverage.
- Page content remains accessible (keyboard focus, headings order, reduced-motion support) and responsive across breakpoints.

## Architecture

### Components / Files to Touch

- `public/data/nav.json` and `config/content.json` → append `/press` entry to keep data sources aligned.
- New page module `app/press/page.tsx` built around `RestaurantLayout`.
- Reuse `PressFeatureBanner` for the hero coverage block; create local data arrays for press mentions/resources within the page module.
- Potential shared types (simple interfaces) defined locally to avoid schema updates.

### Data Flow

- Navbar reads `press` link from JSON/config, passes through `useNavContent` and `sanitizeHref`.
- `/press` page fetches no remote data; it consumes locally defined content constants rendered into sections.
- Buttons linking to external press articles use `debugLink` wrapper to maintain consistent navigation behaviour.

### SEO & Metadata

- Leverage `getSEOTags` for `metadata` export and `renderSchemaTags` to inject structured data (`WebPage` + `BreadcrumbList`).

## Implementation Steps

1. Update navigation data files with the `/press` entry (keeping order consistent with other informational pages).
2. Scaffold `app/press/page.tsx` with reduced-motion style guard, `RestaurantLayout`, and metadata.
3. Implement hero section using `PressFeatureBanner` fed by a local content object (reusing Evening Standard coverage).
4. Build a media highlights grid (cards with publication name, summary, CTA) using DaisyUI classes; include links to existing blog press posts and external coverage (Evening Standard, Cambs Edition, Cambridge Independent, CAMRA, Visit South Cambs).
5. Surface the official Food Standards Agency hygiene rating prominently with an accessible card or badge linking to the source listing.
6. Add a “Press kit & enquiries” section with buttons for downloading assets or contacting the team (CTA to `mailto`/`/contact`).
7. Ensure headings hierarchy, breadcrumbs, and aria labels align with accessibility standards.
8. Run lint/build (where feasible) and update verification docs after DevTools QA.

## Edge Cases

- Missing hero data should fail gracefully — `PressFeatureBanner` already returns `null` if required fields absent; ensure page still renders subsequent sections.
- External links must open in new tabs with `rel="noopener noreferrer"`.
- On narrow screens, grids should collapse into single-column stacks to maintain readability.

## Testing

- Manual verification that navbar link routes correctly on desktop/mobile widths.
- Run `pnpm lint` (if available) to catch syntax/style issues.
- Manual QA via Chrome DevTools: responsive preview, accessibility tree, console log, and performance spot check.

## Rollout

- Static page addition; no feature flag required.
- Deployment via usual release process; no backfill or data migration necessary.
