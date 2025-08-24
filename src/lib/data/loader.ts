// Ensure this module only runs on the server
import 'server-only';

// Server-side only imports - prevent bundling for client
import fs from "fs/promises";
import path from "path";
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
import { resolveEnv, type AppEnv } from "./env";
import { globalCache, createCacheKey, PerformanceCacheManager } from "./cache";
import type { ZodTypeAny } from "zod";

async function readJson<T>(p: string, schema: any, name: string): Promise<T> {
  const raw = await fs.readFile(p, "utf8");
  const parsed = JSON.parse(raw);
  return schema.parse(parsed) as T;
}

function configPath(file: string) {
  return path.join(process.cwd(), "config", file);
}

export async function getMenuData(env: AppEnv = resolveEnv()): Promise<Menu> {
  const cacheKey = createCacheKey('menu', env);
  
  return globalCache.get(cacheKey, async () => {
    return loadMenuFromFileSystem();
  }, {
    ttl: getMenuCacheTTL(env),
    enableCompression: true
  });
}

async function loadMenuFromFileSystem(): Promise<Menu> {
  // Load from modular menu files in /menu directory
  const modularMenuDir = path.join(process.cwd(), "menu");
  
  const categories = [
    { id: "starters", name: "Starters" },
    { id: "mixed_grills", name: "Mixed Grills" },
    { id: "speciality", name: "Speciality Dishes" },
    { id: "authentic_dishes", name: "Authentic Dishes" },
    { id: "naans", name: "Naans" },
    { id: "fries", name: "Fries" },
    { id: "pub_grub", name: "Pub Grub" },
    { id: "rice", name: "Rice" },
    { id: "pub_classics", name: "Pub Classic" },
    { id: "salads", name: "Salads" },
    { id: "sides", name: "Sides" },
    { id: "kids_menu", name: "Kids" },
    { id: "desserts", name: "Desserts" }
  ];
  
  const sections = [];
  for (const cat of categories) {
    const filePath = path.join(modularMenuDir, `${cat.id}.json`);
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const items = JSON.parse(raw);
      
      // Transform items to match expected schema structure
      const transformedItems = items.map((item: any, index: number) => ({
        id: item.id || `${cat.id}-${index + 1}`,
        name: item.name,
        description: item.description || "",
        price: item.price,
        available: item.available !== false,
        dietary: {
          vegetarian: item.labels?.includes("veg") || false,
          glutenFree: item.labels?.includes("GF") || false
        },
        tags: item.labels?.filter((label: string) => !['veg', 'GF'].includes(label)) || []
      }));
      
      sections.push({ 
        id: cat.id, 
        name: cat.name, 
        items: transformedItems 
      });
    } catch (e) {
      console.warn(`Warning: Could not load menu category file ${cat.id}.json:`, e);
      // Continue with other categories
    }
  }
  
  if (sections.length === 0) {
    throw new Error('No menu data could be loaded from /menu directory');
  }
  
  return {
    updatedAt: new Date().toISOString(),
    sections
  };
}

/**
 * Smart loader: if CMS is enabled (or featureFlags.cms is true) and an API endpoint is configured,
 * load menu from the API; otherwise load from filesystem. Falls back to filesystem on errors.
 */
export async function getMenuSmart(env: AppEnv = resolveEnv()): Promise<Menu> {
  try {
    const cfg = await getConfigData(env);
    const cmsOn = cfg.cms?.enabled || cfg.featureFlags?.["cms"];
    const endpoint = cfg.api?.menuEndpoint;
    if (cmsOn && endpoint) {
      try {
        return await fetchMenuFromApiServer(endpoint, env);
      } catch {
        // fall through to fs
      }
    }
  } catch {
    // ignore config errors; fallback to fs
  }
  return getMenuData(env);
}

export async function getRestaurantInfo(env: AppEnv = resolveEnv()): Promise<Restaurant> {
  return readJson<Restaurant>(
    configPath("restaurant.json"),
    RestaurantSchema,
    "restaurant"
  );
}

export async function getMarketingContent(env: AppEnv = resolveEnv()): Promise<Marketing> {
  return readJson<Marketing>(
    configPath("marketing.json"),
    MarketingSchema,
    "marketing"
  );
}

export async function getConfigData(env: AppEnv = resolveEnv()): Promise<AppConfig> {
  const cacheKey = createCacheKey('config', env);
  
  return globalCache.get(cacheKey, async () => {
    // Try environment-specific config first
    const envConfigPath = path.join(process.cwd(), "data", env, "config.json");
    const fallbackPath = configPath("config.json");
    
    try {
      return await readJson<AppConfig>(envConfigPath, ConfigSchema, "config");
    } catch {
      return readJson<AppConfig>(fallbackPath, ConfigSchema, "config");
    }
  }, {
    ttl: getConfigCacheTTL(env)
  });
}

