import { test, expect } from '@playwright/test';

test('directions sticky exists and links correctly', async ({ page }) => {
  await page.goto('http://localhost:3002');
  const sel = '[data-testid="directions-sticky"]';
  await page.waitForSelector(sel, { timeout: 10000 });
  const el = await page.$(sel);
  expect(el).toBeTruthy();
  const href = await el!.getAttribute('href');
  // Should point to google or apple maps directions URL
  expect(href).toBeTruthy();
  expect(href).toMatch(/google\.com\/maps\/dir|maps\.apple\.com/);
});
