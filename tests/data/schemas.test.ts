import { z } from 'zod';
import { MenuSchema, ConfigSchema, MarketingSchema, RestaurantSchema } from '@/src/lib/data/schemas';

describe('schemas', () => {
  test('MenuSchema accepts valid sample', () => {
    const parsed = MenuSchema.parse({
      updatedAt: '2025-01-01T00:00:00Z',
      sections: [
        { id: 's', name: 'Starters', items: [ { id: 'i1', name: 'Item', description: '', price: { amount: 1, currency: 'GBP' }, available: true, dietary: {}, tags: [] } ] }
      ]
    });
    expect(parsed.sections[0].items[0].price.amount).toBe(1);
  });

  test('MenuSchema rejects negative price', () => {
    expect(() => MenuSchema.parse({ updatedAt: 'x', sections: [ { id: 's', name: 'S', items: [ { id: 'i', name: 'N', price: { amount: -1 } } ] } ] })).toThrow();
  });

  test('ConfigSchema defaults', () => {
    const parsed = ConfigSchema.parse({ env: 'app' });
    expect(parsed.featureFlags).toEqual({});
  });

  test('MarketingSchema buttons default', () => {
    const parsed = MarketingSchema.parse({ hero: { title: 't' }, promos: [] });
    expect(parsed.buttons).toEqual({});
  });

  test('RestaurantSchema minimal', () => {
    const r = RestaurantSchema.parse({
      name: 'Old Crown', phone: 'x', email: 'y',
      address: { street: 'a', city: 'b', state: 'c', zip: 'd' },
      hours: { Mon: '9-5' }
    });
    expect(r.address.city).toBe('b');
  });
});
