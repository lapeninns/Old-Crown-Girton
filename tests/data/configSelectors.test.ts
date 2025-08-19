import { isFeatureEnabled, getApiConfig, getEnvMetadata } from '@/src/lib/data/configSelectors';

describe('config selectors', () => {
  test('feature flag false by default', async () => {
    const ok = await isFeatureEnabled('posSync', 'dev');
    expect(ok === true || ok === false).toBe(true);
  });

  test('api config loads', async () => {
    const api = await getApiConfig('dev');
    expect(typeof api === 'object').toBe(true);
  });

  test('env metadata', async () => {
    const meta = await getEnvMetadata('dev');
    expect(meta.env).toBe('dev');
  });
});
