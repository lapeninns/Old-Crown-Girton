# Himalayan Spice Palette Migration

This PR documents the migration of the project's color tokens to the "Himalayan Spice" palette and the accessibility remediation done as part of the migration.

What changed
- Added the Himalayan Spice color scale and semantic token aliases into `app/globals.css` and kept backward-compatible mappings for legacy tokens.
- Tailwind configured to read color tokens from CSS custom properties (see `tailwind.config.js`).
- Small, low-risk accessibility fixes applied (CTA contrast, heading order fixes, menu aria-controls patch). These patches were validated with Playwright + axe-core.

A11y artifacts
- The Playwright/axe JSON reports for validated pages are included in `docs/a11y/`.
	- NOTE: large raw axe reports are preserved in the local `test-results/` folder and were untracked from Git in `chore/cleanup-artifacts`; small pointers are available in `docs/a11y/`.

Remediation summary
- CTA contrast: Inline critical backgrounds were adjusted to `var(--color-accent-950)` on a small number of CTAs to meet WCAG AA contrast for text.
- Heading order: Fixed incorrect heading nesting on `about` and `contact` pages to resolve `heading-order` axe violations.
- Menu aria-controls: Short-term patch made `aria-controls` conditional to avoid invalid references; a deterministic stable ID implementation will be applied in a follow-up change to always set `aria-controls` reliably.

Next steps
- Apply deterministic stable IDs for menu sections (planned branch `chore/stable-menu-ids`) so `aria-controls` can be set consistently.
- Optionally purge large Playwright artifacts from Git history if required.

Contact
- If you have questions about the visual parity after these changes or want to review the a11y artifacts, please review the files in `docs/a11y/` and the PR discussion.
