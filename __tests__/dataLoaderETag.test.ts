import { fetchJSON, clearDataCache } from '@/lib/dataLoader';

describe('dataLoader ETag & SWR', () => {
  afterEach(() => {
    clearDataCache();
    // @ts-ignore
    global.fetch.mockReset?.();
  });

  it('uses ETag to avoid refetching unchanged data (304)', async () => {
    let call = 0;
    // @ts-ignore
    global.fetch = jest.fn((url: string, init?: any) => {
      call++;
      if (call === 1) {
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: { get: (k: string) => k.toLowerCase() === 'etag' ? 'W/"abc"' : null },
          json: () => Promise.resolve({ value: 1 })
        });
      }
      // Expect If-None-Match header on second call
      if (!init?.headers?.['If-None-Match']) throw new Error('Missing If-None-Match');
      return Promise.resolve({
        ok: true,
        status: 304,
        headers: { get: (k: string) => k.toLowerCase() === 'etag' ? 'W/"abc"' : null },
        json: () => Promise.resolve({ value: 2 }) // should not be used
      });
    });
    const first = await fetchJSON<any>('site.json');
    const second = await fetchJSON<any>('site.json'); // triggers SWR refresh but returns cached immediately
    expect(first.value).toBe(1);
    expect(second.value).toBe(1);
  });
});
