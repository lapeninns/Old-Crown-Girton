import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Responsive Home Page', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('validates header navigation collapse on mobile vs desktop', async ({ page, isMobile }) => {
    // On mobile, menu should be hidden by default and show hamburger
    if (isMobile) {
      await expect(page.getByRole('button', { name: /open main menu/i })).toBeVisible();
      await expect(page.getByRole('navigation').locator('.hidden.lg\\:flex')).not.toBeVisible();
      
      // Test mobile menu toggle
      await page.getByRole('button', { name: /open main menu/i }).click();
      await expect(page.getByRole('link', { name: /menu/i })).toBeVisible();
      
      // Test escape key closes menu
      await page.keyboard.press('Escape');
      await expect(page.getByRole('link', { name: /menu/i })).not.toBeVisible();
      
    } else {
      // On desktop, navigation links should be visible, hamburger hidden
      await expect(page.getByRole('navigation').locator('.hidden.lg\\:flex')).toBeVisible();
      await expect(page.getByRole('button', { name: /open main menu/i })).not.toBeVisible();
    }
  });

  test('validates keyboard navigation through header elements', async ({ page }) => {
    // Start from logo and tab through navigation
    await page.getByRole('link', { name: /old crown/i }).focus();
    
    // Tab through main navigation links
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Ensure tab order makes sense (should hit navigation links)
    const menuLink = page.getByRole('link', { name: /menu/i });
    if (await menuLink.isVisible()) {
      await menuLink.focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/.*\/menu/);
    }
  });

  test('ensures no horizontal overflow across viewport sizes', async ({ page }) => {
    // Check that page doesn't overflow horizontally
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowInnerWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyScrollWidth).toBeLessThanOrEqual(windowInnerWidth + 1); // +1 for rounding
    
    // Check specific sections don't overflow
    const heroSection = page.locator('section').first();
    const heroBounds = await heroSection.boundingBox();
    
    if (heroBounds) {
      expect(heroBounds.width).toBeLessThanOrEqual(windowInnerWidth + 1);
    }
  });

  test('captures visual baseline screenshots for critical sections', async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Screenshot above-the-fold hero section
    const heroSection = page.locator('section').first();
    await expect(heroSection).toHaveScreenshot('hero-section.png', {
      maxDiffPixelRatio: 0.01
    });
    
    // Screenshot navigation area
    const navigation = page.getByRole('navigation').first();
    await expect(navigation).toHaveScreenshot('navigation.png', {
      maxDiffPixelRatio: 0.01
    });
  });

  test('validates reduced motion behavior', async ({ page }) => {
    // Enable reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    
    // Check that animations respect reduced motion
    // Look for elements that should have instant state changes
    const ctaButton = page.getByRole('link', { name: /book now|view menu/i }).first();
    
    if (await ctaButton.isVisible()) {
      // With reduced motion, hover effects should be instant or minimal
      await ctaButton.hover();
      
      // Animations should complete quickly or be disabled
      await page.waitForTimeout(100); // Brief wait to ensure instant transition
      
      const buttonStyle = await ctaButton.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return computed.transitionDuration;
      });
      
      // Should have no transition or very fast transition when reduced motion is enabled
      expect(['0s', '0.01s'].some(duration => buttonStyle.includes(duration))).toBeTruthy();
    }
  });

  test('validates dark mode appearance and contrast', async ({ page, colorScheme }) => {
    if (colorScheme === 'dark') {
      // Set DaisyUI dark theme
      await page.addInitScript(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
      });
      await page.reload();
      
      // Take screenshot for dark mode comparison
      await page.waitForLoadState('networkidle');
      await expect(page.locator('body')).toHaveScreenshot('dark-mode-home.png', {
        maxDiffPixelRatio: 0.01
      });
      
      // Verify dark background is applied
      const bodyBg = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      
      // Should be a dark color (not white/light)
      expect(bodyBg).not.toBe('rgb(255, 255, 255)');
    }
  });

  test('validates accessibility landmarks and heading structure', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('main')
      .include('nav')
      .include('header')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
    
    // Check for proper landmark structure
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    
    // Check heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Should have exactly one h1
    
    // Verify skip link exists and works
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    if (await skipLink.isVisible()) {
      await skipLink.click();
      const focusedElement = page.locator(':focus');
      const focusedId = await focusedElement.getAttribute('id');
      expect(focusedId).toBe('main-content');
    }
  });

});
