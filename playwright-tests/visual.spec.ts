import { test, expect } from '@playwright/test';

const PAGES = ['/', '/menu', '/about', '/contact'];

test.describe('visual smoke', () => {
  for (const page of PAGES) {
    test(`screenshot ${page} light`, async ({ page: p }) => {
      await p.goto(page);
      await p.waitForLoadState('networkidle');
      await p.screenshot({ path: `playwright-report/${page.replace(/\//g,'_')}_light.png`, fullPage: true });
    });

    test(`screenshot ${page} dark`, async ({ page: p, context }) => {
      await context.setExtraHTTPHeaders({ 'Accept-CH': 'Sec-CH-Prefers-Color-Scheme' });
      await p.emulateMedia({ colorScheme: 'dark' });
      await p.goto(page);
      await p.waitForLoadState('networkidle');
      await p.screenshot({ path: `playwright-report/${page.replace(/\//g,'_')}_dark.png`, fullPage: true });
    });
  }
});
