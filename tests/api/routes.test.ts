import { MarketingSchema, RestaurantSchema, MenuSchema, ContentSchema } from '@/src/lib/data/schemas';
import { getMarketingSmart, getRestaurantSmart, getMenuSmart, getContentSmart } from '@/src/lib/data/server-loader';

describe('smart loaders', () => {
  test('getMarketingSmart falls back to fs', async () => {
    const m = await getMarketingSmart('dev');
    expect(MarketingSchema.parse(m)).toBeTruthy();
  });
  test('getRestaurantSmart falls back to fs', async () => {
    const r = await getRestaurantSmart('dev');
    expect(RestaurantSchema.parse(r)).toBeTruthy();
  });
  test('getMenuSmart falls back to fs', async () => {
    const m = await getMenuSmart('dev');
    expect(MenuSchema.parse(m)).toBeTruthy();
  });
  
  // Content API Integration Tests
  test('getContentSmart falls back to fs', async () => {
    const c = await getContentSmart('dev');
    expect(ContentSchema.parse(c)).toBeTruthy();
  });
  
  test('content smart loader returns valid structure', async () => {
    const content = await getContentSmart('dev');
    expect(content.global).toBeDefined();
    expect(content.pages).toBeDefined();
    expect(content.components).toBeDefined();
    expect(content.forms).toBeDefined();
    expect(content.api).toBeDefined();
  });
  
  test('content API provides navigation data', async () => {
    const content = await getContentSmart('app');
    expect(content.global.navigation.header.links).toBeDefined();
    expect(Array.isArray(content.global.navigation.header.links)).toBe(true);
    expect(content.global.navigation.footer.sections).toBeDefined();
  });
  
  test('content API provides UI elements', async () => {
    const content = await getContentSmart('app');
    expect(content.global.ui.buttons).toBeDefined();
    expect(content.global.ui.labels).toBeDefined();
    expect(content.global.ui.messages).toBeDefined();
  });
  
  test('content API provides page-specific content', async () => {
    const content = await getContentSmart('app');
    expect(content.pages.home.hero).toBeDefined();
    expect(content.pages.about.hero).toBeDefined();
    expect(content.pages.contact.hero).toBeDefined();
    expect(content.pages.events.hero).toBeDefined();
  });
  
  test('content API provides component content', async () => {
    const content = await getContentSmart('dev');
    if (content.components.testimonials) {
      expect(content.components.testimonials.title).toBeDefined();
      expect(content.components.testimonials.items).toBeDefined();
    }
    if (content.components.faq) {
      expect(content.components.faq.title).toBeDefined();
      expect(content.components.faq.items).toBeDefined();
    }
  });
  
  test('content API provides form and validation data', async () => {
    const content = await getContentSmart('dev');
    expect(content.forms.validation).toBeDefined();
    expect(content.forms.labels).toBeDefined();
    expect(content.forms.messages).toBeDefined();
  });
  
  test('content API provides API error messages', async () => {
    const content = await getContentSmart('dev');
    expect(content.api.messages).toBeDefined();
    expect(content.api.errors).toBeDefined();
    expect(content.api.errors.menu).toBeDefined();
    expect(content.api.errors.restaurant).toBeDefined();
  });
});
