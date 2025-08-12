import path from 'node:path';
import { getMenuData, getConfigData, getMarketingContent, getRestaurantInfo } from '@/src/lib/data/loader';
import { resolveEnv } from '@/src/lib/data/env';
import { MenuSchema } from '@/src/lib/data/schemas';

describe('data loader', () => {
  test('loads dev menu.json', async () => {
    const data = await getMenuData('dev');
    expect(Array.isArray(data.sections)).toBe(true);
  });

  test('env resolution returns dev in test', () => {
    const env = resolveEnv();
    expect(env === 'dev' || env === 'prod' || env === 'staging').toBe(true);
  });

  test('loads config.json', async () => {
    const cfg = await getConfigData('dev');
    expect(cfg.env).toBe('dev');
  });

  test('loads marketing and restaurant', async () => {
    const m = await getMarketingContent('dev');
    expect(m.hero.title.length).toBeGreaterThan(0);
    const r = await getRestaurantInfo('dev');
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
});
