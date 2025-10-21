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
import { resolveEnv, resolveContentEnvChain, type AppEnv } from "./env";
import { globalCache, createCacheKey, PerformanceCacheManager } from "./cache";
import type { ZodTypeAny } from "zod";

async function readJson<T>(p: string, schema: any, name: string): Promise<T> {
  const raw = await fs.readFile(p, "utf8");
  const parsed = JSON.parse(raw);
  return schema.parse(parsed) as T;
}

async function readJsonRaw(p: string): Promise<any> {
  const raw = await fs.readFile(p, "utf8");
  return JSON.parse(raw);
}

async function readJsonIfExists(p: string): Promise<any | null> {
  try {
    return await readJsonRaw(p);
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

function configPath(file: string) {
  return path.join(process.cwd(), "config", file);
}

function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = cloneValue(val);
    }
    return result as T;
  }
  return value;
}

function mergeContent(base: any, override: any): any {
  if (override === undefined || override === null) {
    return cloneValue(base);
  }
  if (base === undefined || base === null) {
    return cloneValue(override);
  }

  if (Array.isArray(override)) {
    return cloneValue(override);
  }

  if (Array.isArray(base)) {
    return cloneValue(override);
  }

  if (typeof base === 'object' && typeof override === 'object') {
    const result: Record<string, any> = { ...cloneValue(base) };
    for (const key of Object.keys(override)) {
      result[key] = mergeContent((result as any)[key], override[key]);
    }
    return result;
  }

  return cloneValue(override);
}

async function loadContentFromFilesystem(env: AppEnv): Promise<Content> {
  const basePath = configPath("content.json");
  let merged = await readJsonRaw(basePath);

  const envChain = resolveContentEnvChain(env);

  for (const envName of envChain) {
    const overridePath = path.join(process.cwd(), "data", envName, "content.json");
    try {
      const override = await readJsonIfExists(overridePath);
      if (override) {
        merged = mergeContent(merged, override);
      }
    } catch (error) {
      console.warn(`Failed to load content override for ${envName}:`, error);
    }
  }

  return ContentSchema.parse(merged) as Content;
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
  const envChain = resolveContentEnvChain(env);
  const cacheKey = createCacheKey('content', env, { chain: envChain.join('>') });
  
  return globalCache.get(cacheKey, async () => {
    return loadContentFromFilesystem(env);
  }, {
    ttl: getContentCacheTTL(env),
    enableCompression: process.env.NODE_ENV === 'production'
  });
}

// Performance-optimized content loader
export async function getContentDataOptimized(env: AppEnv = resolveEnv()): Promise<Content> {
  const envChain = resolveContentEnvChain(env);
  const cacheKey = createCacheKey('content-optimized', env, { chain: envChain.join('>') });
  
  return globalCache.get(cacheKey, async () => {
    return loadContentFromFilesystem(env);
  }, {
    ttl: getContentCacheTTL(env),
    enableCompression: process.env.NODE_ENV === 'production'
  });
}

// --- Server-side fetch functions (for smart loaders) ---

