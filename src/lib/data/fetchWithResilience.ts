export interface ResilientOptions {
  tries?: number; // total attempts
  timeoutMs?: number; // per-attempt timeout
  baseBackoffMs?: number; // base delay for backoff
}

/**
 * Resilient fetch with timeout, retries (429/5xx aware), and exponential backoff with jitter.
 * Suitable for client-side hooks; preserves Response for caller to parse.
 */
export async function fetchWithResilience(
  url: string,
  init: RequestInit = {},
  { tries = 3, timeoutMs = 15000, baseBackoffMs = 400 }: ResilientOptions = {}
): Promise<Response> {
  let attempt = 0;
  let lastErr: any;

  while (attempt < tries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: init.signal ?? controller.signal });
      // Retry on 429 or 5xx
      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        const retryAfterHeader = res.headers.get('retry-after');
        const retryAfter = retryAfterHeader ? Number(retryAfterHeader) * (retryAfterHeader.includes(':') ? 0 : 1000) : undefined;
        const backoff = retryAfter || Math.pow(2, attempt) * baseBackoffMs + Math.random() * 100;
        await new Promise((r) => setTimeout(r, backoff));
      } else if (!res.ok) {
        // Non-retriable http errors
        return res;
      } else {
        return res;
      }
    } catch (e) {
      lastErr = e;
      // Network/abort: backoff then retry if attempts remain
      if (attempt === tries - 1) break;
      const backoff = Math.pow(2, attempt) * baseBackoffMs + Math.random() * 100;
      await new Promise((r) => setTimeout(r, backoff));
    } finally {
      clearTimeout(timer);
      attempt++;
    }
  }
  throw lastErr || new Error('Exhausted retries');
}

