---
task: fix-menu-loader-build
timestamp_utc: 2026-03-19T16:46:00Z
owner: github:@amankumarshrestha
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Research: Fix menu loader build failure

## Requirements

- Functional:
  - Restore a successful production build.
  - Preserve current data loader behavior.
- Non-functional (a11y, perf, security, privacy, i18n):
  - No UI or runtime behavior changes.
  - No cache policy regression.

## Existing Patterns & Reuse

- `src/lib/data/loader.ts` and `src/lib/data/server-loader.ts` share the same cache helper pattern.
- Both files pass `env` into TTL helpers even though the helpers currently compute TTL only from `NODE_ENV`.

## External Resources

- None needed for this local type mismatch.

## Constraints & Risks

- The worktree already contains unrelated user changes, including edits in the loader files.
- The fix should avoid refactoring call sites broadly to minimize merge risk.

## Open Questions (owner, due)

- Q: Should TTL vary by `AppEnv` in the future?
  A: Not required for this fix. Current implementation remains `NODE_ENV`-based.

## Recommended Direction (with rationale)

- Update the TTL helper signatures to accept an optional `AppEnv` argument and ignore it for now.
- This keeps all existing callers valid, avoids behavioral drift, and minimizes edits in files that already have local changes.
