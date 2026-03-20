---
task: takeaway-cta-consistency
timestamp_utc: 2026-03-20T11:03:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Research: Takeaway CTA Consistency

## Requirements

- Functional:
  - Make the takeaway call-to-action consistent anywhere the user is expected to place a takeaway order by phone.
  - Remove button copy that implies online ordering when the action is actually a `tel:` link.
  - Avoid embedding the phone number inside CTA button labels.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Keep the fix content-driven and small.
  - Preserve existing button destinations and layout behavior.

## Existing Patterns & Reuse

- The homepage hero and slideshow already use the clearer phrase `Call for Takeaway`.
- Menu-related surfaces still vary:
  - `app/menu/page.tsx` uses a phone CTA but may render `Order Takeaway: 01223277217`.
  - `app/menu/_components/MenuHero.tsx` uses `Order Takeaway`.
  - Content/config files disagree on the label.

## Constraints & Risks

- The repo is already dirty; only touch the label sources and active CTA surfaces relevant to takeaway ordering.
- Do not change booking URLs or takeaway phone behavior in unrelated components.

## Recommended Direction

- Standardize the takeaway CTA label to `Call for Takeaway` for any phone-based ordering CTA.
- Update the shared content/config sources first so active surfaces inherit the same wording.
- Align the active menu CTA surfaces and the legacy menu hero component with that wording.
