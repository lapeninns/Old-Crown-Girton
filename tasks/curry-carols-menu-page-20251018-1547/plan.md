# Implementation Plan: Curry & Carols Menu Page

## Objective
- Publish a Curry & Carols menu landing page so guests can review the festive menu, structured for SEO and matching existing seasonal storytelling pages.

## Success Criteria
- Route `/curry-and-carols-menu` (or agreed slug) renders within `RestaurantLayout` without breaking navigation.
- Hero section introduces Curry & Carols with CTA buttons (register interest / call) styled with DaisyUI-compatible classes.
- Menu content lists all sections/items from provided JSON with accessible headings and descriptions.
- JSON-LD metadata for a `Menu` entity is injected; `metadata` exports correct title/description/canonical URL.
- Page passes lint/build checks and manual QA (Chrome DevTools) with no console errors.
- Curry & Carols marketing surfaces (e.g., `/events`, `/events/curry-and-carols`) prominently link to the new menu.

## Architecture
### Components
- `app/curry-and-carols-menu/page.tsx`: server component defining metadata, structured data, hero, and menu sections.
- Reuse existing motion wrappers (`FadeIn`, `FadeInUp`, `MotionLinkButton`) and `SchemaInjector` for breadcrumbs.
- Option A: render menu with lightweight bespoke markup (cards/grid) tailored to provided copy; Option B: adapt `components/menu/MenuSections` by shaping data. (Leaning towards bespoke to keep festive storytelling format aligned with Christmas page.)

### State Management
- Static data constants; no client state expected beyond animation wrappers.

## Data Flow
- Hardcode Curry & Carols menu dataset inside the page module (typed arrays with slugs) since data source is a one-off seasonal menu.
- Convert dataset to JSON-LD structure for schema injection and to drive UI rendering.

## API Contracts
- No external API calls. Uses existing helpers (`getContactInfo`) for contact details already loaded synchronously.

## UI/UX Considerations
- Mobile-first layout with vertical stacking, then grid for wider breakpoints.
- Buttons must respect DaisyUI styling conventions (`btn` classes + custom tokens) and maintain `touch-action: manipulation`.
- Provide accessible headings hierarchy (hero `h1`, section `h2`, list items `h3`).
- Include focus-visible outlines, `aria-label`s for buttons, `sr-only` labels for emoji.
- Consider callout cards (reasons to attend, reassurance) similar to event page to reinforce event tone.

## Implementation Steps
1. Implement metadata constants (title/description/OG) using `getSEOTags`.
2. Define static menu data + helper to slugify item IDs and map into JSON-LD.
3. Build hero section with gradient background, DaisyUI-flavoured CTAs, `prefers-reduced-motion` guard, and breadcrumb schema injection.
4. Render menu sections (cards/grid) using motion wrappers; ensure semantics (`section`, `role=list`).
5. Add supporting content (experience highlights, booking guidance) reusing event tone, plus contact CTA block.
6. Inject JSON-LD via `renderSchemaTags`; ensure `touch-manipulation` and focus states; verify `aria` attributes.
7. Update content entry points if needed (e.g., add CTA in `/events/curry-and-carols` highlight) to surface the page.
8. Refresh `/events/curry-and-carols` hero copy, CTAs, and overview to reference the published menu.

## Edge Cases
- Menu data missing descriptions — default to safe fallback text.
- Phone number formatting uses non-breaking spaces for readability.
- `prefers-reduced-motion: reduce` users should not see animations.

## Testing Strategy
- Run targeted lint/build command (`npm run lint` or `npm run test -- curry`) if feasible; otherwise document inability.
- Add Jest/RTL smoke test verifying page renders menu headings (optional if time permits).
- Manual QA via Chrome DevTools: responsive emulation, console, accessibility, performance quick check.

## Rollout Plan
- Static deployment via existing Next.js build. No feature flag expected.
- Announce via navigation/events CTA; remove once event passes by editing nav JSON.
