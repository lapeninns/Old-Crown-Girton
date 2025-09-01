/**
 * Client-side loader functions
 * 
 * These functions are safe to use in the browser as they only contain
 * API fetching logic without Node.js file system operations.
 */

import {
  MenuSchema,
  MarketingSchema,
  RestaurantSchema,
  ConfigSchema,
  ContentSchema,
  type Menu,
  type Marketing,
  type Restaurant,
  type AppConfig,
  type Content,
} from "./schemas";
import { globalCache, createCacheKey } from "./cache";
import { resolveEnv, type AppEnv } from "./env";
import type { ZodTypeAny } from "zod";
import { fetchWithResilience } from './fetchWithResilience';

// Client-safe fetch function with validation
async function fetchJsonValidated<T>(url: string, schema: ZodTypeAny, init?: RequestInit): Promise<T> {
  const res = await fetchWithResilience(url, { 
    ...init, 
    headers: { 
      'accept': 'application/json', 
      ...(init?.headers || {}) 
    } 
  });
  
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status} ${res.statusText} for ${url}`);
  }
  
  const json = await res.json();
  return schema.parse(json) as T;
}

/**
 * Client-side content fetcher
 */
export async function fetchContentFromApi(endpoint?: string): Promise<Content> {
  const url = endpoint || '/api/content';
  return fetchJsonValidated<Content>(url, ContentSchema, { cache: 'no-store' });
}

/**
 * Client-side menu fetcher
 */
export async function fetchMenuFromApi(endpoint?: string): Promise<Menu> {
  const url = endpoint || '/api/menu';
  return fetchJsonValidated<Menu>(url, MenuSchema, { cache: 'no-store' });
}

/**
 * Client-side marketing fetcher
 */
export async function fetchMarketingFromApi(endpoint?: string): Promise<Marketing> {
  const url = endpoint || '/api/marketing';
  return fetchJsonValidated<Marketing>(url, MarketingSchema, { cache: 'no-store' });
}

/**
 * Client-side restaurant fetcher
 */
export async function fetchRestaurantFromApi(endpoint?: string): Promise<Restaurant> {
  const url = endpoint || '/api/restaurant';
  return fetchJsonValidated<Restaurant>(url, RestaurantSchema, { cache: 'no-store' });
}

/**
 * Client-side config fetcher
 */
export async function fetchConfigFromApi(endpoint?: string): Promise<AppConfig> {
  const url = endpoint || '/api/config';
  return fetchJsonValidated<AppConfig>(url, ConfigSchema, { cache: 'no-store' });
}

/**
 * Client-side content loader with caching
 */
export async function getContentFromApi(env: AppEnv = resolveEnv()): Promise<Content> {
  const cacheKey = createCacheKey('content-client', env);
  
  return globalCache.get(cacheKey, async () => {
    return fetchContentFromApi();
  }, {
    ttl: getClientCacheTTL(env),
    enableCompression: process.env.NODE_ENV === 'production'
  });
}

/**
 * Client-side menu loader with caching
 */
export async function getMenuFromApi(env: AppEnv = resolveEnv()): Promise<Menu> {
  const cacheKey = createCacheKey('menu-client', env);
  
  return globalCache.get(cacheKey, async () => {
    return fetchMenuFromApi();
  }, {
    ttl: getClientCacheTTL(env),
    enableCompression: true
  });
}

/**
 * Client-side cache TTL strategy
 */
function getClientCacheTTL(env: AppEnv): number {
  // Use consistent caching based on NODE_ENV
  return process.env.NODE_ENV === 'production' ? 5 * 60 * 1000 : 30 * 1000; // 5 minutes in prod, 30 seconds in dev
}

/**
 * Client-side cache utilities
 */
export function getCacheStats() {
  return globalCache.getStats();
}

export function optimizeCache() {
  return globalCache.optimize();
}

export function invalidateCache(pattern?: string | RegExp): number {
  return globalCache.invalidate(pattern);
}