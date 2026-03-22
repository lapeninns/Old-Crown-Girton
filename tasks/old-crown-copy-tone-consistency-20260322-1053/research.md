---
task: old-crown-copy-tone-consistency
timestamp_utc: 2026-03-22T10:53:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: Old Crown Copy Tone Consistency

## Requirements

- Functional:
  - Make the public-site copy sound consistent across the main funnel.
  - Choose a tone that helps guests feel confident booking or visiting.
  - Remove internal or strategic phrasing that sounds like planning notes instead of customer-facing copy.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Preserve existing structure and conversion routes.
  - Keep copy easy to scan and low in cognitive load.

## Existing Patterns & Reuse

- The core funnel pages already contain most of the right structure.
- The main inconsistency is tone, not routing or component architecture.

## Constraints & Risks

- Some sections were recently restored and still contain meta-marketing language.
- Changes should stay focused on customer-facing copy rather than adding new systems.

## Recommended Direction (with rationale)

- Use one hospitality-forward voice: warm, confident, practical, and gently premium.
- Keep the brand rooted in heritage and Nepalese food, but make every section feel like an invitation to visit rather than an explanation of strategy.
