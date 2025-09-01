import { NextResponse } from 'next/server';
import { getUpcomingMatches } from '@/src/lib/matches';

export async function GET() {
  const matches = await getUpcomingMatches(6);
  return NextResponse.json({ matches });
}
