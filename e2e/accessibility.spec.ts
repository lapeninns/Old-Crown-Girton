import { test } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

const PAGES = ['/', '/menu', '/about', '/contact'];

for (const pagePath of PAGES) {
  test(`a11y - ${pagePath}`, async ({ page }, testInfo) => {
    await page.goto(pagePath);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page }).analyze();

    // Ensure output directory exists
    const outDir = path.join(process.cwd(), 'test-results', `a11y-${pagePath === '/' ? 'home' : pagePath.replace(/\//g, '')}`);
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, 'axe-results.json');
    fs.writeFileSync(outFile, JSON.stringify(results, null, 2));

    // Print a short summary
    const violations = results.violations || [];
    if (violations.length === 0) {
      console.log(`No accessibility violations on ${pagePath}`);
    } else {
      console.log(`Accessibility violations on ${pagePath}: ${violations.length}`);
      for (const v of violations) {
        console.log(`- ${v.id} (${v.impact}) — nodes: ${v.nodes.length}`);
      }
      // Fail the test to surface failures in CI, but we have the JSON saved for triage
      throw new Error(`Accessibility violations found on ${pagePath} — details saved to ${outFile}`);
    }
  });
}
