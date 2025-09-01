"use client";

import useSWR, { type SWRConfiguration } from 'swr';
import { useCallback, useMemo } from 'react';

// Types for modular content system
export interface ContentModule {
  id: string;
  data: Record<string, any>;
  loadedAt: number;
  source: 'cache' | 'network';
}

export interface ContentManifest {
  version: string;
  modules: Record<string, ModuleConfig>;
  composition: CompositionConfig;
  environments: Record<string, EnvironmentConfig>;
  performance: PerformanceConfig;
}

export interface ModuleConfig {
  priority: number;
  loadStrategy: 'always' | 'lazy' | 'conditional';
  cacheDuration: number;
  files: string[];
  dependencies: string[];
  condition?: string;
  size: 'small' | 'medium' | 'large';
}

export interface CompositionConfig {
  strategy: 'deep-merge' | 'shallow-merge' | 'override';
  conflictResolution: 'environment-wins' | 'module-wins' | 'timestamp-wins';
  fallbackStrategy: 'base-module' | 'empty' | 'error';
  mergeArrays: 'concat' | 'replace' | 'merge';
  preserveRootKeys: boolean;
}

export interface EnvironmentConfig {
  inherits: string;
  overrides: string[];
  debug: boolean;
  additionalModules?: string[];
  excludeModules?: string[];
}

export interface PerformanceConfig {
  preloadModules: string[];
  criticalModules: string[];
  bundleModules: string[];
  maxConcurrentLoads: number;
  enableCompression: boolean;
  enableCDN: boolean;
}

export interface UseModularContentResult {
  data: Record<string, any> | null;
  modules: Record<string, ContentModule>;
  manifest: ContentManifest | null;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  loadModule: (moduleId: string) => Promise<ContentModule>;
  unloadModule: (moduleId: string) => void;
  refetch: () => Promise<void>;
  performance: {
    loadTimes: Record<string, number>;
    cacheHits: number;
    cacheMisses: number;
  };
}

export interface UseModularContentOptions extends SWRConfiguration {
  enabled?: boolean;
  environment?: 'dev' | 'staging' | 'prod';
  modules?: string[];
  preload?: string[];
  enablePerformanceTracking?: boolean;
}

// Content fetchers
import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';

