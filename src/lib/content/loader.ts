/**
 * Content Loader Service
 * 
 * Orchestrates the loading, composition, and caching of modular content.
 * Provides a high-level interface for the modular content system.
 */

import { composeContent, composePageContent, type CompositionConfig, type CompositionResult } from './composition';

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

export interface LoadedModule {
  id: string;
  data: any;
  metadata: {
    loadedAt: number;
    source: 'cache' | 'network' | 'fallback';
    loadTime: number;
    size: number;
    dependencies: string[];
  };
}

export interface ContentLoadResult {
  content: any;
  composition: CompositionResult;
  modules: Record<string, LoadedModule>;
  performance: {
    totalLoadTime: number;
    cacheHits: number;
    cacheMisses: number;
    modulesLoaded: number;
  };
}

/**
 * Content Loader Class
 */
export class ContentLoader {
  private manifest: ContentManifest | null = null;
  private moduleCache = new Map<string, LoadedModule>();
  private loadingPromises = new Map<string, Promise<LoadedModule>>();
  private environment: string;
  private baseUrl: string;
  
  constructor(
    environment: string = 'dev',
    baseUrl: string = '/api/content'
  ) {
    this.environment = environment;
    this.baseUrl = baseUrl;
  }
  
  /**
   * Initialize the loader by fetching the manifest
   */
  async initialize(): Promise<void> {
    try {
      const { fetchWithResilience } = await import('../data/fetchWithResilience');
      const response = await fetchWithResilience(`${this.baseUrl}/manifest?env=${this.environment}`, {
        headers: {
          'x-environment': this.environment,
        },
      }, { tries: 2, timeoutMs: 5000 });

      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.status}`);
      }

      this.manifest = await response.json();
    } catch (error) {
      console.error('Failed to initialize content loader:', error);
      throw error;
    }
  }
  
  /**
   * Load content for a specific page
   */
  async loadPageContent(pageName: string): Promise<ContentLoadResult> {
    if (!this.manifest) {
      throw new Error('Content loader not initialized');
    }
    
    const startTime = performance.now();
    const requiredModules = this.getRequiredModules(`pages/${pageName}`);
    
    // Load all required modules
    const modules = await this.loadModules(requiredModules);
    
    // Compose the final content
    const composition = this.composeModules(modules);
    
    const totalLoadTime = performance.now() - startTime;
    
    return {
      content: composition.data,
      composition,
      modules,
      performance: {
        totalLoadTime,
        cacheHits: Object.values(modules).filter(m => m.metadata.source === 'cache').length,
        cacheMisses: Object.values(modules).filter(m => m.metadata.source === 'network').length,
        modulesLoaded: Object.keys(modules).length,
      },
    };
  }

  /**
   * Load content for a specific component
   */
  async loadComponentContent(componentName: string): Promise<ContentLoadResult> {
    if (!this.manifest) {
      throw new Error('Content loader not initialized');
    }
    
    const startTime = performance.now();
    const requiredModules = this.getRequiredModules(`components/${componentName}`);

    const modules = await this.loadModules(requiredModules);
    const composition = this.composeModules(modules);

    const totalLoadTime = performance.now() - startTime;

    return {
      content: composition.data,
      composition,
      modules,
      performance: {
        totalLoadTime,
        cacheHits: Object.values(modules).filter(m => m.metadata.source === 'cache').length,
        cacheMisses: Object.values(modules).filter(m => m.metadata.source === 'network').length,
        modulesLoaded: Object.keys(modules).length,
      },
    };
  }

  /**
   * Load all core content
   */
  async loadCoreContent(): Promise<ContentLoadResult> {
    if (!this.manifest) {
      throw new Error('Content loader not initialized');
    }
    
    const startTime = performance.now();
    const coreModules = Object.keys(this.manifest.modules)
      .filter(moduleId => this.manifest!.modules[moduleId].loadStrategy === 'always');

    const modules = await this.loadModules(coreModules);
    const composition = this.composeModules(modules);

    const totalLoadTime = performance.now() - startTime;

    return {
      content: composition.data,
      composition,
      modules,
      performance: {
        totalLoadTime,
        cacheHits: Object.values(modules).filter(m => m.metadata.source === 'cache').length,
        cacheMisses: Object.values(modules).filter(m => m.metadata.source === 'network').length,
        modulesLoaded: Object.keys(modules).length,
      },
    };
  }

  /**
   * Preload specified modules
   */
  async preloadModules(moduleIds: string[]): Promise<void> {
    const preloadPromises = moduleIds.map(moduleId => this.loadModule(moduleId));
    await Promise.allSettled(preloadPromises);
  }

  /**
   * Clear cache for specific modules or all modules
   */
  clearCache(moduleIds?: string[]): void {
    if (moduleIds) {
      moduleIds.forEach(moduleId => this.moduleCache.delete(moduleId));
    } else {
      this.moduleCache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    totalModules: number;
    cachedModules: number;
    cacheSize: number;
    hitRate: number;
  } {
    const totalModules = this.manifest ? Object.keys(this.manifest.modules).length : 0;
    const cachedModules = this.moduleCache.size;
    const cacheSize = Array.from(this.moduleCache.values())
      .reduce((total, module) => total + module.metadata.size, 0);

    const hitRate = totalModules > 0 ? (cachedModules / totalModules) * 100 : 0;

    return {
      totalModules,
      cachedModules,
      cacheSize,
      hitRate,
    };
  }

  /**
   * Private methods
   */

  private getRequiredModules(primaryModule: string): string[] {
    if (!this.manifest) return [];

    const modules = new Set<string>();
    const toProcess = [primaryModule];

    // Always include core modules
    Object.keys(this.manifest.modules)
      .filter(moduleId => this.manifest!.modules[moduleId].loadStrategy === 'always')
      .forEach(moduleId => modules.add(moduleId));

    // Process dependencies recursively
    while (toProcess.length > 0) {
      const currentModule = toProcess.pop()!;
      
      if (modules.has(currentModule)) continue;

      const moduleConfig = this.manifest.modules[currentModule];
      if (!moduleConfig) continue;

      modules.add(currentModule);

      // Add dependencies
      if (moduleConfig.dependencies) {
        toProcess.push(...moduleConfig.dependencies);
      }
    }

    return Array.from(modules);
  }

  private async loadModules(moduleIds: string[]): Promise<Record<string, LoadedModule>> {
    if (!this.manifest) throw new Error('Manifest not loaded');

    const maxConcurrent = this.manifest.performance.maxConcurrentLoads;
    const modules: Record<string, LoadedModule> = {};

    // Load modules in batches to respect concurrency limits
    for (let i = 0; i < moduleIds.length; i += maxConcurrent) {
      const batch = moduleIds.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(moduleId => this.loadModule(moduleId));
      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          modules[batch[index]] = result.value;
        } else {
          console.warn(`Failed to load module ${batch[index]}:`, result.reason);
        }
      });
    }

    return modules;
  }

  private async loadModule(moduleId: string): Promise<LoadedModule> {
    // Check cache first
    const cached = this.moduleCache.get(moduleId);
    if (cached && !this.isCacheExpired(cached, moduleId)) {
      return cached;
    }

    // Check if already loading
    const existing = this.loadingPromises.get(moduleId);
    if (existing) {
      return existing;
    }

    // Load the module
    const loadPromise = this.fetchModule(moduleId);
    this.loadingPromises.set(moduleId, loadPromise);

    try {
      const module = await loadPromise;
      this.moduleCache.set(moduleId, module);
      return module;
    } finally {
      this.loadingPromises.delete(moduleId);
    }
  }

  private async fetchModule(moduleId: string): Promise<LoadedModule> {
    const startTime = performance.now();

    try {
      const { fetchWithResilience } = await import('../data/fetchWithResilience');
      const response = await fetchWithResilience(`${this.baseUrl}/modules/${moduleId}?env=${this.environment}`, {
        headers: {
          'x-environment': this.environment,
        },
      }, { tries: 2, timeoutMs: 5000 });

      if (!response.ok) {
        throw new Error(`Failed to fetch module ${moduleId}: ${response.status}`);
      }

      const moduleData = await response.json();
      const loadTime = performance.now() - startTime;

      return {
        id: moduleId,
        data: moduleData.data,
        metadata: {
          loadedAt: Date.now(),
          source: response.headers.get('x-cache-status') === 'hit' ? 'cache' : 'network',
          loadTime,
          size: JSON.stringify(moduleData).length,
          dependencies: moduleData.metadata?.dependencies || [],
        },
      };
    } catch (error) {
      // Return fallback module
      return {
        id: moduleId,
        data: {},
        metadata: {
          loadedAt: Date.now(),
          source: 'fallback',
          loadTime: performance.now() - startTime,
          size: 0,
          dependencies: [],
        },
      };
    }
  }

  private composeModules(modules: Record<string, LoadedModule>): CompositionResult {
    if (!this.manifest) throw new Error('Manifest not loaded');

    const moduleArray = Object.values(modules).map(module => ({
      data: module.data,
      context: {
        environment: this.environment,
        timestamp: module.metadata.loadedAt,
        moduleId: module.id,
        priority: this.manifest!.modules[module.id]?.priority || 999,
        source: 'base' as const,
      },
    }));

    return composeContent(moduleArray, this.manifest.composition);
  }

  private isCacheExpired(module: LoadedModule, moduleId: string): boolean {
    if (!this.manifest) return true;

    const moduleConfig = this.manifest.modules[moduleId];
    if (!moduleConfig) return true;

    const age = Date.now() - module.metadata.loadedAt;
    return age > moduleConfig.cacheDuration;
  }
}

// Singleton instance
let contentLoader: ContentLoader | null = null;

/**
 * Get the global content loader instance
 */
export function getContentLoader(): ContentLoader {
  if (!contentLoader) {
    const environment = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
    contentLoader = new ContentLoader(environment);
  }
  return contentLoader;
}

/**
 * Initialize the global content loader
 */
export async function initializeContentLoader(): Promise<void> {
  const loader = getContentLoader();
  await loader.initialize();
}
