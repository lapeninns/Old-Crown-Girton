import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Responsive Dialogs and Drawers', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('validates booking modal responsive behavior', async ({ page, viewport, isMobile }) => {
    // Open booking modal
    const bookingButton = page.getByRole('button', { name: /book/i }).or(
      page.getByRole('link', { name: /book/i })
    ).first();
    
    if (await bookingButton.isVisible()) {
      await bookingButton.click();
    } else {
      // Trigger booking modal via custom event
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('open-booking-modal'));
      });
    }
    
    // Wait for modal to appear
    const modal = page.getByRole('dialog').or(page.locator('[role="dialog"]')).or(
      page.locator('.fixed.inset-0').filter({ hasText: /book/i })
    );
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Check modal sizing behavior
    const modalBox = await modal.boundingBox();
    
    if (modalBox && viewport) {
      if (isMobile || viewport.width < 640) {
        // On mobile, modal should use most of the screen
        expect(modalBox.width).toBeGreaterThan(viewport.width * 0.8);
        expect(modalBox.height).toBeGreaterThan(viewport.height * 0.6);
      } else {
        // On desktop, modal should be smaller and centered
        expect(modalBox.width).toBeLessThan(viewport.width * 0.8);
        expect(modalBox.height).toBeLessThan(viewport.height * 0.9);
        
        // Should be centered
        const centerX = viewport.width / 2;
        const modalCenterX = modalBox.x + modalBox.width / 2;
        expect(Math.abs(centerX - modalCenterX)).toBeLessThan(50);
      }
    }
  });

  test('validates mobile menu drawer functionality', async ({ page, isMobile }) => {
    if (!isMobile) return; // Only test on mobile devices
    
    // Look for mobile menu toggle button
    const menuToggle = page.getByRole('button', { name: /menu|hamburger|toggle/i }).or(
      page.locator('[aria-label*="menu"]').or(
        page.locator('button').filter({ hasText: /☰|≡/ })
      )
    );
    
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
      
      // Check for drawer/menu appearance
      const drawer = page.locator('[role="navigation"]').or(
        page.locator('.drawer-side').or(
          page.locator('.mobile-menu')
        )
      );
      
      await expect(drawer).toBeVisible({ timeout: 2000 });
      
      // Drawer should slide in from side (check transform or position)
      const drawerBox = await drawer.boundingBox();
      if (drawerBox) {
        // Should take significant portion of mobile screen
        expect(drawerBox.width).toBeGreaterThan(200);
        expect(drawerBox.height).toBeGreaterThan(300);
      }
      
      // Should be able to close drawer
      const closeButton = drawer.getByRole('button', { name: /close|×/i }).or(
        page.locator('[aria-label*="close"]')
      );
      
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await expect(drawer).not.toBeVisible({ timeout: 2000 });
      } else {
        // Try clicking outside to close
        await page.click('body', { position: { x: 10, y: 10 } });
        await expect(drawer).not.toBeVisible({ timeout: 2000 });
      }
    }
  });

  test('validates modal focus trap and escape handling', async ({ page }) => {
    // Open booking modal
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-booking-modal'));
    });
    
    const modal = page.locator('.fixed.inset-0').filter({ hasText: /book/i });
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Test focus trap - tabbing should cycle within modal
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    const focusWithinModal = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0') ||
                   document.querySelector('[role="dialog"]');
      const focused = document.activeElement;
      return modal?.contains(focused);
    });
    
    expect(focusWithinModal).toBeTruthy();
    
    // Test escape key closes modal
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible({ timeout: 2000 });
    
    // Focus should return to trigger element
    const bodyHasFocus = await page.evaluate(() => {
      return document.activeElement === document.body || 
             document.activeElement?.tagName === 'BUTTON';
    });
    expect(bodyHasFocus).toBeTruthy();
  });

  test('validates backdrop click closes modal', async ({ page }) => {
    // Open booking modal
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-booking-modal'));
    });
    
    const modal = page.locator('.fixed.inset-0').filter({ hasText: /book/i });
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Click on backdrop (outside modal content)
    const modalContent = modal.locator('.bg-white, .modal-box, [role="dialog"]').first();
    const modalBox = await modalContent.boundingBox();
    
    if (modalBox) {
      // Click outside the modal content but within the overlay
      await page.click('.fixed.inset-0', { 
        position: { x: modalBox.x - 50, y: modalBox.y } 
      });
      
      // Modal should close
      await expect(modal).not.toBeVisible({ timeout: 2000 });
    }
  });

  test('validates modal safe area padding on mobile', async ({ page, isMobile }) => {
    if (!isMobile) return;
    
    // Open booking modal
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-booking-modal'));
    });
    
    const modal = page.locator('.fixed.inset-0').filter({ hasText: /book/i });
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    const modalContent = modal.locator('.bg-white, .modal-box, [role="dialog"]').first();
    const contentBox = await modalContent.boundingBox();
    const viewport = page.viewportSize();
    
    if (contentBox && viewport) {
      // Should have safe area padding (at least 16px from edges)
      expect(contentBox.x).toBeGreaterThanOrEqual(16);
      expect(contentBox.y).toBeGreaterThanOrEqual(16);
      expect(contentBox.x + contentBox.width).toBeLessThanOrEqual(viewport.width - 16);
      expect(contentBox.y + contentBox.height).toBeLessThanOrEqual(viewport.height - 16);
    }
  });

  test('validates modal scrolling behavior with long content', async ({ page }) => {
    // Open booking modal
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-booking-modal'));
    });
    
    const modal = page.locator('.fixed.inset-0').filter({ hasText: /book/i });
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Add long content to test scrolling
    const messageField = modal.getByLabel(/message|request|special/i);
    if (await messageField.isVisible()) {
      const veryLongText = 'This is a very long message that will test scrolling behavior in the modal. '.repeat(50);
      await messageField.fill(veryLongText);
      
      // Check if modal content is scrollable
      const isScrollable = await modal.evaluate(el => {
        return el.scrollHeight > el.clientHeight;
      });
      
      // If content overflows, modal should be scrollable
      if (isScrollable) {
        await modal.evaluate(el => el.scrollTop = 100);
        const scrollTop = await modal.evaluate(el => el.scrollTop);
        expect(scrollTop).toBeGreaterThan(0);
      }
    }
  });

  test('validates drawer overlay and animation', async ({ page, isMobile }) => {
    if (!isMobile) return;
    
    // Look for mobile menu toggle
    const menuToggle = page.getByRole('button', { name: /menu|hamburger|toggle/i }).or(
      page.locator('[aria-label*="menu"]')
    );
    
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
      
      const drawer = page.locator('[role="navigation"]').or(
        page.locator('.drawer-side, .mobile-menu')
      );
      
      await expect(drawer).toBeVisible({ timeout: 2000 });
      
      // Check for overlay/backdrop
      const overlay = page.locator('.drawer-overlay, .modal-backdrop, .fixed.inset-0');
      await expect(overlay).toBeVisible();
      
      // Overlay should be behind drawer (z-index check)
      const overlayZIndex = await overlay.evaluate(el => 
        window.getComputedStyle(el).zIndex
      );
      const drawerZIndex = await drawer.evaluate(el => 
        window.getComputedStyle(el).zIndex
      );
      
      expect(parseInt(drawerZIndex)).toBeGreaterThan(parseInt(overlayZIndex));
    }
  });

  test('validates accessibility of modals and drawers', async ({ page }) => {
    // Test booking modal accessibility
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-booking-modal'));
    });
    
    const modal = page.locator('.fixed.inset-0').filter({ hasText: /book/i });
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('.fixed.inset-0')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
    
    // Check for proper ARIA attributes
    const modalContent = modal.locator('[role="dialog"]').or(
      modal.locator('.bg-white').first()
    );
    
    // Modal should have role="dialog"
    const hasDialogRole = await modal.locator('[role="dialog"]').isVisible() ||
                         await modalContent.getAttribute('role') === 'dialog';
    expect(hasDialogRole).toBeTruthy();
    
    // Should have aria-labelledby or aria-label
    const hasAriaLabel = await modalContent.getAttribute('aria-label') ||
                        await modalContent.getAttribute('aria-labelledby');
    expect(hasAriaLabel).toBeTruthy();
  });

  test('validates modal prevents body scroll', async ({ page }) => {
    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);
    
    // Scroll down a bit
    await page.evaluate(() => window.scrollTo(0, 100));
    const scrolledPosition = await page.evaluate(() => window.scrollY);
    expect(scrolledPosition).toBeGreaterThan(initialScroll);
    
    // Open modal
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-booking-modal'));
    });
    
    const modal = page.locator('.fixed.inset-0').filter({ hasText: /book/i });
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Try to scroll - body should be locked
    await page.evaluate(() => window.scrollTo(0, 200));
    const scrollAfterModal = await page.evaluate(() => window.scrollY);
    
    // Body scroll should be prevented (position should not change significantly)
    expect(Math.abs(scrollAfterModal - scrolledPosition)).toBeLessThan(10);
    
    // Close modal
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible({ timeout: 2000 });
    
    // Body scroll should be restored
    await page.evaluate(() => window.scrollTo(0, 300));
    const scrollAfterClose = await page.evaluate(() => window.scrollY);
    expect(scrollAfterClose).toBeGreaterThan(scrolledPosition);
  });

});
