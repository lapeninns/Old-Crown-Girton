import { test, expect } from '@playwright/test';

const PAGES = ['/', '/menu', '/about', '/contact'];

for (const pagePath of PAGES) {
  test(`visual smoke - ${pagePath} (light)`, async ({ page }) => {
    await page.goto(pagePath);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `playwright-report/visual_${pagePath.replace(/\//g,'_')}_light.png`, fullPage: true });
  });

  test(`visual smoke - ${pagePath} (dark)`, async ({ page, context }) => {
    await context.setExtraHTTPHeaders({ 'Accept-CH': 'Sec-CH-Prefers-Color-Scheme' });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(pagePath);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `playwright-report/visual_${pagePath.replace(/\//g,'_')}_dark.png`, fullPage: true });
  });
}
