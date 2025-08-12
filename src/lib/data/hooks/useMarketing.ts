"use client";
import useSWR, { type SWRConfiguration } from 'swr';
import { MarketingSchema, type Marketing } from '../schemas';

const fetcher = async (url: string): Promise<Marketing> => {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`Failed ${res.status}`);
  const json = await res.json();
  return MarketingSchema.parse(json);
};

export function useMarketing(endpoint: string = '/api/marketing', options?: SWRConfiguration<Marketing, Error>) {
  const { data, error, isLoading, mutate } = useSWR<Marketing, Error>(endpoint, fetcher, {
    revalidateOnFocus: true,
    shouldRetryOnError: true,
    ...options,
  });
  return { marketing: data, error, isLoading, mutate };
}
