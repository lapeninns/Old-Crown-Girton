import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

// The middleware is used to refresh the user's session before loading Server Component routes
export async function middleware(req) {
  const res = NextResponse.next();

  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
  );

  if (!hasSupabaseEnv) {
    // Skip Supabase middleware when environment variables are not configured (e.g., preview builds).
    return res;
  }

  try {
    const supabase = createMiddlewareClient({ req, res });
    await supabase.auth.getSession();
  } catch (err) {
    // Don't break requests during build / unknown env; log and continue.
    // eslint-disable-next-line no-console
    console.warn('Supabase middleware skipped:', err?.message || err);
  }

  return res;
}
