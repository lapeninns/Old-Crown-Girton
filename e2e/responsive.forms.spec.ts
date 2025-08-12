import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Responsive Forms', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('validates booking modal form layout across breakpoints', async ({ page, viewport }) => {
    // Open booking modal
    const bookingButton = page.getByRole('button', { name: /book/i }).or(
      page.getByRole('link', { name: /book/i })
    ).first();
    
    if (await bookingButton.isVisible()) {
      await bookingButton.click();
    } else {
      // Trigger booking modal via custom event (as seen in StickyCallButton)
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('open-booking-modal'));
      });
    }
    
    // Wait for modal to appear
    const modal = page.getByRole('dialog').or(page.locator('[role="dialog"]')).or(
      page.locator('.fixed.inset-0').filter({ hasText: /book/i })
    );
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Validate form layout responsiveness
    const form = modal.locator('form');
    await expect(form).toBeVisible();
    
    // Check field stacking behavior
    const nameField = form.getByLabel(/name/i);
    const phoneField = form.getByLabel(/phone/i);
    
    if (await nameField.isVisible() && await phoneField.isVisible()) {
      const nameBox = await nameField.boundingBox();
      const phoneBox = await phoneField.boundingBox();
      
      if (nameBox && phoneBox && viewport && viewport.width < 640) {
        // On mobile, fields should stack vertically
        expect(nameBox.y).toBeLessThan(phoneBox.y);
      } else if (nameBox && phoneBox && viewport && viewport.width >= 640) {
        // On desktop, fields might be side by side
        // Either same row or still stacked (both are valid responsive patterns)
        expect(Math.abs(nameBox.y - phoneBox.y)).toBeLessThan(50); // Within 50px vertically
      }
    }
  });

  test('validates input touch target sizes (≥44px)', async ({ page, isMobile }) => {
    if (!isMobile) return; // Only test on mobile devices
    
    // Open booking modal
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-booking-modal'));
    });
    
    const modal = page.locator('.fixed.inset-0').filter({ hasText: /book/i });
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Check all interactive elements meet minimum touch target size
    const interactiveElements = modal.locator('input, button, select, textarea');
    const count = await interactiveElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = interactiveElements.nth(i);
      const box = await element.boundingBox();
      
      if (box) {
        // Minimum 44x44px for touch targets (WCAG AA)
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('validates form error message display and focus management', async ({ page }) => {
    // Open booking modal
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-booking-modal'));
    });
    
    const modal = page.locator('.fixed.inset-0').filter({ hasText: /book/i });
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Try to submit form without required fields
    const submitButton = modal.getByRole('button', { name: /request|book|submit/i });
    await submitButton.click();
    
    // Check if native HTML5 validation appears or custom error messages
    const nameField = modal.getByLabel(/name/i);
    if (await nameField.isVisible()) {
      // Check if field is marked as invalid
      const isInvalid = await nameField.evaluate((el: Element) => {
        return el instanceof HTMLInputElement && !el.validity.valid;
      });
      const hasErrorMessage = await modal.locator('.text-red-500, [role="alert"], .error').isVisible();
      
      // Either HTML5 validation or custom error handling should be present
      expect(isInvalid || hasErrorMessage).toBeTruthy();
    }
  });

  test('validates form behavior with server errors via MSW', async ({ page, context }) => {
    // Mock a server error response
    await context.route('**/api/**', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error occurred' })
        });
      } else {
        route.continue();
      }
    });
    
    // Open booking modal and fill form
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-booking-modal'));
    });
    
    const modal = page.locator('.fixed.inset-0').filter({ hasText: /book/i });
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Fill required fields
    const nameField = modal.getByLabel(/name/i);
    const phoneField = modal.getByLabel(/phone/i);
    
    if (await nameField.isVisible()) await nameField.fill('Test User');
    if (await phoneField.isVisible()) await phoneField.fill('01223123456');
    
    // Submit form
    const submitButton = modal.getByRole('button', { name: /request|book|submit/i });
    await submitButton.click();
    
    // Check for error handling
    await expect(modal.locator('.text-red-500, [role="alert"], .error')).toBeVisible({ timeout: 3000 });
  });

  test('validates form accessibility with axe', async ({ page }) => {
    // Open booking modal
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-booking-modal'));
    });
    
    const modal = page.locator('.fixed.inset-0').filter({ hasText: /book/i });
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Run accessibility scan on form
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
    
    // Verify form labels are properly associated
    const nameField = modal.getByLabel(/name/i);
    if (await nameField.isVisible()) {
      const fieldId = await nameField.getAttribute('id');
      if (fieldId) {
        const label = modal.locator(`label[for="${fieldId}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('validates focus management and keyboard navigation', async ({ page }) => {
    // Open booking modal
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-booking-modal'));
    });
    
    const modal = page.locator('.fixed.inset-0').filter({ hasText: /book/i });
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Check initial focus goes to modal
    const activeElement = page.locator(':focus');
    const modalContainer = modal.locator('[role="dialog"]').or(modal.locator('.bg-white').first());
    
    // Focus should be within modal
    const focusWithinModal = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]') || 
                   document.querySelector('.fixed.inset-0 .bg-white');
      const focused = document.activeElement;
      return modal?.contains(focused) || modal === focused;
    });
    
    expect(focusWithinModal).toBeTruthy();
    
    // Test tab navigation stays within modal (focus trap)
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const stillWithinModal = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]') || 
                   document.querySelector('.fixed.inset-0 .bg-white');
      const focused = document.activeElement;
      return modal?.contains(focused);
    });
    
    expect(stillWithinModal).toBeTruthy();
    
    // Test escape key closes modal
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible({ timeout: 2000 });
  });

  test('ensures form layout maintains readability with long content', async ({ page }) => {
    // Open booking modal
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-booking-modal'));
    });
    
    const modal = page.locator('.fixed.inset-0').filter({ hasText: /book/i });
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Fill form with very long text to test layout
    const messageField = modal.getByLabel(/message|request|special/i);
    if (await messageField.isVisible()) {
      const longText = 'This is a very long message that should test how the form handles lengthy input text. '.repeat(10);
      await messageField.fill(longText);
      
      // Ensure text area expands appropriately and doesn't break layout
      const messageBox = await messageField.boundingBox();
      const modalBox = await modal.boundingBox();
      
      if (messageBox && modalBox) {
        // Text area should not exceed modal width
        expect(messageBox.width).toBeLessThanOrEqual(modalBox.width);
        // Should have reasonable height
        expect(messageBox.height).toBeGreaterThan(60); // More than single line
        expect(messageBox.height).toBeLessThan(400); // But not excessive
      }
    }
  });

});
