import { NextRequest } from 'next/server';
import { HEAD as ContentHEAD } from '@/app/api/content/route';
import { HEAD as MenuHEAD } from '@/app/api/menu/route';

// Mock SmartLoaders to avoid filesystem or complex logic
jest.mock('@/src/lib/data/loaders/ContentSmartLoader', () => ({
  ContentSmartLoader: {
    loadSmart: jest.fn().mockResolvedValue({
      data: { mock: 'content' },
      cached: false,
      timestamp: new Date('2024-01-01T00:00:00.000Z').toISOString(),
      source: 'filesystem',
      env: 'app',
    }),
  },
}));

jest.mock('@/src/lib/data/loaders/MenuSmartLoader', () => ({
  MenuSmartLoader: {
    loadSmart: jest.fn().mockResolvedValue({
      data: { sections: [] },
      cached: false,
      timestamp: new Date('2024-01-01T00:00:00.000Z').toISOString(),
      source: 'filesystem',
      env: 'app',
    }),
  },
}));

describe('HEAD routes', () => {
  it('HEAD /api/content returns ETag and cache headers', async () => {
    const req = new NextRequest('http://localhost:3000/api/content', { method: 'HEAD' });
    const res = await ContentHEAD(req);
    expect(res.status).toBe(200);
    const etag = res.headers.get('etag');
    const lastModified = res.headers.get('last-modified');
    expect(etag).toBeTruthy();
    expect(lastModified).toBeTruthy();
    expect(res.headers.get('cache-control')).toMatch(/public/);
    expect(res.headers.get('access-control-expose-headers')).toContain('etag');
  });

  it('HEAD /api/content honors If-None-Match', async () => {
    const first = await ContentHEAD(new NextRequest('http://localhost:3000/api/content', { method: 'HEAD' }));
    const etag = first.headers.get('etag')!;
    const second = await ContentHEAD(new NextRequest('http://localhost:3000/api/content', { method: 'HEAD', headers: { 'if-none-match': etag } }));
    expect(second.status).toBe(304);
  });

  it('HEAD /api/menu returns ETag and cache headers', async () => {
    const req = new NextRequest('http://localhost:3000/api/menu', { method: 'HEAD' });
    const res = await MenuHEAD(req);
    expect(res.status).toBe(200);
    const etag = res.headers.get('etag');
    const lastModified = res.headers.get('last-modified');
    expect(etag).toBeTruthy();
    expect(lastModified).toBeTruthy();
    expect(res.headers.get('cache-control')).toMatch(/public/);
  });

  it('HEAD /api/menu honors If-None-Match', async () => {
    const first = await MenuHEAD(new NextRequest('http://localhost:3000/api/menu', { method: 'HEAD' }));
    const etag = first.headers.get('etag')!;
    const second = await MenuHEAD(new NextRequest('http://localhost:3000/api/menu', { method: 'HEAD', headers: { 'if-none-match': etag } }));
    expect(second.status).toBe(304);
  });
});

