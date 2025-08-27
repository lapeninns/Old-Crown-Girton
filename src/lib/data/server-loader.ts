// Ensure this module only runs on the server
import 'server-only';

// Server-side only imports
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
import { globalCache, createCacheKey } from "./cache";
import type { ZodTypeAny } from "zod";

// Server-side file reading function
async function readJson<T>(p: string, schema: any, name: string): Promise<T> {
  const raw = await fs.readFile(p, "utf8");
  const parsed = JSON.parse(raw);
  return schema.parse(parsed) as T;
}

function configPath(file: string) {
  return path.join(process.cwd(), "config", file);
}

// Server-side data loading functions
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

export async function getConfigData(env: AppEnv = resolveEnv()): Promise<AppConfig> {
  const cacheKey = createCacheKey('config', env);
  
  return globalCache.get(cacheKey, async () => {
    // Use main config.json directly
    return readJson<AppConfig>(configPath("config.json"), ConfigSchema, "config");
  }, {
    ttl: getConfigCacheTTL(env)
  });
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

// Smart loaders with API fallback
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
          const response = await fetch(endpoint, { 
            cache: 'no-store',
            signal: AbortSignal.timeout(3000) // 3 second timeout
          });
          if (response.ok) {
            const content = await response.json();
            return ContentSchema.parse(content);
          }
        } catch (apiError) {
          console.warn('API content loading failed, falling back to filesystem:', apiError);
        }
      }
    } catch (configError) {
      console.warn('Config loading failed, using filesystem content:', configError);
    }
    
    return getContentDataOptimized(env);
  }, {
    ttl: getContentCacheTTL(env),
    enableCompression: process.env.NODE_ENV === 'production'
  });
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

export async function getMenuDataOptimized(priorityCategory?: string, env: AppEnv = resolveEnv()): Promise<Menu> {
  const cacheKey = createCacheKey(`menu-optimized-${priorityCategory || 'all'}`, env);
  
  return globalCache.get(cacheKey, async () => {
    return loadMenuFromFileSystemOptimized(priorityCategory);
  }, {
    ttl: getMenuCacheTTL(env),
    enableCompression: true
  });
}

async function loadMenuFromFileSystemOptimized(priorityCategory?: string): Promise<Menu> {
  // Load from modular menu files in /menu directory with optimized concurrent loading
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
  
  // Prioritize loading order - priority category first
  const orderedCategories = priorityCategory
    ? [
        ...categories.filter(cat => cat.id === priorityCategory),
        ...categories.filter(cat => cat.id !== priorityCategory)
      ]
    : categories;
  
  // Load categories concurrently with Promise.allSettled for better error handling
  const categoryPromises = orderedCategories.map(async (cat) => {
    const filePath = path.join(modularMenuDir, `${cat.id}.json`);
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const items = JSON.parse(raw);
      
      // Transform items to match expected schema structure with optimizations
      const transformedItems = items.map((item: any, index: number) => {
        const dietary = {
          vegetarian: item.labels?.includes("veg") || false,
          glutenFree: item.labels?.includes("GF") || false
        };
        
        return {
          id: item.id || `${cat.id}-${index + 1}`,
          name: item.name,
          description: item.description || "",
          price: item.price,
          available: item.available !== false,
          dietary,
          tags: item.labels?.filter((label: string) => !['veg', 'GF'].includes(label)) || [],
          // Pre-compute search terms for faster client-side filtering
          searchTerms: `${item.name} ${item.description || ''} ${item.labels?.join(' ') || ''}`.toLowerCase()
        };
      });
      
      return { 
        id: cat.id, 
        name: cat.name, 
        items: transformedItems,
        // Pre-compute section metadata
        itemCount: transformedItems.length,
        hasVegetarian: transformedItems.some((item: any) => item.dietary.vegetarian),
        hasGlutenFree: transformedItems.some((item: any) => item.dietary.glutenFree),
        priceRange: transformedItems.length > 0 ? {
          min: Math.min(...transformedItems.map((item: any) => item.price?.amount || 0)),
          max: Math.max(...transformedItems.map((item: any) => item.price?.amount || 0))
        } : null
      };
    } catch (e) {
      console.warn(`Warning: Could not load menu category file ${cat.id}.json:`, e);
      return null;
    }
  });
  
  const results = await Promise.allSettled(categoryPromises);
  const sections = results
    .filter((result): result is PromiseFulfilledResult<any> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value);
  
  if (sections.length === 0) {
    throw new Error('No menu data could be loaded from /menu directory');
  }
  
  return {
    updatedAt: new Date().toISOString(),
    sections
  };
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

