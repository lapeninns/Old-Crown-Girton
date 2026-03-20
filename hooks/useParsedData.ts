"use client";
import { useEffect, useState } from 'react';
import type { ZodSchema } from 'zod';
import { fetchJSON } from '@/lib/dataLoader';

type UseParsedDataOptions = {
  enabled?: boolean;
};

export function useParsedData<T>(path: string, schema: ZodSchema<T>, options: UseParsedDataOptions = {}) {
  const { enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);
    fetchJSON<T>(path)
      .then((d) => {
        const parsed = schema.safeParse(d);
        if (!parsed.success) throw new Error('Invalid schema for ' + path + ': ' + JSON.stringify(parsed.error.flatten()));
        if (alive) setData(parsed.data);
      })
      .catch((e) => { if (alive) setError(e as Error); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [enabled, path, schema]);

  return { data, error, loading };
}