const manifestFetcher = async (): Promise<ContentManifest> => {
  const response = await fetchWithResilience('/api/content/manifest', {
    headers: { 'Accept': 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Manifest fetch failed: ${response.status}`);
  }

  return response.json();
};

const moduleFetcher = async (moduleId: string): Promise<ContentModule> => {
  const startTime = performance.now();
  
  const response = await fetchWithResilience(`/api/content/modules/${moduleId}`, {
    headers: { 'Accept': 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Module ${moduleId} fetch failed: ${response.status}`);
  }

  const data = await response.json();
  const loadTime = performance.now() - startTime;
  
  return {
    id: moduleId,
    data,
    loadedAt: Date.now(),
    source: response.headers.get('x-cache-status') === 'hit' ? 'cache' : 'network'
  };
};

// Deep merge utility for content composition
const deepMerge = (target: any, source: any, config: CompositionConfig): any => {
  if (source === null || source === undefined) return target;
  if (target === null || target === undefined) return source;
  
  if (Array.isArray(source)) {
    if (config.mergeArrays === 'concat' && Array.isArray(target)) {
      return [...target, ...source];
    } else if (config.mergeArrays === 'replace') {
      return source;
    }
    return source;
  }
  
  if (typeof source === 'object' && typeof target === 'object') {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (config.preserveRootKeys && result.hasOwnProperty(key)) {
          result[key] = deepMerge(result[key], source[key], config);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }
  
  return source;
};

/**
 * Hook for managing modular content with advanced composition and performance features
 */
export function useModularContent(options: UseModularContentOptions = {}): UseModularContentResult {
  const {
    enabled = true,
    environment = 'dev',
    modules = [],
    preload = [],
    enablePerformanceTracking = true,
    ...swrOptions
  } = options;

  // Load manifest
  const { data: manifest, error: manifestError } = useSWR<ContentManifest, Error>(
    enabled ? 'content-manifest' : null,
    manifestFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hour
      ...swrOptions,
    }
  );

  // Performance tracking state
  const performanceState = useMemo(() => ({
    loadTimes: {} as Record<string, number>,
    cacheHits: 0,
    cacheMisses: 0,
  }), []);

  // Determine modules to load based on manifest and options
  const modulesToLoad = useMemo(() => {
    if (!manifest) return [];
    
    const envConfig = manifest.environments[environment];
    const coreModules = Object.entries(manifest.modules)
      .filter(([_, config]) => config.loadStrategy === 'always')
      .map(([id]) => id);
    
    const requestedModules = modules.length > 0 ? modules : [];
    const preloadModules = preload.length > 0 ? preload : manifest.performance.preloadModules;
    
    const allModules = new Set([...coreModules, ...requestedModules, ...preloadModules]);
    
    // Apply environment exclusions
    if (envConfig?.excludeModules) {
      envConfig.excludeModules.forEach(pattern => {
        if (pattern.includes('*')) {
          const prefix = pattern.replace('*', '');
          Array.from(allModules).forEach(moduleId => {
            if (moduleId.startsWith(prefix)) {
              allModules.delete(moduleId);
            }
          });
        } else {
          allModules.delete(pattern);
        }
      });
    }
    
    return Array.from(allModules);
  }, [manifest, environment, modules, preload]);

  // Load individual modules
  const { data: moduleData, error: moduleError, mutate } = useSWR<Record<string, ContentModule>, Error>(
    enabled && manifest ? ['content-modules', modulesToLoad] : null,
    async () => {
      const results: Record<string, ContentModule> = {};
      const loadPromises = modulesToLoad.map(async (moduleId) => {
        try {
          const module = await moduleFetcher(moduleId);
          
          if (enablePerformanceTracking) {
            performanceState.loadTimes[moduleId] = Date.now() - module.loadedAt;
            if (module.source === 'cache') {
              performanceState.cacheHits++;
            } else {
              performanceState.cacheMisses++;
            }
          }
          
          results[moduleId] = module;
        } catch (error) {
          console.warn(`Failed to load module ${moduleId}:`, error);
        }
      });
      
      await Promise.all(loadPromises);
      return results;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      ...swrOptions,
    }
  );

  // Compose final content from loaded modules
  const composedContent = useMemo(() => {
    if (!manifest || !moduleData) return null;
    
    const { composition } = manifest;
    let result = {};
    
    // Sort modules by priority
    const sortedModules = Object.entries(moduleData).sort(([aId], [bId]) => {
      const aPriority = manifest.modules[aId]?.priority || 999;
      const bPriority = manifest.modules[bId]?.priority || 999;
      return aPriority - bPriority;
    });
    
    // Merge modules according to composition strategy
    for (const [moduleId, module] of sortedModules) {
      result = deepMerge(result, module.data, composition);
    }
    
    return result;
  }, [manifest, moduleData]);

  // Load specific module on demand
  const loadModule = useCallback(async (moduleId: string): Promise<ContentModule> => {
    try {
      const module = await moduleFetcher(moduleId);
      
      // Update the module data
      await mutate(prev => ({
        ...prev,
        [moduleId]: module
      }));
      
      return module;
    } catch (error) {
      throw new Error(`Failed to load module ${moduleId}: ${error}`);
    }
  }, [mutate]);

  // Unload specific module
  const unloadModule = useCallback((moduleId: string) => {
    mutate(prev => {
      if (!prev) return prev;
      const { [moduleId]: removed, ...rest } = prev;
      return rest;
    });
  }, [mutate]);

  // Refetch all modules
  const refetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const error = manifestError || moduleError;
  const isLoading = !manifest || (!moduleData && !error);
  const isValidating = false; // SWR handles this internally

  return {
    data: composedContent,
    modules: moduleData || {},
    manifest,
    error,
    isLoading,
    isValidating,
    loadModule,
    unloadModule,
    refetch,
    performance: performanceState,
  };
}

// Specialized hooks for specific content sections
export function usePageContent(pageName: string, options?: UseModularContentOptions) {
  const result = useModularContent({
    modules: [`pages/${pageName}`],
    ...options,
  });
  
  return {
    ...result,
    pageData: result.data?.pages?.[pageName] || result.data?.[pageName] || null,
  };
}

export function useComponentContent(componentName: string, options?: UseModularContentOptions) {
  const result = useModularContent({
    modules: [`components/${componentName}`],
    ...options,
  });
  
  return {
    ...result,
    componentData: result.data?.components?.[componentName] || result.data?.[componentName] || null,
  };
}

export function useGlobalContent(options?: UseModularContentOptions) {
  const result = useModularContent({
    modules: ['core/global', 'core/ui', 'core/accessibility'],
    ...options,
  });
  
  return {
    ...result,
    globalData: result.data?.global || null,
    uiData: result.data?.ui || null,
    accessibilityData: result.data?.accessibility || null,
  };
}