---
task: old-crown-thread-reinstatement
timestamp_utc: 2026-03-21T17:03:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: Old Crown Thread Reinstatement

## Requirements

- Functional:
  - Restore all agreed public-site revamp changes from this thread.
  - Preserve conversion-first UX and low cognitive load.
  - Re-apply Search Console driven SEO/GEO improvements.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Maintain accessible, scan-friendly content and metadata.
  - Keep changes within existing Next.js/DaisyUI/design-system patterns.

## Existing Patterns & Reuse

- Existing design-system recipes and restaurant layout components should be reused.
- Prior revamp task folders in `tasks/` capture intended direction and copy.

## External Resources

- Search Console CSV exports already reviewed in prior task.

## Constraints & Risks

- Repo may contain reverted or partial versions of prior work.
- Must not overwrite unrelated user edits.
- Manual DevTools QA is still not available in-session.

## Open Questions (owner, due)

- Q: Which agreed changes are currently missing vs already live?
  A: To be verified in code before implementation.

## Recommended Direction (with rationale)

- Audit the main funnel pages and shared surfaces against the agreed revamp, then restore only the missing changes so the site matches the thread without unnecessary churn.
