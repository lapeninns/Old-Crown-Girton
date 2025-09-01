"use client";

import useSWR, { type SWRConfiguration } from 'swr';
import { ConfigSchema, type AppConfig } from '@/src/lib/data/schemas';
import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';

// Standardized hook result interface
export interface UseConfigResult {
  data: AppConfig | null;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  refetch: () => Promise<void>;
  mutate: (data?: AppConfig | Promise<AppConfig>, shouldRevalidate?: boolean) => Promise<AppConfig | undefined>;
  // Config-specific helpers
  environment: string;
  isCmsEnabled: boolean;
  featureFlags: Record<string, boolean>;
  apiEndpoints: Record<string, string>;
}

// Hook options interface
export interface UseConfigOptions extends SWRConfiguration<AppConfig, Error> {
  enabled?: boolean;
  refreshInterval?: number;
  cacheTimeout?: number;
}

// Standardized fetcher
const configFetcher = async (url: string): Promise<AppConfig> => {
  const response = await fetchWithResilience(url, {
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Config fetch failed: ${response.status} ${response.statusText}`);
  }
  
  const json = await response.json();
  
  // Handle both standardized API response and direct data
  const data = json.status === 'success' ? json.data : json;
  
  // Validate with schema
  const result = ConfigSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Config validation failed: ${JSON.stringify(result.error.flatten())}`);
  }
  
  return result.data;
};

/**
 * Hook for fetching and managing application configuration
 * 
 * @param options - Configuration options for the hook
 * @returns Config data, loading state, error state, and config-specific helpers
 * 
 * @example
 * ```tsx
 * const { data: config, isLoading, isCmsEnabled, featureFlags } = useConfig({
 *   enabled: true,
 *   refreshInterval: 1800000 // 30 minutes
 * });
 * ```
 */
export function useConfig(options: UseConfigOptions = {}): UseConfigResult {
  const {
    enabled = true,
    refreshInterval = 1800000, // 30 minutes default (config changes rarely)
    cacheTimeout = 3600000,   // 1 hour cache
    ...swrOptions
  } = options;

  const { data, error, isLoading, isValidating, mutate } = useSWR<AppConfig, Error>(
    enabled ? '/api/config' : null,
    configFetcher,
    {
      revalidateOnFocus: false, // Config rarely changes, don't revalidate on focus
      revalidateOnReconnect: true,
      refreshInterval,
      dedupingInterval: cacheTimeout / 2,
      shouldRetryOnError: (error) => {
        // Don't retry on 4xx errors (client errors)
        if (error.message.includes('4')) {
          return false;
        }
        return true;
      },
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      keepPreviousData: true,
      ...swrOptions,
    }
  );

  const refetch = async (): Promise<void> => {
    await mutate();
  };

  // Config-specific computed values
  const environment = data?.env || 'dev';
  const isCmsEnabled = !!(data?.cms?.enabled || data?.featureFlags?.cms);
  const featureFlags = data?.featureFlags || {};
  const apiEndpoints = data?.api || {};

  return {
    data: data || null,
    error,
    isLoading,
    isValidating,
    refetch,
    mutate,
    environment,
    isCmsEnabled,
    featureFlags,
    apiEndpoints,
  };
}

// Specialized hook for feature flags
export function useFeatureFlags(): UseConfigResult & { flags: Record<string, boolean> } {
  const result = useConfig();
  
  return {
    ...result,
    flags: result.featureFlags,
  };
}

// Hook for checking specific feature flag
export function useFeatureFlag(flagName: string): UseConfigResult & { isEnabled: boolean } {
  const result = useConfig();
  
  const isEnabled = result.featureFlags[flagName] === true;
  
  return {
    ...result,
    isEnabled,
  };
}

// Hook for environment information
export function useEnvironment(): UseConfigResult & { env: string; isDev: boolean; isProd: boolean } {
  const result = useConfig();
  
  const env = result.environment;
  const isDev = env === 'dev' || env === 'development';
  const isProd = env === 'prod' || env === 'production';
  
  return {
    ...result,
    env,
    isDev,
    isProd,
  };
}