// Internal server-side fetch function with validation
async function fetchJsonValidatedServer<T>(url: string, schema: ZodTypeAny, init?: any): Promise<T> {
  // Use fetchWithResilience server-side for consistent retry/timeouts
  const { fetchWithResilience } = await import('./fetchWithResilience');
  const res = await fetchWithResilience(url, { ...init, headers: { 'accept': 'application/json', ...(init?.headers || {}) } }, { tries: 2, timeoutMs: 3000, baseBackoffMs: 200 });
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
        
        // Validate baseUrl is a string
        if (cfg.api.baseUrl && typeof cfg.api.baseUrl !== 'string') {
          console.error('Invalid baseUrl type:', typeof cfg.api.baseUrl, cfg.api.baseUrl);
          throw new Error(`Invalid baseUrl type: expected string, got ${typeof cfg.api.baseUrl}`);
        }
        
        url = cfg.api.menuEndpoint || `${cfg.api.baseUrl ?? ''}/api/menu`;
        
        // Final URL validation
        if (url.includes('[object ')) {
          console.error('Invalid URL contains serialized object:', url, 'Config:', cfg.api);
          throw new Error(`Invalid URL contains serialized object: ${url}`);
        }
        
      } catch (error) {
        console.warn('Config loading failed for menu API, using fallback URL:', error);
        // If config lookup fails, fall back to local API path
        url = '/api/menu';
      }
    } else {
      url = '/api/menu';
    }
  }
  
  // Final safety check
  if (typeof url !== 'string' || url.includes('[object ')) {
    console.error('Invalid URL before fetch:', url);
    throw new Error(`Invalid URL: ${url}`);
  }
  
  return fetchJsonValidatedServer<Menu>(url, MenuSchema, { cache: 'no-store' });
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
    
    // Validate baseUrl is a string
    if (cfg.api?.baseUrl && typeof cfg.api.baseUrl !== 'string') {
      console.error('Invalid baseUrl type in marketing loader:', typeof cfg.api.baseUrl, cfg.api.baseUrl);
      throw new Error(`Invalid baseUrl type: expected string, got ${typeof cfg.api.baseUrl}`);
    }
    
    const endpoint = cfg.api?.marketingEndpoint || cfg.api?.baseUrl ? `${cfg.api.baseUrl}/api/marketing` : undefined;
    
    if (cmsOn && endpoint) {
      // Final URL validation
      if (endpoint.includes('[object ')) {
        console.error('Invalid marketing endpoint contains serialized object:', endpoint, 'Config:', cfg.api);
        throw new Error(`Invalid endpoint contains serialized object: ${endpoint}`);
      }
      
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
      
      // Validate baseUrl is a string
      if (cfg.api?.baseUrl && typeof cfg.api.baseUrl !== 'string') {
        console.error('Invalid baseUrl type in content loader:', typeof cfg.api.baseUrl, cfg.api.baseUrl);
        throw new Error(`Invalid baseUrl type: expected string, got ${typeof cfg.api.baseUrl}`);
      }
      
      const endpoint = cfg.api?.contentEndpoint || cfg.api?.baseUrl ? `${cfg.api.baseUrl}/api/content` : undefined;
      
      if (cmsOn && endpoint) {
        // Final URL validation
        if (endpoint.includes('[object ')) {
          console.error('Invalid content endpoint contains serialized object:', endpoint, 'Config:', cfg.api);
          throw new Error(`Invalid endpoint contains serialized object: ${endpoint}`);
        }
        
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
      
      // Validate baseUrl is a string
      if (cfg.api?.baseUrl && typeof cfg.api.baseUrl !== 'string') {
        console.error('Invalid baseUrl type in restaurant loader:', typeof cfg.api.baseUrl, cfg.api.baseUrl);
        throw new Error(`Invalid baseUrl type: expected string, got ${typeof cfg.api.baseUrl}`);
      }
      
      const endpoint = cfg.api?.restaurantEndpoint || cfg.api?.baseUrl ? `${cfg.api.baseUrl}/api/restaurant` : undefined;
      
      if (cmsOn && endpoint) {
        // Final URL validation
        if (endpoint.includes('[object ')) {
          console.error('Invalid restaurant endpoint contains serialized object:', endpoint, 'Config:', cfg.api);
          throw new Error(`Invalid endpoint contains serialized object: ${endpoint}`);
        }
        
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
    ),
    globalCache.preload(
      createCacheKey('restaurant', env),
      () => getRestaurantInfo(env),
      { priority: 'normal' }
    )
  ];
  
  await Promise.allSettled(preloadPromises);
}

/**
 * Health check for modular content system
 */
export async function checkContentSystemHealth(env: AppEnv = resolveEnv()): Promise<{
  status: 'healthy' | 'degraded' | 'error';
  details: Record<string, any>;
}> {
  const results: Record<string, any> = {};
  
  try {
    // Test content loading
    const contentStart = Date.now();
    const content = await getContentSmart(env);
    results.content = {
      status: 'ok',
      loadTime: Date.now() - contentStart,
      hasPages: Object.keys(content.pages || {}).length > 0
    };
  } catch (error) {
    results.content = { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
  }
  
  try {
    // Test cache performance
    const cacheStats = getCacheStats();
    results.cache = {
      status: cacheStats.hitRate > 0.7 ? 'ok' : 'degraded',
      hitRate: cacheStats.hitRate,
      size: cacheStats.cacheSize
    };
  } catch (error) {
    results.cache = { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
  }
  
  try {
    // Test config loading
    const config = await getConfigData(env);
    results.config = {
      status: 'ok',
      cmsEnabled: config.cms?.enabled || false,
      environment: env
    };
  } catch (error) {
    results.config = { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
  }
  
  // Determine overall health
  const errorCount = Object.values(results).filter(r => r.status === 'error').length;
  const degradedCount = Object.values(results).filter(r => r.status === 'degraded').length;
  
  let status: 'healthy' | 'degraded' | 'error';
  if (errorCount > 0) {
    status = 'error';
  } else if (degradedCount > 0) {
    status = 'degraded';
  } else {
    status = 'healthy';
  }
  
  return { status, details: results };
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
