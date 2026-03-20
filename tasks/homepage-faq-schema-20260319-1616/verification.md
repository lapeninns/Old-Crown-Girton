---
task: homepage-faq-schema
timestamp_utc: 2026-03-19T16:16:30Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Verification Report

## Manual QA — Chrome DevTools (MCP)

Tool: Not applicable for this task

- This task changes homepage structured data only.
- No user-facing layout or interaction changed, so DevTools UI QA was not required for this pass.

## Verification Steps

- Reviewed `app/page.tsx` to confirm the homepage now defines 10 FAQ entries and serializes them into a valid `FAQPage` JSON-LD object.
- Ran `rg -n "FAQPage|What type of cuisine does The Old Crown Girton serve\\?|Where is The Old Crown Girton located\\?|What makes Nepalese cuisine different from Indian cuisine\\?" app/page.tsx tasks/homepage-faq-schema-20260319-1616`
  - Confirmed the new FAQ schema lives in homepage code and task documentation only.
- Ran a Node JSON serialization sanity check for the FAQ schema shape.
  - Result: `faq-schema-ok`
- Ran `git status --short app/page.tsx tasks/homepage-faq-schema-20260319-1616`
  - Confirmed this task changes `app/page.tsx` and adds the new task folder only.

## Artifacts

- No binary artifacts were generated for this structured-data-only task.

## Known Issues

- `node_modules/` is not installed in this workspace, so no build or browser validation was run locally.

## Sign-off

- [x] Engineering
- [ ] QA
