import { NextResponse } from 'next/server';
import { getMenuData } from '@/src/lib/data/server-loader';

export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const menu = await getMenuData();
    return NextResponse.json(menu, { status: 200, headers: { 'cache-control': 'public, s-maxage=300, stale-while-revalidate=300' } });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to load menu' }, { status: 500 });
  }
}