export async function getMenuSmart(priorityCategory?: string, env: AppEnv = resolveEnv()): Promise<Menu> {
  try {
    const cfg = await getConfigData(env);
    const cmsOn = cfg.cms?.enabled || cfg.featureFlags?.["cms"];
    const endpoint = cfg.api?.menuEndpoint;
    if (cmsOn && endpoint) {
      try {
        const response = await fetch(endpoint, { 
          cache: 'no-store',
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        if (response.ok) {
          const menu = await response.json();
          return MenuSchema.parse(menu);
        }
      } catch {
        // fall through to fs
      }
    }
  } catch {
    // ignore config errors; fallback to fs
  }
  
  // Use optimized loader if priority category is specified
  return priorityCategory 
    ? getMenuDataOptimized(priorityCategory, env)
    : getMenuData(env);
}

export async function getMarketingSmart(env: AppEnv = resolveEnv()): Promise<Marketing> {
  try {
    const cfg = await getConfigData(env);
    const cmsOn = cfg.cms?.enabled || cfg.featureFlags?.["cms"];
    const endpoint = cfg.api?.marketingEndpoint || cfg.api?.baseUrl ? `${cfg.api.baseUrl}/api/marketing` : undefined;
    if (cmsOn) {
      try {
        const url = endpoint ?? '/api/marketing';
        const response = await fetch(url, { 
          cache: 'no-store',
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        if (response.ok) {
          const marketing = await response.json();
          return MarketingSchema.parse(marketing);
        }
      } catch {
        // fall back
      }
    }
  } catch {
    // ignore and fall back
  }
  return getMarketingContent(env);
}

export async function getRestaurantSmart(env: AppEnv = resolveEnv()): Promise<Restaurant> {
  try {
    const cfg = await getConfigData(env);
    const cmsOn = cfg.cms?.enabled || cfg.featureFlags?.["cms"];
    const endpoint = cfg.api?.restaurantEndpoint || cfg.api?.baseUrl ? `${cfg.api.baseUrl}/api/restaurant` : undefined;
    if (cmsOn) {
      try {
        const url = endpoint ?? '/api/restaurant';
        const response = await fetch(url, { 
          cache: 'no-store',
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        if (response.ok) {
          const restaurant = await response.json();
          return RestaurantSchema.parse(restaurant);
        }
      } catch {
        // fall back
      }
    }
  } catch {
    // ignore and fall back
  }
  return getRestaurantInfo(env);
}

export async function preloadCriticalContent(env: AppEnv = resolveEnv()): Promise<void> {
  const preloadPromises = [
    globalCache.preload(
      createCacheKey('content', env),
      () => getContentDataOptimized(env)
    ),
    globalCache.preload(
      createCacheKey('config', env),
      () => getConfigData(env)
    ),
    globalCache.preload(
      createCacheKey('menu-optimized-starters', env),
      () => getMenuDataOptimized('starters', env)
    ),
    globalCache.preload(
      createCacheKey('menu', env),
      () => getMenuData(env)
    )
  ];
  
  await Promise.allSettled(preloadPromises);
}

export function getCacheStats() {
  return globalCache.getStats();
}

export function optimizeCache() {
  return globalCache.optimize();
}

export function invalidateCache(pattern?: string | RegExp): number {
  return globalCache.invalidate(pattern);
}

function getContentCacheTTL(env: AppEnv): number {
  // Use production-optimized caching for single environment
  return process.env.NODE_ENV === 'production' ? 60 * 60 * 1000 : 60 * 1000; // 1 hour in prod, 1 minute in dev
}

function getConfigCacheTTL(env: AppEnv): number {
  // Use production-optimized caching for single environment
  return process.env.NODE_ENV === 'production' ? 30 * 60 * 1000 : 30 * 1000; // 30 minutes in prod, 30 seconds in dev
}

function getMenuCacheTTL(env: AppEnv): number {
  // Use production-optimized caching for single environment
  return process.env.NODE_ENV === 'production' ? 2 * 60 * 60 * 1000 : 30 * 1000; // 2 hours in prod, 30 seconds in dev
}

function getRestaurantCacheTTL(env: AppEnv): number {
  // Use production-optimized caching for single environment
  return process.env.NODE_ENV === 'production' ? 4 * 60 * 60 * 1000 : 2 * 60 * 1000; // 4 hours in prod, 2 minutes in dev
}
