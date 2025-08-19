import { MarketingSchema, RestaurantSchema, MenuSchema } from '@/src/lib/data/schemas';
import { getMarketingSmart, getRestaurantSmart, getMenuSmart } from '@/src/lib/data/loader';

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
});
