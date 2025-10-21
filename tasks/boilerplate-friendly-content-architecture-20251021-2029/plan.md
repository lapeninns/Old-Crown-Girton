# Implementation Plan: Boilerplate-Friendly Content Architecture

## Objective

Treat every user-facing string, asset reference, and SEO datum as structured content sourced from JSON so environments/devices can swap copy without component edits.

## Success Criteria

- [ ] No JSX/TSX contains literal user-facing copy or asset paths; all come from loader props driven by JSON.
- [ ] `getContentSmart` (and helpers) reads base schema + environment overrides and exposes a stable structure to pages.
- [ ] Modular domain JSON (e.g., menu) replaces inline fallbacks with centralized data.
- [ ] Schema updates validated through `ContentSchema` to keep contracts strict but extensible.
- [ ] Verification confirms dev/staging/prod swaps only require exchanging `data/{env}/content.json`.

## Architecture & Design Decisions

- **Content sourcing pipeline**  
  - Extend loader to merge base `config/content.json` with `data/<env>/content.json` (deep merge with env taking precedence).  
  - Provide typed accessor (e.g., `resolveContent(env)`) so all pages/components consume via loader props.  
  - Alternative considered: performing merge at build time via scripts; rejected to keep runtime flexibility.

- **Schema evolution**  
  - Update `ContentSchema` to include home press feature, CTA sections, JSON-LD/SEO payload definitions, and any other currently inline fields.  
  - Double-check with `ContentSchema.passthrough()` vs. explicit keys: prefer explicit keys + `.passthrough()` where necessary to avoid stripping future additions while retaining validation.

- **Component ingestion**  
  - `app/page.tsx`: remove `DEFAULT_PRESS_FEATURE` constant, move structured data and copy into JSON, rely on loader data with fallback to domain-level defaults from JSON.  
  - `app/menu/_content/useMenuContent.ts`: eliminate inline fallback, import fallback JSON only; ensure loader or hook can accept server-provided overrides.
  - Audit slideshow + banners for inline strings; wire them to JSON keys (likely under `content.components.slideshow`). Add new JSON sections if missing.

- **SEO & metadata**  
  - Introduce structured data definitions in JSON (e.g., `content.pages.home.schemaOrg`), enabling environment-specific overrides (URL, address, rating).  
  - Evaluate potential duplication with `config/marketing.json`; ensure single source.

- **Fallback handling**  
  - Implement helper to compose fallback chain: env -> base -> domain fallback (e.g., menu). On missing keys, degrade gracefully with descriptive logs.  
  - Alternative viewpoint: maintain inline fallback as last resort; rejected per requirement ("no inline strings").

## Component Breakdown

- `src/lib/data/server-loader.ts`: merge env overrides, expose typed loader.  
- `src/lib/data/schemas.ts`: adjust `ContentSchema` and related types.  
- `config/content.json` + `data/{env}/content.json`: add new keys for home (press feature, CTA, schema), slideshow messages, error strings, etc.  
- `app/page.tsx`, `components/ClientHomeContent.tsx`, `components/restaurant/*`, `components/slideshow/*`: remove inline literals, access loader props.  
- `app/menu/_content/useMenuContent.ts`: rely solely on JSON imports; consider moving hook to server-side loader if possible.

## Data Flow

1. Server request triggers `getContentSmart(env)` → obtains base JSON + env override → merges + validates via Zod.  
2. Loader returns content props to page; page passes relevant slices to child components via props/context.  
3. Components render data keys only; assets resolved from JSON-supplied URLs with metadata (alt text etc.).  
4. Domain-specific hooks (menu) import modular JSON, but still under central schema, with fallback to loader-provided props if available.

## API Contracts

- `Content` type extends to include:  
  - `pages.home.sections.pressFeature`, `pages.home.sections.cta`, `pages.home.schemaOrg`.  
  - `components.slideshow` (images, alt text, CTA labels).  
  - `global.messages` (error strings for slideshow, etc.).  
  - Document new keys for environment overrides; ensure naming stable.

## UI/UX Considerations

- No visual redesign expected, but ensure fallback logic prevents blank UI when content missing.  
- Confirm DaisyUI components receive accessible labels from JSON (e.g., sr-only text for slideshow status).  
- Maintain existing animations but reference motion copy (e.g., `aria-live` messages) from JSON.

## Testing Strategy

- Unit: add tests for content loader merge + schema validation (mock env).  
- Integration: update page tests to assert content originates from props (no inline fallback).  
- Static checks: run `tsc` + `lint` to ensure types align after schema changes.  
- Manual QA: Chrome DevTools audit per verification phase (responsive, accessibility, performance).  
- Optional: add guard tests to prevent accidental literals (e.g., regex scan in CI).

## Edge Cases

- Missing env override file → loader should fallback to base without runtime error.  
- Partial content overrides → ensure deep merge leaves unspecified keys intact.  
- CMS response missing keys → fallback to filesystem JSON gracefully.  
- JSON schema mismatch → surfaces through Zod errors; log context to aid debugging.

## Rollout Plan

1. Update schemas + loaders.  
2. Migrate JSON content (base + env).  
3. Refactor components to consume data-driven props.  
4. Add/adjust tests.  
5. Run manual QA (DevTools).  
6. Document verification in `verification.md`.

## Assumption Challenge & Mitigation

- **Assumption**: Structured data can live in JSON without performance hit. Counter-check by considering dynamic generation; mitigated by allowing JSON-LD arrays and injecting via loader.  
- **Assumption**: Env overrides exist for every env; challenge by simulating missing file scenario → plan to implement try/catch fallback to base.  
- **Assumption**: All components can receive props without major API changes; verify by tracing prop chains (home, slideshow, CTA). Adjust as needed during implementation.
