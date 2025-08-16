import { test, expect } from '@playwright/test';

test('sticky booking button exists and links to TOGO', async ({ page }) => {
  await page.goto('http://localhost:3002');
  // Wait for sticky to appear (client mounts)
  const sel = '[data-testid="booking-sticky"]';
  await page.waitForSelector(sel, { timeout: 10000 });
  const el = await page.$(sel);
  expect(el).toBeTruthy();
  const href = await el!.getAttribute('href');
  expect(href).toContain('https://togo.uk.com/makebookingv2.aspx');
});
