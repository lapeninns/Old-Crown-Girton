# Research: Wakes Menu Page

## Existing Patterns
- `RestaurantLayout` (`components/restaurant/Layout.tsx`) wraps marketing-style pages, auto-including navbar/footer and sets `main#main-content` focus target with padding for fixed nav.
- Simpler menu-related pages (e.g. `app/takeaway-menu/page.tsx`) use motion helpers (`FadeIn`, `FadeInUp`, `MotionLinkButton`) from `components/animations/MotionWrappers.tsx` for staged reveals and accessible button semantics (`role="button"`, keyboard-safe).
- Menu CTAs and button styling lean on gradient hero sections, rounded cards, and `Link` from `@/lib/debugLink` for internal navigation (`MenuHero` uses this pattern with stacked CTA buttons and gradients).
- `MenuHero` (`app/menu/_components/MenuHero.tsx`) already renders a CTA row with “Takeaway Menu”, “Book Online”, and “Order Takeaway” buttons using brand colors, implying we should add the new CTA alongside these buttons for consistency.
- Metadata utilities (`getSEOTags`, `renderSchemaTags`) provide structured data + SEO defaults for menu-style pages (`takeaway-menu` references). Schema data mirrors menu content and uses contact info from `getContactInfo()`.

## Content Requirements
- New `/wakes-menu` page must list items: Sandwich (egg & mayo / bacon & cheese), Chicken Wings, Veg/Meat Samosa (bundle £10), plus Chicken Pakora add-on (+£2.50) and Tea/Coffee options.
- CTA on `/menu` should link users to the new Wakes menu.

## Reuse Opportunities
- Reuse `RestaurantLayout`, motion wrappers, and existing gradient hero styling to stay brand-consistent and meet accessibility/animation guidelines (prefers-reduced-motion handled globally via layout and existing patterns).
- Internal links should use `Link` (`@/lib/debugLink`) for SPA navigation and proper focus/ARIA support.
- For pricing lists, existing menu card styles (`components/menu/MenuSections.tsx`, `components/optimized/OptimizedMenuItemCard.tsx`) provide semantics and layout ideas (name, description, price, dietary tags). A trimmed-down list component can mirror these patterns without overcomplicating data requirements.
- SEO: follow `takeaway-menu` approach with `getSEOTags` + `renderSchemaTags` for a single menu, including structured data items.

## Open Points
- Need to decide hero copy/subheading for Wakes menu (tone consistent with other pages).
- Determine whether Wakes menu is printable/downloadable (no asset supplied, assume simple on-page menu unless told otherwise).
