"use client";
import useSWR, { type SWRConfiguration } from 'swr';
import { MenuSchema, type Menu } from '../schemas';

const fetcher = async (url: string): Promise<Menu> => {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`Failed ${res.status}`);
  const json = await res.json();
  return MenuSchema.parse(json);
};

export function useMenu(options?: SWRConfiguration<Menu, Error>) {
  // Default API route; can be overridden by passing a custom key with SWR directly
  const { data, error, isLoading, mutate } = useSWR<Menu, Error>('/api/menu', fetcher, {
    revalidateOnFocus: true,
    shouldRetryOnError: true,
    ...options,
  });
  return { menu: data, error, isLoading, mutate };
}
