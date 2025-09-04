import { NextResponse } from 'next/server';

/**
 * Chrome DevTools configuration endpoint
 * Prevents 404 errors in development logs
 */
export async function GET() {
  return NextResponse.json({}, { status: 200 });
}