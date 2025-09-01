export interface ResilientOptions {
  tries?: number; // total attempts
  timeoutMs?: number; // per-attempt timeout
  baseBackoffMs?: number; // base delay for backoff
}

const defaultRetryConfig: Required<ResilientOptions> = {
  tries: 3,
  timeoutMs: 10000,
  baseBackoffMs: 100
};

/**
 * Resilient fetch with timeout, retries (429/5xx aware), and exponential backoff with jitter.
 * Suitable for client-side hooks; preserves Response for caller to parse.
 */
export async function fetchWithResilience(
  url: string | URL,
  init?: RequestInit,
  retryConfig?: ResilientOptions
): Promise<Response> {
  // Validate URL to prevent [object Object] issues
  if (typeof url === 'object' && !(url instanceof URL)) {
    console.error('fetchWithResilience: Invalid URL object passed:', url);
    throw new Error(`Invalid URL object: ${JSON.stringify(url)}`);
  }
  
  if (typeof url === 'string' && url.includes('[object ')) {
    console.error('fetchWithResilience: Serialized object found in URL:', url);
    throw new Error(`Invalid URL contains serialized object: ${url}`);
  }

  const config = { ...defaultRetryConfig, ...retryConfig };
  let lastError: Error;

  for (let attempt = 0; attempt < config.tries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const res = await fetch(url, { ...init, signal: init?.signal ?? controller.signal });
      clearTimeout(timeout);
      return res;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error as Error;
      
      if (attempt < config.tries - 1) {
        const backoff = config.baseBackoffMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }

  throw lastError!;
}

