# Implementation Checklist

## Setup
- [x] Install dependencies if needed (`npm install` already satisfied?)
- [x] Start Next.js dev server (`npm run dev`)
- [x] Launch Chrome DevTools MCP session against localhost

## Profiling Workflow
- [x] Compile master page list from `app/**/page.tsx`
- [x] Prepare spreadsheet/notes template for per-page metrics
- [x] Configure DevTools throttling scenarios (Fast 3G + CPU 4x, No throttling) *(auto-stop traces reverted to default; documented in findings)*

## Page Traces
- [x] `/`
- [x] `/menu`
- [x] `/menu-information`
- [x] `/book-a-table`
- [x] `/takeaway-menu`
- [x] `/wakes-menu`
- [x] `/christmas-menu`
- [x] `/curry-and-carols-menu`
- [x] `/events`
- [x] `/events/curry-and-carols`
- [x] `/contact`
- [x] `/about`
- [x] `/press`
- [x] `/privacy-policy`
- [x] `/tos`
- [x] `/cls-optimized`
- [x] `/offline`
- [x] `/test-hours`
- [x] `/blog`
- [x] `/blog/largest-thatched-pub-history`
- [x] `/blog/perfect-sunday-roast-guide`
- [x] `/blog/ultimate-sports-viewing-guide`
- [x] `/blog/business-lunch-cambridge-guide`
- [x] `/blog/evening-standard-country-pub-of-the-week`
- [x] `/blog/nepalese-cuisine-journey`
- [x] `/blog/authentic-momo-dumplings-nepalese-cuisine`
- [x] `/blog/local-suppliers-fresh-ingredients`
- [x] `/blog/dog-friendly-dining-guide`
- [x] `/blog/student-guide-cambridge-university`

## Analysis & Reporting
- [x] Summarize per-page findings (metrics + issues)
- [x] Identify cross-cutting bottlenecks & recommendations
- [x] Document console/accessibility issues encountered
- [x] Populate `verification.md` with DevTools QA evidence

## Wrap-up
- [x] Stop dev server
- [x] Prepare final response with key takeaways + next steps
