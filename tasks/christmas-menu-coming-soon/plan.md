# Plan: Christmas Menu Coming Soon Page

## Goal
Launch a `/christmas-menu` landing page that teases the 2025 festive offering, keeps visitors engaged, and integrates seamlessly with existing navigation, branding, accessibility, and SEO infrastructure.

## Implementation Steps

1. **Route & Metadata Setup**
   - Create `app/christmas-menu/page.tsx` using `RestaurantLayout` to inherit navbar/footer and global styling.
   - Export `metadata = getSEOTags({...})` with a keyword-rich title/description (`Cambridge Christmas menu`, `Old Crown Girton`, `best Christmas menu 2025`, `Girton`) and canonical URL `/christmas-menu`.
   - Inject breadcrumbs via `SchemaInjector` and emit structured data with `renderSchemaTags` (reuse existing helper pattern from `app/about/page.tsx`).
   - *Double-check*: ensure metadata keywords align with copy; avoid keyword stuffing. Validate there’s no conflict with other `metadata` exports.

2. **Page Content Architecture**
   - Design a multi-section narrative to keep visitors reading:
     - **Hero**: Gradient background with lively Christmas badge (emoji + sr-only label), short teaser, CTA buttons (`Book Early`, `Join Festive Waitlist` linking to contact form/phone).
     - **Festive Highlights**: Card grid (3–4 items) using brand colors, emphasising menu sneak peeks, local sourcing, ambiance; include structured icons/emoji with `aria-hidden`.
     - **Timeline / What to Expect**: Step list showing announcement, tastings, full release dates; emphasise booking timeline to match competitor messaging.
     - **Engagement CTA**: Newsletter-style block encouraging updates/booking calls (reuse pattern from blog newsletter but adapt to Christmas theme, ensure input meets accessibility requirements if included; otherwise provide `tel:` and `mailto:` links).
     - **FAQ/Assurance strip**: bullet row covering dietary flexibility, private hire, deposit policy to answer common queries.
   - Use `FadeIn` / `FadeInUp` motion wrappers, but wrap animations in `prefers-reduced-motion` friendly components already provided.
   - *Alternative check*: If timeline feels redundant, confirm at least one longform section plus CTAs still deliver engagement; adjust copy length to avoid TL;DR.

3. **Seasonal Styling & Accessibility Guardrails**
   - Apply Christmas-accent colors using existing tokens (e.g., `crimson`, `cardamom`, `brand`). Ensure contrast > APCA threshold (compare against brand backgrounds already used).
   - Provide focus-visible styles on interactive elements (buttons, links) consistent with current pattern (`focus:ring`).
   - Keep emoji decorative via `aria-hidden` or include visible labels; ensure headings follow semantic order (`h1` then `h2`, etc.).
   - Respect responsive breakpoints (stack columns on `md`, maintain safe spacing on mobile) and guarantee hit targets ≥24px.

4. **Navigation & Discovery Updates**
   - Update `public/data/nav.json` and `config/content.json` (`global.navigation.header.links` and footer quick links) to add the Christmas Menu link. Label idea: `Christmas Menu 🎄` with fallback plain text; confirm filters in `Navbar.tsx` keep it.
   - Enhance `Navbar.tsx` to decorate the Christmas link (e.g., pill background, subtle shimmer) without breaking layout. Approach: conditional className injection when `sanitizeHref(link.href) === '/christmas-menu'`, include `aria-hidden` for emoji but keep accessible text.
   - Verify mobile nav retains readability and focus order; ensure decoration doesn’t interfere with button spacing.

5. **SEO & Sitemap**
   - Add `/christmas-menu` entry to `app/sitemap.ts` with appropriate priority (`0.85?` seasonal) and change frequency (likely `weekly` during season). Set `lastModified` to current date.
   - Consider whether `next-sitemap.config.js` needs manual update (check config; currently sitemap is custom—no extra change needed beyond `app/sitemap.ts`).

6. **Verification & Quality Checks**
   - Manually review page on desktop and mobile widths (`npm run lint` or `npm run test -- christmas?` optional). At minimum, run `npm run lint` to catch TypeScript/ESLint errors.
   - Navigate keyboard-only through nav and new page to ensure focus order and visible outlines (manual mental checklist if full run not available).
   - Re-read copy for tone alignment and keyword inclusion; ensure CTAs link to existing endpoints (`/contact`, `tel`, etc.).
   - Confirm JSON edits remain valid (no trailing commas) and nav link appears once (avoid duplicates).

## Open Questions / Risks
- **Newsletter form vs. CTA button**: If real form action isn’t available, default to contact CTA; avoid fake submission flows.
- **Animation load**: Added decorations must respect reduced-motion (e.g., rely on existing motion wrappers). If custom shimmer considered, provide reduced-motion fallback.
- **Content length**: Balance depth with readability; keep sections scannable via subheadings so visitors stay engaged.

## Definition of Done
- `/christmas-menu` renders a polished, accessible teaser page with multi-section narrative, consistent styling, and correct metadata.
- Nav & footer expose the page with decorative yet accessible cue.
- Sitemap includes the new route.
- Linting passes; no regressions detected in touched areas.
