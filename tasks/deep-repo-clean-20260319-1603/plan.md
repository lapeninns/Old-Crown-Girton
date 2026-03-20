---
task: deep-repo-clean
timestamp_utc: 2026-03-19T16:05:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Plan: Deep Repo Clean

## Objective

We will remove clearly stale and unwanted repository artifacts so the codebase is easier to navigate, lighter to clone, and less likely to re-accumulate generated junk.

## Success Criteria

- [ ] Tracked duplicate backup assets are removed.
- [ ] Unreferenced generated/process artifacts are removed.
- [ ] Only one active Jest config remains documented and tracked.
- [ ] `.gitignore` blocks the same classes of clutter from returning.
- [ ] Repo status reflects only intentional cleanup changes plus pre-existing user work.

## Architecture & Components

- `.gitignore`: add guards for backup and agent-generated artifact folders.
- `docs/TESTING.md`: align documentation with the remaining Jest config.
- Repository tree cleanup:
  - Remove `backups/images-20250924-180841/`
  - Remove `.agent/artifacts/solid-refactoring-audit.md`
  - Remove `jest.config.js`
  - Remove local generated files/directories that should never stay in the workspace

## Data Flow & API Contracts

- No runtime API or data contract changes.

## UI/UX States

- No UI changes.

## Edge Cases

- Do not touch env files or existing task evidence.
- Do not modify active application files with user changes.
- Preserve docs/examples that are still referenced, even if they are not part of runtime code.

## Testing Strategy

- Verification by targeted search:
  - Confirm `backups/` is no longer referenced or tracked.
  - Confirm `jest.config.js` is no longer referenced.
  - Confirm `.gitignore` contains the new exclusions.
- Repo hygiene checks:
  - `git status --short`
  - `du -sh` spot checks
  - Optional config smoke check by searching package scripts and docs

## Rollout

- No feature flag required.
- Cleanup is applied directly in the branch/worktree.
- Rollback is straightforward via git restore of deleted tracked files if needed.
