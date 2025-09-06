import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';

test.describe('Lazy Loading E2E', () => {
  test('loads only viewport images on scroll', async ({ page }) => {
    await page.goto('http://localhost:3000/menu'); // Assume menu page with images
    const initialRequests = await page.context().request.fetch();
    const imageRequests = initialRequests.filter(r => r.url().includes('.jpg') || r.url().includes('.png'));
    expect(imageRequests.length).toBeLessThan(5); // Only hero etc.

    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);
    const allRequests = await page.context().request.fetch();
    const totalImages = allRequests.filter(r => r.url().includes('.jpg') || r.url().includes('.png'));
    expect(totalImages.length).toBeGreaterThan(5); // More loaded on scroll
  });

  test('no CLS >0.1', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const cls = await page.evaluate(() => {
      return new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        return lastEntry ? lastEntry.deltaY + lastEntry.deltaX : 0;
      }).observe({ entryTypes: ['layout-shift'] }), new Promise(r => setTimeout(r, 5000));
      return cls;
    });
    expect(cls).toBeLessThan(0.1);
  });

  test('concurrent loads <=6', async ({ page, browser }) => {
    const context = await browser.newContext({ 
      extraHTTPHeaders: { 'Accept': 'image/*' },
      // Throttle to simulate
    });
    const page2 = await context.newPage();
    await page2.goto('http://localhost:3000/cls-optimized'); // Page with 100+ images
    const responses = await page2.context().on('response', r => r.url().includes('image'));
    expect(responses.length).toBeLessThan(7); // Cap
  });

  test('works in scroll container', async ({ page }) => {
    // Simulate nested scroll with menu
    await page.goto('http://localhost:3000/menu');
    await page.locator('.menu-grid').scrollIntoViewIfNeeded();
    // Check images load on container scroll
  });
});