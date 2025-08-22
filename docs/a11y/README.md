This folder contains pointers to the axe-core accessibility reports generated during the palette migration validation.

Files are intentionally small pointers to the original `test-results/a11y-*/axe-results.json` files which were untracked from Git to avoid large binary commits. If you need the full reports, run the Playwright accessibility E2E locally (`npx playwright test e2e/accessibility.spec.ts`) and view `test-results/a11y-*/axe-results.json`.
