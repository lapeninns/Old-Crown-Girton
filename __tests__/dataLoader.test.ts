import { fetchJSON, getDataBase, clearDataCache } from '@/lib/dataLoader';

describe('dataLoader', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    clearDataCache();
    // @ts-ignore
    global.fetch.mockReset?.();
  });

  it('falls back to /data when env missing', async () => {
    delete process.env.NEXT_PUBLIC_DATA_BASE_URL;
    const calls: string[] = [];
    // @ts-ignore
  global.fetch = jest.fn((url: string) => { calls.push(url); return Promise.resolve({ ok: true, status: 200, headers: { get: () => null }, json: () => Promise.resolve({ ok: true }) }); });
    expect(getDataBase()).toBe('/data');
    await fetchJSON<any>('site.json');
    expect(calls[0]).toBe('/data/site.json');
  });

  it('uses env base when provided', async () => {
    process.env.NEXT_PUBLIC_DATA_BASE_URL = 'https://cdn.example.com/app-data';
    const calls: string[] = [];
    // @ts-ignore
  global.fetch = jest.fn((url: string) => { calls.push(url); return Promise.resolve({ ok: true, status: 200, headers: { get: () => null }, json: () => Promise.resolve({ ok: true }) }); });
    expect(getDataBase()).toBe('https://cdn.example.com/app-data');
    await fetchJSON<any>('site.json');
    expect(calls[0]).toBe('https://cdn.example.com/app-data/site.json');
  });

  it('caches identical requests', async () => {
    delete process.env.NEXT_PUBLIC_DATA_BASE_URL;
    let count = 0;
    // @ts-ignore
  global.fetch = jest.fn((url: string) => { count++; return Promise.resolve({ ok: true, status: 200, headers: { get: () => null }, json: () => Promise.resolve({ count }) }); });
    const a = fetchJSON<any>('site.json');
    const b = fetchJSON<any>('site.json');
    await Promise.all([a,b]);
    expect(count).toBe(1); // only one underlying fetch
  });
});
