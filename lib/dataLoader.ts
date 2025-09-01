// Universal client-side JSON loader with runtime base URL resolution
// Works in Next.js client components (and Vite if ported)

import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';
const normalize = (s: string) => s.replace(/\/+$/, "");
const join = (a: string, b: string) => `${normalize(a)}/${b.replace(/^\/+/, "")}`;

// Determine base at runtime (env var or fallback to /data)
export const getDataBase = (): string => {
  // Next.js public env
  const next = typeof process !== 'undefined' ? (process as any)?.env?.NEXT_PUBLIC_DATA_BASE_URL : undefined;
  return next || '/data';
};

interface CacheEntry<T> {
  promise?: Promise<T>;
  data?: T;
  etag?: string | null;
  lastFetched?: number;
}

const cache = new Map<string, CacheEntry<any>>();

type Strategy = 'network-first' | 'stale-while-revalidate';

interface FetchOptions {
  strategy?: Strategy;
  retries?: number; // network retries
  retryDelayMs?: number; // base delay
  ttlMs?: number; // minimum age before background refresh (SWR)
  force?: boolean; // force a network request now
}

const DEFAULT_OPTS: Required<Pick<FetchOptions, 'strategy' | 'retries' | 'retryDelayMs' | 'ttlMs' | 'force'>> = {
  strategy: 'stale-while-revalidate',
  retries: 2,
  retryDelayMs: 300,
  ttlMs: 60_000, // 1 minute default TTL
  force: false,
};

async function fetchWithRetry(url: string, init: any, retries: number, delay: number): Promise<Response> { // intentionally using any for flexible RequestInit
  let attempt = 0;
  // Exponential backoff with jitter; stop after retries exceeded
  // Using while loop with explicit break to satisfy lint (no constant condition)
  // attempt 0 = first try, up to retries inclusive attempts
  // e.g. retries=2 => attempts 0,1,2 (3 total)
  for (;;) { // eslint-disable-line no-constant-condition
    try {
      return fetchWithResilience(url, init, { tries: retries + 1, timeoutMs: 15000, baseBackoffMs: delay });
    } catch (e) {
      if (attempt >= retries) throw e;
      const wait = delay * Math.pow(2, attempt) + Math.random() * 100;
      await new Promise((res) => setTimeout(res, wait));
      attempt++;
    }
  }
}

export async function fetchJSON<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { strategy, retries, retryDelayMs, ttlMs, force } = { ...DEFAULT_OPTS, ...opts };
  // Preserve absolute URLs and root-relative paths (e.g. /api/*) to avoid accidental prefixing
  const isAbsolute = /^(https?:)?\//.test(path); // starts with http(s):// or /
  const url = isAbsolute ? path : join(getDataBase(), path);
  let entry = cache.get(url) as CacheEntry<T> | undefined;
  if (!entry) {
    entry = {};
    cache.set(url, entry);
  }

  // If we already have data and strategy is stale-while-revalidate, kick off background refresh
  if (!force && entry.data && strategy === 'stale-while-revalidate' && !entry.promise) {
    const age = entry.lastFetched ? Date.now() - entry.lastFetched : Infinity;
    const needsRefresh = age >= ttlMs;
    if (!needsRefresh) return entry.data; // fresh enough
    // Fire and forget refresh using ETag if available
    entry.promise = (async () => {
      try {
        const headers: Record<string, string> = { 'cache-control': 'no-store' };
        if (entry!.etag) headers['If-None-Match'] = entry!.etag;
        const resp = await fetchWithRetry(url, { headers }, retries, retryDelayMs);
        if (resp.status === 304) {
          // Not modified
          return entry!.data as T;
        }
        if (!resp.ok) throw new Error(`Fetch failed ${resp.status} for ${url}`);
        entry!.etag = resp.headers.get('ETag');
        const json = await resp.json();
        entry!.data = json;
        entry!.lastFetched = Date.now();
        return json as T;
      } finally {
        entry!.promise = undefined; // allow future refreshes
      }
    })();
    // Return stale immediately
    return entry.data;
  }

  // If an in-flight promise exists, reuse it
  if (entry.promise) return entry.promise;

  // Otherwise perform network (initial | network-first | force)
  entry.promise = (async () => {
    const headers: Record<string, string> = { 'cache-control': 'no-store' };
    if (entry!.etag) headers['If-None-Match'] = entry!.etag;
    const resp = await fetchWithRetry(url, { headers }, retries, retryDelayMs);
    if (resp.status === 304 && entry!.data) {
      return entry!.data; // still valid
    }
    if (!resp.ok) throw new Error(`Fetch failed ${resp.status} for ${url}`);
    entry!.etag = resp.headers.get('ETag');
    const json = await resp.json();
    entry!.data = json;
    entry!.lastFetched = Date.now();
    return json as T;
  })();
  try {
    return await entry.promise;
  } finally {
    if (strategy === 'stale-while-revalidate') {
      entry.promise = undefined; // allow background refreshes next time
    }
  }
}

// Utility to clear cache (useful in dev / hot reload) – preserves structure
export const clearDataCache = () => cache.clear();

// Manual refetch utility (force network)
export const refetchJSON = async <T>(path: string) => fetchJSON<T>(path, { force: true, strategy: 'network-first' });
