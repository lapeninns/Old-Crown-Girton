"use client";
import { useEffect, useState } from 'react';
import type { ZodSchema } from 'zod';
import { fetchJSON } from '@/lib/dataLoader';

export function useParsedData<T>(path: string, schema: ZodSchema<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchJSON<T>(path)
      .then((d) => {
        if (path === 'nav.json') {
          console.log('Nav data loaded:', JSON.stringify(d, null, 2));
        }
        const parsed = schema.safeParse(d);
        if (!parsed.success) throw new Error('Invalid schema for ' + path + ': ' + JSON.stringify(parsed.error.flatten()));
        if (alive) setData(parsed.data);
      })
      .catch((e) => { if (alive) setError(e as Error); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [path, schema]);

  return { data, error, loading };
}
