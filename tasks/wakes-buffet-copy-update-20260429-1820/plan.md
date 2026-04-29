---
task: wakes-buffet-copy-update
timestamp_utc: 2026-04-29T18:20:22Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Plan: Wakes Buffet Copy Update

## Objective

We will update the wakes buffet explanatory copy so the page reflects the revised user-provided wording.

## Success Criteria

- [x] The old paragraph is removed.
- [x] The new paragraph appears in `app/wakes-menu/page.tsx`.
- [x] No unrelated component, style, or behavior changes are introduced.

## Architecture & Components

- `app/wakes-menu/page.tsx`: owns the visible page copy.

## Data Flow & API Contracts

- Not applicable.

## UI/UX States

- Existing UI states are unchanged.

## Edge Cases

- Ensure the replacement is exact and does not affect nearby example plate copy.

## Testing Strategy

- Search for the old and new text.
- Run `git diff --check`.
- Inspect the diff for scope.

## Rollout

- No feature flag required for this static copy update.

## DB Change Plan (if applicable)

- Not applicable.
