# Phase 0 · Initial Requirements

- Ensure all user-facing content is sourced from structured JSON (`config/content.json` + env overrides) rather than inline JSX or TS/TSX literals.
- Use `getContentSmart` in `src/lib/data/server-loader.ts` as the sole loader entry point for content, including support for CMS endpoints when applicable.
- Respect environment overrides located at `data/{dev,staging,prod}/content.json` while keeping schema consistent across environments.
- Support modular domain JSON bundles (e.g., menu content) with graceful fallbacks when keys are missing.
- Keep asset metadata (alt text, captions, dimensions, transcripts) inside JSON references, never hardcoded in components.

# Phase 0 · Success Criteria

- [ ] Content schema defined under `config/content.json` remains the single source of truth and is extensible without component changes.
- [ ] All loaders and pages consume content solely through `getContentSmart`-derived props.
- [ ] Environment-specific JSON swaps (`data/dev|staging|prod/content.json`) change copy/assets with zero component edits.
- [ ] Missing or optional content keys fall back to page/domain fallback JSON without runtime errors.
- [ ] Verification demonstrates that no user-facing strings/assets are hardcoded in JSX/TSX.
