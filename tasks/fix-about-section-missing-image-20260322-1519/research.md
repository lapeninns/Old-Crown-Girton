---
task: fix-about-section-missing-image
timestamp_utc: 2026-03-22T15:19:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Research: Fix About Section Missing Image

## Requirements

- Functional:
  - Restore rendering for the primary image in the homepage about section.
  - Keep the image responsive within the existing layout.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Preserve meaningful alt text.
  - Prefer an existing optimized image asset instead of adding new complexity.
  - No security or privacy impact.

## Existing Patterns & Reuse

- The homepage about section uses `next/image` with static assets from `public/images/slideshow/...`.
- Other slideshow and content sections reference existing interior assets under `public/images/slideshow/interior`.

## External Resources

- None needed. This is a local asset-path correctness fix.

## Constraints & Risks

- `app/_components/AboutSection.tsx` already has local modifications in the worktree, so the edit must be minimal and preserve current content/layout.
- The referenced file `elegant-pub-lounge-with-fireplace-and-sofas.jpeg` does not exist in `public/images/slideshow/interior`.

## Open Questions (owner, due)

- Q: Was a different asset intended for this slot?
  A: No matching asset exists in the repo; for this fix we will point to the closest existing interior image and keep the change narrow.

## Recommended Direction (with rationale)

- Update the broken `src` in the about section to a real image file already present in `public/images/slideshow/interior`.
- Keep layout and `next/image` usage unchanged so the fix is low-risk and immediately restores rendering.
