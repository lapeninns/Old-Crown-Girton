# Implementation Plan: Homepage Review

## Objective
Evaluate the homepage implementation to surface UX, accessibility, performance, and code-structure issues while aligning with the `agents.md` standards.

## Success Criteria
- [ ] Document how the homepage is composed (server + client boundaries, data dependencies).
- [ ] Identify at least one finding (or explicitly confirm none) for each focus area: accessibility, performance/progressive loading, design-system adherence, and content/data integrity.
- [ ] Validate behaviour through Chrome DevTools manual QA per mandate.
- [ ] Produce actionable review notes with file/line references.

## Architecture
### High-Level Decisions
- Perform a non-invasive audit (no code changes) that synthesizes observations into actionable follow-up tasks.
- Anchor findings to existing DaisyUI/Tailwind conventions to keep recommendations aligned with current design system usage.
- Emphasize progressive enhancement checks (SSR fallbacks, placeholders) since homepage relies on staged content reveal.

### Components
- `app/page.tsx`: server entry, schema tags, data fetch, passes props to `ClientHomeContent`.
- `components/ClientHomeContent.tsx`: progressive layout orchestrator, wraps subsections.
- Section components (`AboutSection`, `MenuHighlights`, `PressFeatureBanner`, `QuickLinksSection`, `TestimonialsSection`, `TakeawayBanner`, `LocationSection`, `CallToActionSection`) handle specific UI blocks.
- `components/restaurant/Navbar.tsx` & `components/ClientFooter.tsx`: persistent chrome.

### State Management
- Server data retrieved from `getMarketingSmart` / `getContentSmart`.
- Client sections rely on context hooks (`useHomeContent`, `useParsedData`, `useContent`) with default fallbacks to avoid null states.

## Component Breakdown
- **Hero & Showcase**: `components/slideshow/Showcase.tsx`, `components/slideshow/DaisyUISlideshow.tsx`, plus `progressive-section--hero` wrapper.
- **About & Story**: `app/_components/AboutSection.tsx` driven by `useHomeContent` normalized copy.
- **Menu Highlights**: `app/_components/MenuHighlights.tsx` using DaisyUI cards for featured dishes.
- **Press Feature Banner**: `app/_components/PressFeatureBanner.tsx` referencing `public/press/*.jpg` assets.
- **Quick Links & CTA**: `app/_components/QuickLinksSection.tsx`, `CallToActionSection.tsx` sourcing button metadata.
- **Social Proof**: `app/_components/TestimonialsSection.tsx` with carousel semantics.
- **Utility Sections**: `TakeawayBanner.tsx`, `LocationSection.tsx`, plus shared `ClientFooter.tsx`.

## Data Flow
- Server loader fetches marketing/content JSON (with optional API fallback) → `homeContent.sections` → props to client sections.
- CTA button labels fall back to `marketing.buttons` map when keys missing.
- Press feature merges defaults with CMS overrides for resilience.
- Location and hours data combine static defaults with `homeContent.details`.

## API Contracts & Data Sources
- `src/lib/data/server-loader.ts`: `getMarketingSmart()` resolves marketing copy `{ hero: {...}, buttons: {...} }`.
- `src/lib/data/content-loader.ts`: `getContentSmart()` returns structured `HomeContent` containing `sections`, `details`, and `media`.
- No external HTTP APIs on render path; all data sourced locally or via cached CMS JSON files.

## UI/UX Considerations
- Fixed navbar overlays content; review scroll/focus handling.
- Progressive loading placeholders should prevent CLS; verify transitions and prefers-reduced-motion handling.
- Ensure mobile-first responsiveness, touch targets, and DaisyUI usage (e.g., slideshow).
- Check for accessible labelling (aria attributes, heading hierarchy, live regions).
- Confirm call-to-action buttons maintain ≥44px touch targets and use `:focus-visible`.
- Validate typography scale and spacing tokens across breakpoints per design system.

## Testing Strategy
- Manual QA through Chrome DevTools (console, performance, responsiveness, accessibility audit).
- Spot-check component behaviour in responsive breakpoints and reduced-motion mode.
- Review server/client boundary for hydration safety (look for warnings, fallback states).
- Capture screenshots or notes for any regression-prone areas (e.g., slideshow controls, sticky navbar interactions).
- If time permits, run Lighthouse accessibility/performance audits to quantify findings.

## Edge Cases
- Missing CMS data: ensure defaults keep sections rendering without crashes.
- Slow network: confirm placeholders and progressive sections behave gracefully.
- Reduced motion preference: transitions should disable appropriately.
- Navigation focus: verify skip links or focus management with fixed navbar.
- Locale/formatting: ensure phone/address fields remain accessible when data falls back to defaults.

## Rollout Plan
- Deliver findings in final review response (no code changes planned).
- If issues discovered, recommend follow-up tasks referencing affected files/components.

## Implementation Steps
1. Map the live homepage DOM to the component/file structure using DevTools → corroborate with source files.
2. Review server composition (`app/page.tsx`, loaders) to document data dependencies and fallback logic.
3. Inspect each section component for DaisyUI usage, accessibility semantics, and placeholder behaviour.
4. Execute Chrome DevTools QA: responsive layouts, reduced-motion, performance (network throttling, CPU), console errors.
5. Summarize findings per focus area with supporting evidence (file references, screenshots/metrics as needed).
6. Validate checklist against success criteria; capture outstanding questions for follow-up tasks.
