import { NextResponse } from 'next/server';
import { getMarketingContent } from '@/src/lib/data/server-loader';

export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const marketing = await getMarketingContent();
  // For ISR-friendly behavior, allow short public caching + Next.js revalidate via tags if used elsewhere
  return NextResponse.json(marketing, { status: 200, headers: { 'cache-control': 'public, s-maxage=300, stale-while-revalidate=300' } });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to load marketing' }, { status: 500 });
  }
}
