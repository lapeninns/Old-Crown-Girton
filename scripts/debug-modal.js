const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const buttons = await page.$$eval('button, a', els => els.map(e => ({
    tag: e.tagName,
    role: e.getAttribute('role') || undefined,
    ariaLabel: e.getAttribute('aria-label'),
    text: e.innerText,
    classes: e.className,
    visible: !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
  })));
  console.log('Found buttons/links:', buttons.filter(b => b.ariaLabel || /book/i.test(b.text) || /book/i.test(b.class)));

  // check for booking modal container
  const modal = await page.$('[data-testid="booking-modal"], [role="dialog"]');
  if (modal) {
    const visible = await modal.isVisible();
    console.log('Modal exists, visible=', visible);
  } else {
    console.log('No modal element present');
  }

  // attempt to click Book button by aria-label
  // Dispatch open-booking-modal like the tests do (to reproduce test flow)
  console.log('Dispatching open-booking-modal event...');
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('open-booking-modal'));
  });
  // allow a short time for fallback or React modal to appear
  await page.waitForTimeout(500);
  const modalAfter = await page.$('[data-testid="booking-modal"], [role="dialog"], #booking-modal-fallback');
  console.log('Modal after dispatch present?', !!modalAfter);

  await browser.close();
})();
