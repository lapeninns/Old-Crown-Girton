---
task: deep-repo-clean
timestamp_utc: 2026-03-19T16:05:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Inventory large directories and tracked clutter
- [x] Check references for backup assets, agent artifacts, and Jest config files
- [x] Create task folder and document scope

## Core

- [x] Remove tracked backup asset directory
- [x] Remove tracked `.agent` artifact
- [x] Remove legacy Jest config and align docs
- [x] Extend `.gitignore` for backup and agent artifact directories

## Workspace Hygiene

- [x] Delete local generated outputs (`.next/`, `tsconfig.tsbuildinfo`, `.DS_Store`)

## Verification

- [x] Check `git status --short`
- [x] Re-run targeted reference searches
- [x] Record verification notes

## Notes

- Assumptions:
  - The tracked backup image tree is not part of the app runtime because no references were found outside the backup directory.
  - `jest.config.mjs` is the sole intended Jest entry point because all package scripts point to it.
- Deviations:
  - Chrome DevTools MCP QA is not applicable because this task does not modify UI behavior.
  - Full automated tests were not run because `node_modules/` is not present in the workspace.

## Batched Questions

- None at this stage.
