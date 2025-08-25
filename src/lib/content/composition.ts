/**
 * Content Composition Utilities
 * 
 * Provides advanced content merging and composition strategies for the modular content system.
 * Supports different merge strategies, conflict resolution, and environment-specific overrides.
 */

export interface CompositionConfig {
  strategy: 'deep-merge' | 'shallow-merge' | 'override' | 'selective-merge';
  conflictResolution: 'environment-wins' | 'module-wins' | 'timestamp-wins' | 'priority-wins';
  fallbackStrategy: 'base-module' | 'empty' | 'error' | 'default-values';
  mergeArrays: 'concat' | 'replace' | 'merge' | 'dedupe';
  preserveRootKeys: boolean;
  enableValidation: boolean;
  debugMode: boolean;
}

export interface CompositionContext {
  environment: string;
  timestamp: number;
  moduleId: string;
  priority: number;
  source: 'base' | 'override' | 'environment';
}

export interface CompositionResult<T = any> {
  data: T;
  metadata: {
    sources: string[];
    conflicts: ConflictReport[];
    mergeTime: number;
    warnings: string[];
  };
}

export interface ConflictReport {
  path: string;
  strategy: string;
  winner: string;
  reason: string;
  original: any;
  resolved: any;
}

// Default composition configuration
export const DEFAULT_COMPOSITION_CONFIG: CompositionConfig = {
  strategy: 'deep-merge',
  conflictResolution: 'environment-wins',
  fallbackStrategy: 'base-module',
  mergeArrays: 'concat',
  preserveRootKeys: true,
  enableValidation: true,
  debugMode: false,
};

/**
 * Main content composition function
 */
export function composeContent<T = any>(
  modules: Array<{ data: any; context: CompositionContext }>,
  config: Partial<CompositionConfig> = {}
): CompositionResult<T> {
  const startTime = performance.now();
  const fullConfig = { ...DEFAULT_COMPOSITION_CONFIG, ...config };
  const conflicts: ConflictReport[] = [];
  const warnings: string[] = [];
  const sources: string[] = [];
  
  if (modules.length === 0) {
    if (fullConfig.fallbackStrategy === 'error') {
      throw new Error('No modules provided for composition');
    }
    return {
      data: fullConfig.fallbackStrategy === 'empty' ? {} as T : getDefaultValues<T>(),
      metadata: {
        sources: [],
        conflicts: [],
        mergeTime: 0,
        warnings: ['No modules provided for composition'],
      },
    };
  }
  
  // Sort modules by priority and source type
  const sortedModules = [...modules].sort((a, b) => {
    // Environment overrides have highest priority
    if (a.context.source === 'environment' && b.context.source !== 'environment') return 1;
    if (b.context.source === 'environment' && a.context.source !== 'environment') return -1;
    
    // Then by explicit priority
    if (a.context.priority !== b.context.priority) {
      return a.context.priority - b.context.priority;
    }
    
    // Finally by timestamp (newer wins)
    return b.context.timestamp - a.context.timestamp;
  });
  
  // Initialize result with first module
  let result = cloneDeep(sortedModules[0].data);
  sources.push(sortedModules[0].context.moduleId);
  
  // Merge remaining modules
  for (let i = 1; i < sortedModules.length; i++) {
    const module = sortedModules[i];
    sources.push(module.context.moduleId);
    
    const mergeResult = mergeObjects(
      result,
      module.data,
      fullConfig,
      module.context,
      ''
    );
    
    result = mergeResult.data;
    conflicts.push(...mergeResult.conflicts);
    warnings.push(...mergeResult.warnings);
  }
  
  const mergeTime = performance.now() - startTime;
  
  if (fullConfig.debugMode) {
    console.log('Content composition completed:', {
      sources,
      conflicts: conflicts.length,
      warnings: warnings.length,
      mergeTime: `${mergeTime.toFixed(2)}ms`,
    });
  }
  
  return {
    data: result,
    metadata: {
      sources,
      conflicts,
      mergeTime,
      warnings,
    },
  };
}

/**
 * Merge two objects according to composition configuration
 */
