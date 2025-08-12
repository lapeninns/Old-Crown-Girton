export type Logger = (msg: string, meta?: Record<string, unknown>) => void;

export async function withFallback<T>(fn: () => Promise<T>, fallback: T, logger?: Logger): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (logger) logger("data_load_error", { error: String(err) });
    return fallback;
  }
}
