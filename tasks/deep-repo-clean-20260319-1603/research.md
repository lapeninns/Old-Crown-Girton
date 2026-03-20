---
task: deep-repo-clean
timestamp_utc: 2026-03-19T16:05:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: Deep Repo Clean

## Requirements

- Functional:
  - Remove clearly unwanted repository clutter without breaking the running app or documented workflows.
  - Keep the cleanup focused on files that are generated, duplicated, legacy, or unreferenced.
  - Leave user-authored in-flight changes untouched.
- Non-functional (a11y, perf, security, privacy, i18n):
  - No UI behavior changes are expected.
  - Do not touch secrets or environment-specific runtime configuration.
  - Reduce repository noise and size while preserving traceability through task artifacts.

## Existing Patterns & Reuse

- `.gitignore` already excludes generated outputs such as `.next/`, `dist/`, `coverage/`, and `*.tsbuildinfo`.
- `package.json` already treats `.next` as disposable via `npm run clean`.
- The active Jest entry point is `jest.config.mjs`; package scripts reference that file directly.
- The repository already stores implementation audits and change evidence under `tasks/`, so cleanup evidence should live there rather than in ad hoc root-level backup folders.

## Current Bloat Inventory

- `backups/` is tracked and consumes about `39M`; it contains `160` duplicated image backup files under `backups/images-20250924-180841/`.
- `.agent/artifacts/solid-refactoring-audit.md` is tracked, unreferenced, and appears to be a generated process artifact rather than runtime source.
- `jest.config.js` is tracked, but package scripts and test docs now use `jest.config.mjs`.
- Local generated clutter present in the workspace includes `.next/`, `tsconfig.tsbuildinfo`, and `.DS_Store`.

## External Resources

- None required; cleanup is based on local repository evidence.

## Constraints & Risks

- There are pre-existing user changes in `CONTINUITY.md`, `app/layout.tsx`, `app/robots.ts`, and untracked docs/tasks that must not be reverted.
- Removing tracked files must be limited to items with clear evidence of non-use.
- `backups/` deletion is the highest-impact change; references were searched and no runtime imports or docs dependencies were found.

## Open Questions (owner, due)

- Q: Should larger structural pruning continue after this safe pass (for example unused dependencies or dormant directories)?
  A: Not required for this pass; keep this cleanup focused on high-confidence clutter removal first.

## Recommended Direction (with rationale)

- Delete the tracked `backups/images-20250924-180841/` tree because it duplicates committed assets and is not referenced by runtime code.
- Delete `.agent/artifacts/solid-refactoring-audit.md` because it is an unreferenced generated audit artifact and the repo already has a first-class `tasks/` area for evidence.
- Remove the legacy `jest.config.js` and update docs to point only at `jest.config.mjs`, reducing duplicate configuration surface.
- Expand `.gitignore` to ignore `/backups/` and `/.agent/` so similar clutter does not get recommitted.
- Remove local generated artifacts (`.next/`, `tsconfig.tsbuildinfo`, `.DS_Store`) from the working tree to reduce noise immediately.
