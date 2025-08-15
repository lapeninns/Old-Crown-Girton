Color system and usage

Purpose

This file documents the centralized color token system for the project. It provides the single source of truth for colors (in `theme/colors.js`) and guidance for usage, theming, and accessibility.

Files

- `theme/colors.js` — Exports `base`, `themes` (light/dark), and `cssVariablesForTheme(themeName)`.

Principles

- Semantic naming: use tokens by purpose (e.g. `--color-primary`, `--color-text`, `--color-bg`) rather than raw hex.
- Single source of truth: update `theme/colors.js` to change brand colors across the app.
- Theming: `themes.light` and `themes.dark` provide ready-made palettes.

Quick usage

- In JS/TS components (server or client):

  const { themes } = require('@/theme/colors');
  const COLORS = themes.light.colors; // or themes.dark

  // Use in metadata or inline styles
  <meta name="msapplication-TileColor" content={COLORS.primary} />

- To set CSS variables at runtime, use `cssVariablesForTheme('light')` which returns a string of `--color-*` declarations suitable for injection into a style tag or styled container.

Accessibility

- Tokens have been chosen to favour contrast. When changing brand colors, verify WCAG contrast (4.5:1 for normal text) using tools like https://webaim.org/resources/contrastchecker/ or Lighthouse.
- Prefer `primary` on dark text only when contrast is acceptable; otherwise use `primaryAccent` (darker or lighter variant) as appropriate.

Next steps / Refactor plan

1. Replace hardcoded hex values in components, starting with server/SSR files (safe):
   - `lib/criticalCSS.ts` (done)
   - `app/layout.tsx` (done)
2. Replace in public assets and markup where possible (manifest, meta tags):
   - `public/manifest.json` (update colors to reference tokens during build or keep in sync manually)
3. Gradually replace in component files and CSS/SCSS:
   - Search for `#` hex literals and replace with tokens (see repo search results)
4. Introduce automated lint rule (optional): custom ESLint rule banning hex literals in code/style files.

Contact

If you need additional token variants (e.g., hover/active shades), update `theme/colors.js` with new semantic names and prefer using them in components.
