# Accessibility Audit & Design System Notes

## Summary
This repository was audited for accessibility and design-system conformance focusing on color contrast, semantic typography, and a few critical component-level a11y issues. Automated Playwright + axe tests were run across a representative matrix and targeted fixes applied.

High-level outcome:
- Playwright + axe full accessibility matrix: `44 passed` (all projects green).
- Lint: `npm run lint` produced warnings only (no blocking errors).
- Key fixes applied: semantic foreground utilities, `Button` accessibility improvements, `/menu` aria-controls fix, and minimal contrast fixes on `/about` and `/contact`.

## How to run the checks locally
1. Start Next.js dev server:
   - `npm run dev`
2. Ensure Playwright dependencies installed (first time):
   - `npm run e2e:install`  (or `npx playwright install --with-deps`)
3. Run the accessibility e2e spec:
   - Full matrix: `npx playwright test e2e/accessibility.spec.ts --reporter=list`
   - Single project (fast iteration): `npx playwright test e2e/accessibility.spec.ts --project="Pixel 7 (Dark)" --reporter=list`

Artifacts are written to `test-results/` with per-page `axe-results.json` files (e.g. `test-results/a11y-about/axe-results.json`) and per-run media directories for failing runs.

## Token / CSS mappings
Primary runtime tokens are declared in `app/globals.css` (CSS variables). To improve adaptive contrast, the following semantic utilities were added and used:

- `.text-foreground` — maps to `var(--color-text)` (general body copy)
- `.text-foreground-strong` — maps to `var(--color-text-primary)` (strong emphasis / interactive states)
- `.text-foreground-subtle` — maps to `var(--color-text-secondary)` (muted text)

These utilities are designed to be theme-aware (dark/light overrides are handled via the CSS variables in `app/globals.css`). Prefer these semantic classes for small / interactive / hover states instead of raw accent colors.

## Files changed (high level)
- `app/globals.css` — added semantic foreground utility classes and verified dark-mode overrides.
- `components/restaurant/Button.tsx` — a11y improvements: added `type`, `ariaLabel` support, safe disabled handling for anchor variant, loading spinner that respects `prefers-reduced-motion`.
- `components/menu/MenuInteractive.tsx` — fixed `aria-controls` to reference an existing/conditional id.
- Several UI components/pages were updated to use semantic foregrounds for small/interactive copy (conservative patches):
  - `app/about/page.tsx` (emphasized span → `text-neutral-50` for hero)
  - `app/contact/page.tsx` (emphasized span → `text-neutral-50`; feature list spans updated to `text-foreground`)
  - `components/restaurant/Navbar.tsx`, `Footer.tsx`, `OptimizedMenuItem.tsx`, `Hero.tsx`, `Slide.tsx`, `MenuSections.tsx` — hover and small text changed to use `.text-foreground*` where contrast failures were observed.

Refer to the commit history or search for `text-foreground` / `text-foreground-strong` to see exact locations.

## What was fixed
- /menu `aria-controls` referencing a non-existent id — fixed to use the conditional id used by the controlled element.
- `components/restaurant/Button.tsx`:
  - Added `type` prop (defaults to `button` for `<button>` variant) to avoid accidental form-submissions.
  - Added `ariaLabel` prop to support icon-only buttons.
  - When rendered as an anchor (`<a>`), disabled state now prevents pointer events and sets `aria-disabled` appropriately; we avoid using `disabled` on `<a>` elements.
  - Loading spinner added and `prefers-reduced-motion` respected.
- Color contrast issues (identified by axe) were addressed with minimal changes — either swapping to `text-foreground*` utilities or using `text-neutral-50` for hero-heavy use-cases.

## Tests & Quality gates
- Playwright accessibility matrix: PASS — `44 passed` (full matrix run completed with no axe violations).
- Lint: WARNINGS only — `npm run lint` emitted several `no-unused-vars` and a few other warnings; these are pre-existing and not introduced by the focused a11y patches.

Mapping to requirements:
- Design System audit: Done — token/CSS mappings identified and semantic utilities added.
- Static contrast checks & Playwright + axe: Done — tests added and run; artifacts in `test-results/`.
- Remediated critical issues: Done — `/menu` aria-controls and `Button` accessibility changes implemented.

## Edge cases considered
- Decorative large headings use brand accent tokens intentionally; large text has relaxed contrast thresholds and was preserved where appropriate.
- Dark-mode and device viewport combos — Playwright matrix includes multiple viewports and a dark-mode project; all permutations were validated.
- Anchor-based buttons: anchors cannot be `disabled` — implemented `aria-disabled` and pointer-event suppression instead of `disabled` attribute.
- Reduced-motion: spinner respects `prefers-reduced-motion`.

## Next steps / Recommendations
1. Commit & push (if not already done). The working tree was clean during the last commit attempt — ensure all intended changes are committed locally before pushing.
2. Consider addressing the ESLint warnings in a follow-up PR — many are unused variable warnings and a couple of `img` → `next/image` suggestions.
3. Optional: audit deterministic id hook (`useStableId`) for SSR determinism if the project relies on deterministic ids for hydration.
4. Add a small CI job (if not present) to run the `e2e/accessibility.spec.ts` on PRs so regressions are caught early.

## Where artifacts live
- Axe JSON per-page: `test-results/a11y-<page>/axe-results.json` (e.g. `test-results/a11y-about/axe-results.json`)
- Per-run failing media: `test-results/accessibility-.../` directories

## Contact
If you'd like, I can:
- Create a small follow-up PR that fixes the listed ESLint warnings.
- Extract a lintable list of selectors that were changed (for design review).
- Perform the optional `useStableId` audit.

---
Generated by GitHub Copilot (assistant) during an accessibility audit run.
