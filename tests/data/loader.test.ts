import path from 'node:path';
import { getMenuData, getConfigData, getMarketingContent, getRestaurantInfo, getContentData, getContentSmart, fetchContentFromApi } from '@/src/lib/data/server-loader';
import { resolveEnv } from '@/src/lib/data/env';
import { MenuSchema, ContentSchema } from '@/src/lib/data/schemas';

describe('data loader', () => {
  test('loads menu from /menu directory', async () => {
    const data = await getMenuData('app');
    expect(Array.isArray(data.sections)).toBe(true);
    expect(data.sections.length).toBeGreaterThan(0);
  });

  test('env resolution returns app', () => {
    const env = resolveEnv();
    expect(env).toBe('app');
  });

  test('loads config.json from /config directory', async () => {
    const cfg = await getConfigData('app');
    expect(cfg.env).toBe('app');
  });

  test('loads marketing and restaurant from /config directory', async () => {
    const m = await getMarketingContent('app');
    expect(m.hero.title.length).toBeGreaterThan(0);
    const r = await getRestaurantInfo('app');
    expect(r.name.length).toBeGreaterThan(0);
  });

  test('MenuSchema validates fetched-like payload', async () => {
    const payload = {
      updatedAt: 'now',
      sections: [ { id: 'a', name: 'A', items: [ { id: 'i', name: 'N', price: { amount: 1, currency: 'GBP' } } ] } ]
    };
    const parsed = MenuSchema.parse(payload);
    expect(parsed.sections[0].items[0].price.amount).toBe(1);
  });

  // Content Loading Tests
  test('loads content data from /config directory', async () => {
    const content = await getContentData('dev');
    expect(content.global).toBeDefined();
    expect(content.global.site).toBeDefined();
    expect(content.global.site.name).toBeDefined();
    expect(content.pages).toBeDefined();
    expect(content.components).toBeDefined();
  });

  test('ContentSchema validates content structure', async () => {
    const content = await getContentData('dev');
    const parsed = ContentSchema.parse(content);
    expect(parsed.global.site.name).toBe(content.global.site.name);
    expect(parsed.pages.home).toBeDefined();
    expect(parsed.components).toBeDefined();
  });

  test('getContentSmart returns content with proper fallback', async () => {
    const content = await getContentSmart('dev');
    expect(content).toBeDefined();
    expect(content.global).toBeDefined();
    expect(content.global.site.name).toBeTruthy();
  });

  test('content contains required global sections', async () => {
    const content = await getContentData('dev');
    expect(content.global.site).toBeDefined();
    expect(content.global.navigation).toBeDefined();
    expect(content.global.ui).toBeDefined();
    expect(content.global.accessibility).toBeDefined();
  });

  test('content contains required page sections', async () => {
    const content = await getContentData('dev');
    expect(content.pages.home).toBeDefined();
    expect(content.pages.about).toBeDefined();
    expect(content.pages.contact).toBeDefined();
    expect(content.pages.events).toBeDefined();
    expect(content.pages.menu).toBeDefined();
  });

  test('content contains required component sections', async () => {
    const content = await getContentData('dev');
    expect(content.components.testimonials).toBeDefined();
    expect(content.components.faq).toBeDefined();
    expect(content.components.menuHighlights).toBeDefined();
  });

  test('content contains forms and API sections', async () => {
    const content = await getContentData('dev');
    expect(content.forms).toBeDefined();
    expect(content.forms.validation).toBeDefined();
    expect(content.forms.labels).toBeDefined();
    expect(content.api).toBeDefined();
    expect(content.api.messages).toBeDefined();
  });

  test('navigation content has required structure', async () => {
    const content = await getContentData('dev');
    const nav = content.global.navigation;
    expect(nav.header.links).toBeDefined();
    expect(Array.isArray(nav.header.links)).toBe(true);
    expect(nav.footer.sections).toBeDefined();
    expect(Array.isArray(nav.footer.sections)).toBe(true);
  });

  test('testimonials component has required structure', async () => {
    const content = await getContentData('dev');
    const testimonials = content.components.testimonials;
    expect(testimonials.title).toBeDefined();
    expect(testimonials.subtitle).toBeDefined();
    expect(testimonials.items).toBeDefined();
    expect(Array.isArray(testimonials.items)).toBe(true);
  });

  test('FAQ component has required structure', async () => {
    const content = await getContentData('dev');
    const faq = content.components.faq;
    expect(faq.title).toBeDefined();
    expect(faq.subtitle).toBeDefined();
    expect(faq.items).toBeDefined();
    expect(Array.isArray(faq.items)).toBe(true);
    if (faq.items.length > 0) {
      expect(faq.items[0].question).toBeDefined();
      expect(faq.items[0].answer).toBeDefined();
    }
  });

  test('form validation messages are defined', async () => {
    const content = await getContentData('dev');
    const validation = content.forms.validation;
    expect(validation.required).toBeDefined();
    expect(validation.email).toBeDefined();
    expect(validation.phone).toBeDefined();
  });

  test('UI buttons and labels are defined', async () => {
    const content = await getContentData('dev');
    const ui = content.global.ui;
    expect(ui.buttons).toBeDefined();
    expect(ui.labels).toBeDefined();
    expect(ui.messages).toBeDefined();
    expect(ui.buttons.bookOnline).toBeDefined();
    expect(ui.buttons.viewMenu).toBeDefined();
  });
});
