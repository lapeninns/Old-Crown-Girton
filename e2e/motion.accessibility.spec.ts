import { test, expect } from '@playwright/test';

test.describe('Motion accessibility', () => {
  test('respects reduced motion preference', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const isReduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    expect(isReduced).toBeTruthy();
    // smoke: ensure page interactive and no script errors under reduced motion
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('modal traps focus during animation', async ({ page }) => {
    await page.goto('/');
    // Ensure booking portal mounted (LayoutClient sets data-booking-portal-mounted)
    await page.waitForSelector('[data-booking-portal-mounted]');
    // Open booking modal via global custom event
    await page.evaluate(() => {
      window.dispatchEvent(new Event('open-booking-modal'));
    });
    const modal = page.getByTestId('booking-modal');
    await expect(modal).toBeVisible();

    // Collect first and last focusable items inside modal
    const focusables = await modal.locator('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])').elementHandles();
    expect(focusables.length).toBeGreaterThan(0);

    // Press tab multiple times and ensure focus stays within modal
    for (let i = 0; i < Math.min(10, focusables.length + 2); i++) {
      await page.keyboard.press('Tab');
      const activeInModal = await page.evaluate((modalEl) => modalEl.contains(document.activeElement), await modal.elementHandle());
      expect(activeInModal).toBeTruthy();
    }

    // Close modal by clicking backdrop
    // Backdrop has role implied as overlay; click the dimmed area
    await page.mouse.click(10, 10);
    await expect(modal).toBeHidden({ timeout: 3000 });
  });
});

