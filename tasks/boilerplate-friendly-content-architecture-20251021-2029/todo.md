# Implementation Checklist

## Setup & Discovery

- [x] Re-run repo-wide scan for inline literals (e.g., `rg -g\"*.tsx\" '[A-Za-z]{3,}'`) to scope updates.
- [ ] Identify DaisyUI components needing content props and log any ambiguous cases.

## Schema & Loader

- [x] Update `ContentSchema` and related types to cover home press feature, CTA, slideshow, schema.org data, and shared UI messages.
- [x] Implement deep merge of base `config/content.json` with `data/{env}/content.json` inside `getContentSmart`.
- [x] Add fallback handling/error logging for missing override files without crashing.

## Content JSON Updates

- [x] Move home page press feature, CTA buttons, quick links, structured data, and slideshow copy into JSON (base + env overrides).
- [x] Ensure asset metadata (alt text, sizes, transcripts if any) lives alongside asset URLs in JSON.
- [ ] Sync domain fallback JSON (e.g., `app/menu/_content/menu-content.json`) with main schema or reference central keys.

## Component Refactors

- [x] Refactor `app/page.tsx` to consume loader-provided data without inline defaults; inject structured data from JSON.
- [x] Update `ClientHomeContent` and downstream components to accept new props and remove hardcoded copy.
- [x] Clean up `app/menu/_content/useMenuContent.ts` to drop inline fallback strings.
- [x] Audit slideshow components (`components/slideshow/*`) to ensure messages/buttons reference JSON-derived labels.

## Testing & Verification

- [ ] Update/add unit tests covering loader merge + schema typing.
- [x] Run `npm run test` or targeted suites; address failures.
- [ ] Prepare Chrome DevTools QA plan (responsive, accessibility, performance) for verification phase.

## Documentation & Follow-up

- [ ] Record deviations/assumptions in this todo if encountered.
- [ ] Update `verification.md` after QA with findings/checkmarks.
- [ ] Note any residual hardcoded strings requiring future work if out of scope.
