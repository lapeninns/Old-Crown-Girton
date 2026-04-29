---
task: wakes-buffet-copy-update
timestamp_utc: 2026-04-29T18:20:22Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Research: Wakes Buffet Copy Update

## Requirements

- Functional: Replace the existing wakes buffet explanatory paragraph with the exact user-provided wording.
- Non-functional: Preserve existing layout, accessibility semantics, routing, and behavior.

## Existing Patterns & Reuse

- The copy is inline content in `app/wakes-menu/page.tsx` under the "How the wakes buffet is served" section.
- No reusable content helper is needed for this one-off copy edit.

## External Resources

- None.

## Constraints & Risks

- Follow root `AGENTS.md` task artifact requirements.
- Keep the change narrowly scoped to the requested paragraph.
- Risk is low because no logic, structure, or styling is changing.

## Open Questions (owner, due)

- None.

## Recommended Direction (with rationale)

- Replace the paragraph directly in `app/wakes-menu/page.tsx`; this is the simplest change and matches the existing file structure.