function mergeObjects(
  target: any,
  source: any,
  config: CompositionConfig,
  context: CompositionContext,
  path: string
): { data: any; conflicts: ConflictReport[]; warnings: string[] } {
  const conflicts: ConflictReport[] = [];
  const warnings: string[] = [];
  
  if (source === null || source === undefined) {
    return { data: target, conflicts, warnings };
  }
  
  if (target === null || target === undefined) {
    return { data: source, conflicts, warnings };
  }
  
  // Handle array merging
  if (Array.isArray(source)) {
    if (Array.isArray(target)) {
      const mergedArray = mergeArrays(target, source, config, path);
      return { data: mergedArray, conflicts, warnings };
    } else {
      // Type conflict - array vs non-array
      const resolved = resolveConflict(target, source, config, context, path);
      conflicts.push({
        path,
        strategy: config.conflictResolution,
        winner: resolved === source ? context.moduleId : 'target',
        reason: 'Type conflict: array vs non-array',
        original: target,
        resolved,
      });
      return { data: resolved, conflicts, warnings };
    }
  }
  
  // Handle object merging
  if (isObject(source) && isObject(target)) {
    const result = config.strategy === 'shallow-merge' ? { ...target } : cloneDeep(target);
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const newPath = path ? `${path}.${key}` : key;
        
        if (result.hasOwnProperty(key)) {
          // Key exists in both objects - potential conflict
          const hasConflict = !isEqual(result[key], source[key]);
          
          if (hasConflict && config.strategy === 'override') {
            conflicts.push({
              path: newPath,
              strategy: 'override',
              winner: context.moduleId,
              reason: 'Override strategy selected',
              original: result[key],
              resolved: source[key],
            });
            result[key] = source[key];
          } else if (hasConflict && (config.strategy === 'deep-merge' || config.strategy === 'selective-merge')) {
            const nestedMerge = mergeObjects(result[key], source[key], config, context, newPath);
            result[key] = nestedMerge.data;
            conflicts.push(...nestedMerge.conflicts);
            warnings.push(...nestedMerge.warnings);
          } else if (hasConflict) {
            // Resolve conflict using resolution strategy
            const resolved = resolveConflict(result[key], source[key], config, context, newPath);
            conflicts.push({
              path: newPath,
              strategy: config.conflictResolution,
              winner: resolved === source[key] ? context.moduleId : 'target',
              reason: `Conflict resolved using ${config.conflictResolution}`,
              original: result[key],
              resolved,
            });
            result[key] = resolved;
          }
        } else {
          // New key from source
          result[key] = cloneDeep(source[key]);
        }
      }
    }
    
    return { data: result, conflicts, warnings };
  }
  
  // Handle primitive value conflicts
  if (target !== source) {
    const resolved = resolveConflict(target, source, config, context, path);
    conflicts.push({
      path,
      strategy: config.conflictResolution,
      winner: resolved === source ? context.moduleId : 'target',
      reason: 'Value conflict',
      original: target,
      resolved,
    });
    return { data: resolved, conflicts, warnings };
  }
  
  return { data: target, conflicts, warnings };
}

/**
 * Merge arrays according to configuration
 */
function mergeArrays(target: any[], source: any[], config: CompositionConfig, path: string): any[] {
  switch (config.mergeArrays) {
    case 'replace':
      return [...source];
    
    case 'concat':
      return [...target, ...source];
    
    case 'dedupe':
      const combined = [...target, ...source];
      return combined.filter((item, index) => 
        combined.findIndex(other => isEqual(item, other)) === index
      );
    
    case 'merge':
      const result = [...target];
      source.forEach((sourceItem, index) => {
        if (index < result.length) {
          if (isObject(sourceItem) && isObject(result[index])) {
            result[index] = { ...result[index], ...sourceItem };
          } else {
            result[index] = sourceItem;
          }
        } else {
          result.push(sourceItem);
        }
      });
      return result;
    
    default:
      return [...target, ...source];
  }
}

/**
 * Resolve conflicts between values
 */
function resolveConflict(
  target: any,
  source: any,
  config: CompositionConfig,
  context: CompositionContext,
  path: string
): any {
  switch (config.conflictResolution) {
    case 'environment-wins':
      return context.source === 'environment' ? source : target;
    
    case 'module-wins':
      return source;
    
    case 'timestamp-wins':
      // Assume newer timestamp wins (source)
      return source;
    
    case 'priority-wins':
      // Higher priority wins (lower number = higher priority)
      return context.priority < 5 ? source : target;
    
    default:
      return source;
  }
}

/**
 * Utility functions
 */
function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function cloneDeep<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (Array.isArray(obj)) return obj.map(item => cloneDeep(item)) as unknown as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        (cloned as any)[key] = cloneDeep((obj as any)[key]);
      }
    }
    return cloned;
  }
  return obj;
}

function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }
  
  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => isEqual(a[key], b[key]));
  }
  
  return false;
}

function getDefaultValues<T>(): T {
  return {} as T;
}

/**
 * Specialized composition functions
 */

/**
 * Compose page content with fallbacks
 */
export function composePageContent(
  baseContent: any,
  pageOverrides: any,
  environmentOverrides: any = {},
  config?: Partial<CompositionConfig>
): CompositionResult {
  const modules: Array<{ data: any; context: CompositionContext }> = [
    {
      data: baseContent,
      context: {
        environment: 'base',
        timestamp: Date.now() - 1000,
        moduleId: 'base-page',
        priority: 1,
        source: 'base' as const,
      },
    },
    {
      data: pageOverrides,
      context: {
        environment: 'page',
        timestamp: Date.now(),
        moduleId: 'page-override',
        priority: 2,
        source: 'override' as const,
      },
    },
  ];
  
  if (environmentOverrides && Object.keys(environmentOverrides).length > 0) {
    const envContext: CompositionContext = {
      environment: 'environment',
      timestamp: Date.now() + 1000,
      moduleId: 'env-override',
      priority: 3,
      source: 'environment',
    };
    
    modules.push({
      data: environmentOverrides,
      context: envContext,
    });
  }
  
  return composeContent(modules, config);
}

/**
 * Compose component content with conditional loading
 */
export function composeComponentContent(
  componentId: string,
  baseContent: any,
  conditionalContent: any = {},
  config?: Partial<CompositionConfig>
): CompositionResult {
  return composeContent([
    {
      data: baseContent,
      context: {
        environment: 'base',
        timestamp: Date.now(),
        moduleId: `component-${componentId}`,
        priority: 1,
        source: 'base' as const,
      },
    },
    {
      data: conditionalContent,
      context: {
        environment: 'conditional',
        timestamp: Date.now() + 500,
        moduleId: `component-${componentId}-conditional`,
        priority: 2,
        source: 'override' as const,
      },
    },
  ], config);
}