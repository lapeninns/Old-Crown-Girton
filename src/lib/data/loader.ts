import fs from "node:fs/promises";
import path from "node:path";
import {
  MenuSchema,
  MarketingSchema,
  RestaurantSchema,
  ConfigSchema,
  type Menu,
  type Marketing,
  type Restaurant,
  type AppConfig,
} from "./schemas";
import { resolveEnv, type AppEnv } from "./env";
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
        return await fetchMenuFromApi(endpoint, env);
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
  return readJson<AppConfig>(configPath("config.json"), ConfigSchema, "config");
}

// --- REST fetchers (client/server) -------------------------------------------------

async function fetchJsonValidated<T>(url: string, schema: ZodTypeAny, init?: any): Promise<T> {
  const res = await fetch(url, { ...init, headers: { 'accept': 'application/json', ...(init?.headers || {}) } });
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status} ${res.statusText} for ${url}`);
  }
  const json = await res.json();
  return schema.parse(json) as T;
}

/**
 * Fetch menu from a REST endpoint. If no endpoint is provided:
 * - on server, it tries config.api.menuEndpoint
 * - on client, it uses a relative '/api/menu'
 */
export async function fetchMenuFromApi(endpoint?: string, env: AppEnv = resolveEnv()): Promise<Menu> {
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
  return fetchJsonValidated<Menu>(url!, MenuSchema, { cache: 'no-store' });
}

// Placeholder for future endpoints
export async function fetchMarketingFromApi(url: string): Promise<Marketing> {
  return fetchJsonValidated<Marketing>(url, MarketingSchema, { cache: 'no-store' });
}

export async function fetchRestaurantFromApi(url: string): Promise<Restaurant> {
  return fetchJsonValidated<Restaurant>(url, RestaurantSchema, { cache: 'no-store' });
}

export async function fetchConfigFromApi(url: string): Promise<AppConfig> {
  return fetchJsonValidated<AppConfig>(url, ConfigSchema, { cache: 'no-store' });
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
        return await fetchMarketingFromApi(url);
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
 * Smart restaurant loader: prefers API when CMS is enabled and endpoint configured; falls back to fs.
 */
export async function getRestaurantSmart(env: AppEnv = resolveEnv()): Promise<Restaurant> {
  try {
    const cfg = await getConfigData(env);
    const cmsOn = cfg.cms?.enabled || cfg.featureFlags?.["cms"];
    const endpoint = cfg.api?.restaurantEndpoint || cfg.api?.baseUrl ? `${cfg.api.baseUrl}/api/restaurant` : undefined;
    if (cmsOn) {
      try {
        const url = endpoint ?? '/api/restaurant';
        return await fetchRestaurantFromApi(url);
      } catch {
        // fall back
      }
    }
  } catch {
    // ignore and fall back
  }
  return getRestaurantInfo(env);
}