export async function getContentData(env: AppEnv = resolveEnv()): Promise<Content> {
  const cacheKey = createCacheKey('content', env);
  
  return globalCache.get(cacheKey, async () => {
    return readJson<Content>(
      configPath("content.json"),
      ContentSchema,
      "content"
    );
  }, {
    ttl: getContentCacheTTL(env),
    enableCompression: process.env.NODE_ENV === 'production'
  });
}

// Performance-optimized content loader
export async function getContentDataOptimized(env: AppEnv = resolveEnv()): Promise<Content> {
  const cacheKey = createCacheKey('content-optimized', env);
  
  return globalCache.get(cacheKey, async () => {
    // Use main content.json directly
    return readJson<Content>(configPath("content.json"), ContentSchema, "content");
  }, {
    ttl: getContentCacheTTL(env),
    enableCompression: process.env.NODE_ENV === 'production'
  });
}

// --- Server-side fetch functions (for smart loaders) ---

// Internal server-side fetch function with validation
async function fetchJsonValidatedServer<T>(url: string, schema: ZodTypeAny, init?: any): Promise<T> {
  const res = await fetch(url, { ...init, headers: { 'accept': 'application/json', ...(init?.headers || {}) } });
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status} ${res.statusText} for ${url}`);
  }
  const json = await res.json();
  return schema.parse(json) as T;
}

/**
 * Server-side menu fetcher for smart loader
 */
async function fetchMenuFromApiServer(endpoint?: string, env: AppEnv = resolveEnv()): Promise<Menu> {
  let url = endpoint;
  if (!url) {
    if (typeof window === 'undefined') {
      try {
        const cfg = await getConfigData(env);
        url = cfg.api.menuEndpoint || `${cfg.api.baseUrl ?? ''}/api/menu`;
      } catch {
        // If config lookup fails, fall back to local API path
        url = '/api/menu';
      }
    } else {
      url = '/api/menu';
    }
  }
  return fetchJsonValidatedServer<Menu>(url!, MenuSchema, { cache: 'no-store' });
}

// Server-side fetch functions for smart loaders
async function fetchMarketingFromApiServer(url: string): Promise<Marketing> {
  return fetchJsonValidatedServer<Marketing>(url, MarketingSchema, { cache: 'no-store' });
}

async function fetchRestaurantFromApiServer(url: string): Promise<Restaurant> {
  return fetchJsonValidatedServer<Restaurant>(url, RestaurantSchema, { cache: 'no-store' });
}

async function fetchConfigFromApiServer(url: string): Promise<AppConfig> {
  return fetchJsonValidatedServer<AppConfig>(url, ConfigSchema, { cache: 'no-store' });
}

async function fetchContentFromApiServer(url: string): Promise<Content> {
  return fetchJsonValidatedServer<Content>(url, ContentSchema, { cache: 'no-store' });
}

// --- Smart loaders for marketing and restaurant ----------------------------------

/**
 * Smart marketing loader: prefers API when CMS is enabled and endpoint configured; falls back to fs.
 */
export async function getMarketingSmart(env: AppEnv = resolveEnv()): Promise<Marketing> {
  try {
    const cfg = await getConfigData(env);
    const cmsOn = cfg.cms?.enabled || cfg.featureFlags?.["cms"];
    const endpoint = cfg.api?.marketingEndpoint || cfg.api?.baseUrl ? `${cfg.api.baseUrl}/api/marketing` : undefined;
    if (cmsOn) {
      try {
        const url = endpoint ?? '/api/marketing';
        return await fetchMarketingFromApiServer(url);
      } catch {
        // fall back
      }
    }
  } catch {
    // ignore and fall back
  }
  return getMarketingContent(env);
}

/**
 * Smart content loader: prefers API when CMS is enabled and endpoint configured; falls back to fs.
 * Enhanced with performance caching and intelligent fallback strategies.
 */
export async function getContentSmart(env: AppEnv = resolveEnv()): Promise<Content> {
  const cacheKey = createCacheKey('content-smart', env);
  
  return globalCache.get(cacheKey, async () => {
    try {
      const cfg = await getConfigData(env);
      const cmsOn = cfg.cms?.enabled || cfg.featureFlags?.["cms"];
      const endpoint = cfg.api?.contentEndpoint || cfg.api?.baseUrl ? `${cfg.api.baseUrl}/api/content` : undefined;
      
      if (cmsOn && endpoint) {
        try {
          // Try API first
          const apiContent = await fetchContentFromApiServer(endpoint);
          
          // Preload fallback in background for better resilience
          globalCache.preload(
            createCacheKey('content-fallback', env),
            () => getContentDataOptimized(env),
            { priority: 'low' }
          );
          
          return apiContent;
        } catch (apiError) {
          console.warn('API content loading failed, falling back to filesystem:', apiError);
          // fall through to fs
        }
      }
    } catch (configError) {
      console.warn('Config loading failed, using filesystem content:', configError);
      // ignore config errors; fallback to fs
    }
    
    return getContentDataOptimized(env);
  }, {
    ttl: getContentCacheTTL(env),
    enableCompression: process.env.NODE_ENV === 'production'
  });
}

/**
 * Smart restaurant loader: prefers API when CMS is enabled and endpoint configured; falls back to fs.
 */
export async function getRestaurantSmart(env: AppEnv = resolveEnv()): Promise<Restaurant> {
  const cacheKey = createCacheKey('restaurant-smart', env);
  
  return globalCache.get(cacheKey, async () => {
    try {
      const cfg = await getConfigData(env);
      const cmsOn = cfg.cms?.enabled || cfg.featureFlags?.["cms"];
      const endpoint = cfg.api?.restaurantEndpoint || cfg.api?.baseUrl ? `${cfg.api.baseUrl}/api/restaurant` : undefined;
      if (cmsOn) {
        try {
          const url = endpoint ?? '/api/restaurant';
          return await fetchRestaurantFromApiServer(url);
        } catch {
          // fall back
        }
      }
    } catch {
      // ignore and fall back
    }
    return getRestaurantInfo(env);
  }, {
    ttl: getRestaurantCacheTTL(env)
  });
}

// --- Performance Helper Functions ---

/**
 * Get cache TTL for content
 */
function getContentCacheTTL(env: AppEnv): number {
  return process.env.NODE_ENV === 'production' ? 60 * 60 * 1000 : 60 * 1000; // 1 hour in prod, 1 minute in dev
}

/**
 * Get cache TTL for menu
 */
function getMenuCacheTTL(env: AppEnv): number {
  return process.env.NODE_ENV === 'production' ? 2 * 60 * 60 * 1000 : 30 * 1000; // 2 hours in prod, 30 seconds in dev
}

/**
 * Get cache TTL for config
 */
function getConfigCacheTTL(env: AppEnv): number {
  return process.env.NODE_ENV === 'production' ? 30 * 60 * 1000 : 30 * 1000; // 30 minutes in prod, 30 seconds in dev
}

/**
 * Get cache TTL for restaurant info
 */
function getRestaurantCacheTTL(env: AppEnv): number {
  return process.env.NODE_ENV === 'production' ? 4 * 60 * 60 * 1000 : 2 * 60 * 1000; // 4 hours in prod, 2 minutes in dev
}

/**
 * Preload critical content for better performance
 */
export async function preloadCriticalContent(env: AppEnv = resolveEnv()): Promise<void> {
  const preloadPromises = [
    globalCache.preload(
      createCacheKey('content', env),
      () => getContentDataOptimized(env),
      { priority: 'high' }
    ),
    globalCache.preload(
      createCacheKey('config', env),
      () => getConfigData(env),
      { priority: 'high' }
    ),
    globalCache.preload(
      createCacheKey('menu', env),
      () => getMenuData(env),
      { priority: 'normal' }
    )
  ];
  
  await Promise.allSettled(preloadPromises);
}

/**
 * Get cache performance statistics
 */
// --- Client-safe re-exports ---
// Re-export client-safe functions from client-loader
export {
  fetchContentFromApi,
  fetchMenuFromApi, 
  fetchMarketingFromApi,
  fetchRestaurantFromApi,
  fetchConfigFromApi,
  getContentFromApi,
  getMenuFromApi
} from './client-loader';

// Cache utilities (client-safe)
export function getCacheStats() {
  if (typeof window !== 'undefined') {
    // Client-side: use client loader
    const { getCacheStats: clientGetCacheStats } = require('./client-loader');
    return clientGetCacheStats();
  }
  return globalCache.getStats();
}

export function optimizeCache() {
  if (typeof window !== 'undefined') {
    // Client-side: use client loader
    const { optimizeCache: clientOptimizeCache } = require('./client-loader');
    return clientOptimizeCache();
  }
  return globalCache.optimize();
}

export function invalidateCache(pattern?: string | RegExp): number {
  if (typeof window !== 'undefined') {
    // Client-side: use client loader
    const { invalidateCache: clientInvalidateCache } = require('./client-loader');
    return clientInvalidateCache(pattern);
  }
  return globalCache.invalidate(pattern);
}
