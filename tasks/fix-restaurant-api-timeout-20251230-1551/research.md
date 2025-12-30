---
task: fix-restaurant-api-timeout
timestamp_utc: 2025-12-30T15:51:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Research: Fix Restaurant API Timeout

## Requirements

- Functional:
  - Prevent `/api/restaurant` from recursively calling itself.
  - Restore fast restaurant data responses without AbortError/27s latency.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Perf: eliminate 25–30s timeouts; keep request latency < 1s for cached/fs path.
  - Security/Privacy: no secrets added; no new external calls unless intentional CMS host.

## Existing Patterns & Reuse

- Smart loader pattern in `src/lib/data/loaders/BaseSmartLoader.ts` with API→filesystem fallback.
- CMS on/off gating uses `cfg.cms?.enabled || cfg.featureFlags?.["cms"]` in loaders.
- Environment config lives in `data/<env>/config.json` with API endpoints.

## External Resources

- None.

## Constraints & Risks

- AGENTS SDLC phases: requirements + plan before code changes.
- No UI changes expected; DevTools MCP QA not required if no UI change.
- Risk: changing CMS gating could affect other loaders (menu/marketing/content).
- Risk: changing prod config may affect deployments if CMS intended to be on.

## Open Questions (owner, due)

- Q: Confirm environment and intended CMS behavior (on/off; separate CMS host)?
  A: Pending maintainer confirmation.

## Recommended Direction (with rationale)

- Preferred: Adjust prod config to disable CMS feature flag if CMS is not intended in prod. This avoids code changes and keeps loader logic consistent.
- Alternative: Adjust loader CMS gating to require `cms.enabled === true` (ignore feature flag) to prevent accidental recursion when `cms.enabled` is false.
