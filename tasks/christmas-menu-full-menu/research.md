# Research – Christmas Menu Full Menu

## Existing Christmas menu page
- `app/christmas-menu/page.tsx` currently presents a “coming soon” hero and overview sections with `RestaurantLayout`, `FadeIn`, `FadeInUp`, and CTA buttons. It exposes schema data for an upcoming event but **does not render any structured menu sections** yet.
- Page already uses `getContactInfo()` for CTA links and `SchemaInjector` for breadcrumbs.

## Menu presentation patterns in repo
- Static, marketing-style menus (e.g. `app/wakes-menu/page.tsx`, `app/takeaway-menu/page.tsx`) compose bespoke sections with rich copy, highlight cards, and schema updates. They frequently define `const structuredData = [...]` with `@type: "Menu"` or relevant item listings.
- Interactive menus leverage shared UI in `components/menu`, especially `MenuSections.tsx` and `MenuItemCard.tsx` for grid layouts, card styling, accessible list semantics, and dietary badges. These components expect data shaped like `Menu['sections']` from `src/lib/data/schemas`.
- `MenuSections` automatically renders section headings, descriptions, and item grids with consistent theming (neutral background, accent divider). It filters sections and gracefully handles empty states, and is ready for hydration-safe usage.

## Data + schema examples
- `app/wakes-menu/page.tsx` demonstrates how to structure schema.org `Menu` metadata with nested `hasMenuSection`/`hasMenuItem`. That page also shows accessible section headings (`aria-labelledby`) and highlight card layout that could inspire new sections if we mix descriptive content with menu listings.
- Core menu datasets live under `/menu/*.json`, but seasonal pages appear to embed their own data instead of updating global menu JSON.

## Accessibility & UX guardrails (from repo & provided brief)
- Existing pages enforce visible focus styles (`focus-visible` rings) and use semantic elements (`section`, `h1`/`h2`, `<article>`). Must keep these patterns when injecting new menu content.
- `MenuSections` components already implement generous hit targets, grid layout, focusable cards, and mark dietary info via accessible badges.
- Need to preserve `prefers-reduced-motion` handling – the page already injects CSS disabling motion for reduced-motion users.

## Gaps / open questions
- Need to confirm whether the Christmas page should remain mostly marketing copy with sections + cards, or transition to a fully fledged menu layout (likely the latter per user request).
- Determine if price information should be displayed (input data has none); `MenuItemCard` gracefully omits price when missing.
- Decide how to integrate two conceptual groupings: a full multi-course menu with sections (starters, mains, sides, desserts, footer) and a shorter “Chef’s Christmas Selections” bundle including price per person.

No external research was required; codebase provided sufficient patterns.
