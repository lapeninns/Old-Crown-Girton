"use client";
import useSWR, { type SWRConfiguration } from 'swr';
import { MarketingSchema, type Marketing } from '../schemas';
import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';

const fetcher = async (url: string): Promise<Marketing> => {
  const res = await fetchWithResilience(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`Failed ${res.status}`);
  const json = await res.json();
  // Handle standardized shape if present
  const data = json?.status === 'success' && json?.data ? json.data : json;
  return MarketingSchema.parse(data);
};

export function useMarketing(endpoint: string = '/api/marketing', options?: SWRConfiguration<Marketing, Error>) {
  const { data, error, isLoading, mutate } = useSWR<Marketing, Error>(endpoint, fetcher, {
    revalidateOnFocus: true,
    shouldRetryOnError: true,
    ...options,
  });
  return { marketing: data, error, isLoading, mutate };
}
