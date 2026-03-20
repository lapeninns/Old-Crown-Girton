---
task: localbusiness-schema-and-ai-robots
timestamp_utc: 2026-02-11T16:00:16Z
owner: github:@amankumarshrestha
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Verification Report

## Manual QA — Metadata/Crawler Policy

### JSON-LD Verification

- [x] Homepage head includes `application/ld+json` script with requested `Restaurant` payload.

### Robots Verification

- [x] `app/robots.ts` includes explicit rules for GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai, and PerplexityBot.
- [x] Existing deny blocks for SemrushBot, AhrefsBot, and MJ12bot remain.
- [x] `public/robots.txt` updated for parity.

## Test Outcomes

- [x] Metadata and robots changes verified via file inspection.
- [ ] Google Rich Results Test run against deployed homepage URL.

## Artifacts

- Code diff only (no runtime artifacts required).

## Known Issues

- [ ] Rich Results validation is pending deployment URL verification.

## Sign-off

- [ ] Engineering
- [ ] QA
