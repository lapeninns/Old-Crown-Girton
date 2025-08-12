"use client";
import useSWR, { type SWRConfiguration } from 'swr';
import { RestaurantSchema, type Restaurant } from '../schemas';

const fetcher = async (url: string): Promise<Restaurant> => {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`Failed ${res.status}`);
  const json = await res.json();
  return RestaurantSchema.parse(json);
};

export function useRestaurant(endpoint: string = '/api/restaurant', options?: SWRConfiguration<Restaurant, Error>) {
  const { data, error, isLoading, mutate } = useSWR<Restaurant, Error>(endpoint, fetcher, {
    revalidateOnFocus: true,
    shouldRetryOnError: true,
    ...options,
  });
  return { restaurant: data, error, isLoading, mutate };
}
