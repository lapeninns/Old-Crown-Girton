import { NextResponse } from 'next/server';
import { getConfigData } from '@/src/lib/data/server-loader';
import { resolveEnv } from '@/src/lib/data/env';

export const revalidate = 120; // 2 minutes

export async function GET() {
  try {
    const env = resolveEnv();
    const cfg = await getConfigData(env);
    // Only return safe client-visible fields
    const safe = {
      env: cfg.env,
      featureFlags: cfg.featureFlags,
      api: { 
        baseUrl: cfg.api.baseUrl ?? null, 
        menuEndpoint: cfg.api.menuEndpoint ?? null,
        marketingEndpoint: cfg.api.marketingEndpoint ?? null,
        restaurantEndpoint: cfg.api.restaurantEndpoint ?? null,
      },
      cms: { enabled: cfg.cms.enabled },
      metadata: cfg.metadata,
    };
  return NextResponse.json(safe, { status: 200, headers: { 'cache-control': 'public, s-maxage=120, stale-while-revalidate=300' } });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to load config' }, { status: 500 });
  }
}
