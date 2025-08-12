import { NextResponse } from 'next/server';
import { getRestaurantInfo } from '@/src/lib/data/loader';

export const revalidate = 600; // 10 minutes

export async function GET() {
  try {
    const info = await getRestaurantInfo();
  return NextResponse.json(info, { status: 200, headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=600' } });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to load restaurant' }, { status: 500 });
  }
}
