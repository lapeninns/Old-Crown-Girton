# Research: Curry & Carols Menu Page

## Initial Requirements
- Create a dedicated page (likely `/curryandcarolsmenu`) presenting the provided Curry & Carols menu content.
- Follow existing site structure, styling patterns, and DaisyUI conventions.

## Initial Success Criteria
- Page renders all menu sections (Starters, Mains, Dessert & Hot Drinks) with names and descriptions matching the supplied copy.
- URL and navigation align with project routing approach; page integrates with build without breaking existing routes.

## Existing Patterns
- `app/christmas-menu/page.tsx`: full festive menu page that uses `RestaurantLayout`, `FadeIn`/`FadeInUp` motion wrappers, and embeds JSON-LD via `renderSchemaTags`. Menu content is defined as typed constants with helper `slugify` and rendered inline with Tailwind styling and DaisyUI-inspired button treatments.
- `app/wakes-menu/page.tsx`: compact single-menu page with hero gradient, structured data, reassurance cards, and CTA buttons. Demonstrates use of `MotionLinkButton` with accessible focus styles and `touch-manipulation` for mobile interactions.
- `app/events/curry-and-carols/page.tsx`: existing Curry & Carols landing content. Shares CTA, breadcrumb injection through `SchemaInjector`, and consistent gradient hero styling we can mirror so event and menu feel cohesive.
- `components/menu/MenuSections.tsx` and `MenuItemCard`: general-purpose menu grid implementation (card layout, semantic `<section>` per category, item counts). Useful if we want consistent card presentation instead of bespoke markup.
- DaisyUI button classes (`btn`, `btn-primary`, etc.) appear across interactive components (e.g., `components/ButtonCheckout.tsx`, `app/press/page.tsx`), so new CTAs should at least adopt DaisyUI tokens or extend their classes via Tailwind layers.

## External Resources
- DaisyUI documentation (https://daisyui.com/components/button/) for ensuring CTA styling respects existing design tokens if we compose with DaisyUI classes.
- WAI-ARIA Authoring Practices for keyboard/focus expectations already encoded in current pages.

## Technical Constraints
- Next.js App Router with TypeScript; pages live under `app/<route>/page.tsx` and export `metadata` via `getSEOTags`.
- Tailwind CSS + DaisyUI theme (see `tailwind.config.js`); class names like `bg-gradient-to-br`, `touch-manipulation`, `font-display` already in use.
- Structured data is injected using `renderSchemaTags` (server component safe) or `<script>` tags; ensure new menu provides `@type: Menu` JSON-LD.
- Animations powered by `framer-motion` wrappers—must include prefers-reduced-motion guard as seen on other festive pages.
- `RestaurantLayout` expects children wrapped in sections and handles SEO `<main>` semantics; reuse to maintain consistent navigation/head/footer.

## Recommendations
- Create a dedicated App Router segment `app/curry-and-carols-menu/page.tsx` (slug with hyphens matches existing conventions) exporting `metadata` via `getSEOTags`.
- Define Curry & Carols menu data as typed constants mirroring `FestiveMenu` shape from `christmas-menu` or reuse `MenuSections` by normalising the supplied JSON (starters/mains/dessert) into `Menu['sections']`.
- Reuse gradient hero banner pattern from `curry-and-carols` event page for visual continuity; include CTA buttons (`MotionLinkButton`) styled with DaisyUI classes layered on top.
- Build structured data array using `renderSchemaTags` with `Menu` schema referencing each section/item, plus breadcrumb injection via `SchemaInjector`.
- Ensure mobile-first layout: vertical stacking, large tap targets with `touch-manipulation`, responsive grids for menu items, and `font-display` headings.
- Consider sharing data via `menu` directory JSON if other systems need it; otherwise keep typed constants within the page for now.

## Open Questions
- Should the existing `/events/curry-and-carols` CTA add a direct link to the new menu page once built?
- Confirm preferred final slug (`/curry-and-carols-menu` vs `/curryandcarolsmenu`); planning assumes hyphenated for readability/SEO.
