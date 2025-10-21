# Research: Boilerplate-Friendly Content Architecture

## Task Outline & Subtasks

- **Map current content sourcing pipeline**  
  - Perspectives: server loader flow (`getContentSmart`), modular domain JSON (e.g. menu), component-level fallbacks.  
  - Verification: `jq 'keys' config/content.json`; traced loader usages with `rg "getContentSmart"`.
- **Catalogue hardcoded content in TSX/JSX**  
  - Perspectives: SEO markup, CTA defaults, inline fallbacks inside hooks.  
  - Verification: `rg "\"Book Online\""`, `rg "DEFAULT_PRESS_FEATURE"`, manual review of `app/page.tsx`, `app/menu/_content/useMenuContent.ts`.
- **Assess environment override mechanics**  
  - Perspectives: baseline config vs `data/{env}/content.json`; ensure schema compatibility.  
  - Verification: `jq 'keys' data/dev/content.json`, diffing key sets mentally, confirming loader path resolution.
- **Identify fallback + error-handling strategy**  
  - Perspectives: loader-level `globalCache` fallbacks, modular JSON fallback (menu), inline "last resort" strings.  
  - Verification: reviewed `src/lib/data/server-loader.ts:35-210`, `app/menu/_content/useMenuContent.ts`.

## Existing Patterns & Findings

- **Centralized content schema** already exists at `config/content.json` with nested domains (`global`, `pages`, `components`, etc.). `jq` confirmed top-level keys align across env overrides.  
- **Environment overrides** live in `data/{dev,staging,prod}/content.json`; they appear to follow same schema (extra `debug` block in dev). Need merge/override strategy verification (likely handled via loaders or config merging).  
- **Server loader contract**: `getContentSmart` (lines 35-123) caches `config/content.json`, optionally fetching from CMS endpoint; gracefully falls back to filesystem.  
- **Modular domain JSON**: menu domain uses `app/menu/_content/menu-content.json` plus hook `useMenuContent` that imports JSON but also includes inline fallback strings.  
- **Component consumption**: pages like `app/page.tsx` fetch content via loader but still define inline constants (`DEFAULT_PRESS_FEATURE`, fallback SEO strings).  
- **SEO/structured data**: `app/page.tsx` embeds schema markup with hardcoded literals (name, description, address). Need to determine if schema markup must also be data-driven per requirements (likely yes because user-facing metadata/SEO).

## External Resources & References

- Next.js App Router data fetching best practices (https://nextjs.org/docs/app/building-your-application/data-fetching/fetching).  
- WAI-ARIA guidance already integrated; no extra docs needed at this phase.

## Technical Constraints / Dependencies

- `getContentSmart` is the mandated loader. Any new loaders must consume it or build on top.  
- Content schema stability critical; modifications require updates to `ContentSchema` (`src/lib/data/schemas.ts`).  
- JSON assets require metadata (alt text, dimensions, transcripts) per instructions—need to confirm schema already supports these keys.  
- DaisyUI theme usage not directly tied to content but components must stay data-driven.

## Anti-Patterns & Issues Observed

- Inline fallback literals violate "content as data":  
  - `app/page.tsx:26-75` defines `DEFAULT_PRESS_FEATURE`.  
  - `app/page.tsx` structured data strings are hardcoded.  
  - `app/menu/_content/useMenuContent.ts:56-126` contains inline fallback object.  
  - `components/slideshow/Slide.tsx` includes descriptive messages (`We couldn't load this slide image`, button variant comments referencing CTA semantics).  
  - Additional global strings likely exist; `rg "\"Loading menu...\""` returned hits in TSX beyond JSON.
- Asset references in components may be inline (need deeper scan of `components/slideshow` and hero sections).

## Open Questions / Uncertainties

- How are per-env overrides merged with base schema? Need to validate whether `getContentSmart` already considers `data/{env}/content.json` (initial review indicates it reads only from `config/content.json`). Possibly missing override integration.  
- Should structured data JSON-LD also come from `config/content.json`? Requirement implies yes, but schema does not yet contain explicit SEO JSON-LD payload. Need design decision.  
- How to gracefully handle missing keys—existing components assume data present. Might need fallback util to pull from domain-specific JSON (e.g., `app/menu/_content/menu-content.json`).  
- Are there CMS integration hooks to respect when migrating strings (marketing endpoints, etc.)?

## Recommendations & Next Steps

- Extend `config/content.json` schema to include home page press feature, structured data descriptors, fallback UI strings currently hardcoded. Mirror keys across `data/{env}/content.json`.  
- Refactor server loader (or add orchestrator) to merge base config with env overrides (`data/{env}/content.json`). Validate TTL/caching unaffected.  
- Update `useMenuContent` to source from JSON bundle only; replace inline fallback with schema-driven fallback hooking into `config/content.json` or domain fallback file.  
- Audit components with `rg` for hardcoded strings/assets; replace with loader-provided data. Document changes in plan before implementation.  
- Consider building utility to surface typed content selectors to reduce manual key lookups.

## Validation & Cross-Checks

- Verified loader flow by reading `src/lib/data/server-loader.ts` and comparing to instructions.  
- Confirmed JSON presence via `cat`/`jq`; cross-checked duplicates between base config and modular JSON.  
- Searched repo with `rg` for representative strings to gauge scope of inline literals.  
- Challenge assumption check: Investigated possibility that inline fallbacks might be required for resilience; determined they should instead read fallback JSON (per instructions) with runtime guard clauses.
