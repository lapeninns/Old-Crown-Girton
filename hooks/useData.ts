"use client";
import { useEffect, useState } from 'react';
import { fetchJSON, refetchJSON } from '@/lib/dataLoader';

export function useData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchJSON<T>(path)
      .then((d) => { if (alive) { setData(d); setLastUpdated(Date.now()); } })
      .catch((e) => { if (alive) setError(e as Error); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [path]);

  const refetch = async () => {
    setLoading(true);
    try {
      const d = await refetchJSON<T>(path);
      setData(d);
      setLastUpdated(Date.now());
    } catch (e:any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, refetch, lastUpdated };
}

// Advanced variant with TTL override
export function useSmartData<T>(path: string, ttlMs = 60_000) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchJSON<T>(path, { ttlMs })
      .then((d) => { if (alive) { setData(d); if (!lastUpdated) setLastUpdated(Date.now()); } })
      .catch((e) => { if (alive) setError(e as Error); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [path, ttlMs]);

  const refetch = async (force = false) => {
    setLoading(true);
    try {
      const d = await fetchJSON<T>(path, { force, strategy: 'network-first' });
      setData(d);
      setLastUpdated(Date.now());
    } catch (e:any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const ageMs = lastUpdated ? Date.now() - lastUpdated : null;
  return { data, error, loading, refetch, lastUpdated, ageMs };
}
