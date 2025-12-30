/**
 * Content Service Interface
 * 
 * Following Dependency Inversion Principle (DIP):
 * Abstracts content fetching to enable testing and flexibility.
 * 
 * @module services/interfaces/IContentService
 */

/**
 * Content module data structure.
 */
export interface ContentModule {
    id: string;
    data: Record<string, unknown>;
    loadedAt: number;
    source: 'cache' | 'network';
}

/**
 * Content manifest configuration.
 */
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

/**
 * Fetch options for content data.
 */
export interface FetchContentOptions {
    /** Specific modules to load */
    modules?: string[];
    /** Environment to load content for */
    environment?: 'dev' | 'staging' | 'prod';
    /** Skip cache and fetch fresh data */
    bypassCache?: boolean;
    /** Signal for request cancellation */
    signal?: AbortSignal;
}

/**
 * Result of fetching content.
 */
export interface FetchContentResult {
    data: Record<string, unknown>;
    modules: Record<string, ContentModule>;
    manifest: ContentManifest | null;
    performance: ContentPerformanceMetrics;
}

/**
 * Performance metrics for content loading.
 */
export interface ContentPerformanceMetrics {
    loadTimes: Record<string, number>;
    cacheHits: number;
    cacheMisses: number;
    totalLoadTime: number;
}

/**
 * Content service interface.
 * 
 * Implementations can be:
 * - ContentApiService: Fetches from /api/content
 * - MockContentService: Returns mock data for testing
 * - CachedContentService: Wraps another service with caching
 */
export interface IContentService {
    /**
     * Fetches content data.
     * 
     * @param options - Fetch options
     * @returns Content data with metadata
     * @throws Error if fetch fails
     */
    fetch(options?: FetchContentOptions): Promise<FetchContentResult>;

    /**
     * Fetches the content manifest.
     * 
     * @returns Content manifest
     */
    fetchManifest(): Promise<ContentManifest>;

    /**
     * Fetches a specific content module.
     * 
     * @param moduleId - Module identifier
     * @returns Module data
     */
    fetchModule(moduleId: string): Promise<ContentModule>;

    /**
     * Preloads specified modules in the background.
     * 
     * @param moduleIds - Modules to preload
     */
    preloadModules(moduleIds: string[]): void;

    /**
     * Invalidates cached data.
     * 
     * @param moduleId - Optional specific module to invalidate
     */
    invalidateCache(moduleId?: string): void;

    /**
     * Gets performance metrics.
     * 
     * @returns Performance metrics
     */
    getPerformanceMetrics(): ContentPerformanceMetrics;
}

/**
 * Factory type for creating content service instances.
 */
export type ContentServiceFactory = () => IContentService;
