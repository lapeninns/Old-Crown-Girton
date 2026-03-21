---
task: frontend-consistency-polish
timestamp_utc: 2026-03-21T14:13:36Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: Frontend Consistency Polish

## Requirements

- Functional:
  - Polish the frontend UX/UI so the homepage, shared shell, and key interior routes feel like one coherent product.
  - Improve consistency across navigation, section spacing, typography, CTA styling, and footer treatment.
  - Adopt the new "Digital Maître d'" / "Heirloom Gastropub" art direction with a warm charcoal base, muted brick primary, brass accents, glass overlays, and a no-line sectioning rule.
  - Preserve all existing route behavior, booking/contact flows, and content architecture.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Preserve keyboard navigation, visible focus states, and reduced-motion support.
- Reuse the existing design system and current content patterns rather than introducing a parallel UI layer.
- Move shared typography to `Newsreader` and `Manrope` so the editorial system is codified at the app shell level.
  - Keep the pass lightweight enough that the app still builds cleanly without new dependencies.

## Existing Patterns & Reuse

- `src/design-system/recipes.ts` already defines button, card, section, hero, and panel recipes that can be extended rather than bypassed.
- `components/restaurant/Navbar.tsx` and `components/ClientFooter.tsx` already act as the primary shared shell.
- The homepage composition in `components/ClientHomeContent.tsx` and `app/_components/*` is already moving toward a stronger editorial rhythm.
- Interior routes such as `/about`, `/contact`, `/events`, and `/menu` already use the design-system helpers, but they still vary in hero density, panel treatment, and section cadence.

## Constraints & Risks

- The worktree already contains unrelated in-progress edits, so any touched files must be updated carefully without reverting user changes.
- The app has many routes; this pass should prioritize shared primitives and high-traffic pages instead of attempting a page-by-page redesign across the entire repo.
- The current visual language leans on many bordered cards and inconsistent shell treatments, so the main risk is creating partial improvements that still feel fragmented.
- Chrome DevTools MCP is required by repo policy for UI changes, but it is not available in this session; manual browser verification will need a fallback or a follow-up.

## Open Questions (owner, due)

- Q: Should this pass extend to every long-tail blog/article route visually, or focus on shared layouts plus top-level marketing pages?
  A: Focus on shared layout surfaces and the highest-traffic marketing routes first, so the long-tail routes inherit the improved baseline. Owner: maintainers. Due: this pass.

## Recommended Direction (with rationale)

- Strengthen the shared system first: global tokens, navbar, footer, and reusable section rhythms.
- Make the shared system darker and more tonal so legacy route content inherits the new gastropub mood without route-specific rewrites.
- Use the homepage as the visual anchor and align the major interior pages to the same tone: warmer editorial hierarchy, fewer unnecessary card treatments, clearer CTA groups, and stronger contrast between sections.
- Keep the first viewport on major pages poster-like and brand-forward, while using restrained motion and simpler supporting layouts beneath it.
