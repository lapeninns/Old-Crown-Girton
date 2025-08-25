/**
 * Content Validation Schemas
 * 
 * Zod schemas for validating modular content system components including
 * manifests, modules, environment configurations, and composition results.
 */

import { z } from 'zod';

// Base content schemas
export const ModuleConfigSchema = z.object({
  priority: z.number().min(1).max(100),
  loadStrategy: z.enum(['always', 'lazy', 'conditional']),
  cacheDuration: z.number().min(0),
  files: z.array(z.string()),
  dependencies: z.array(z.string()),
  condition: z.string().optional(),
  size: z.enum(['small', 'medium', 'large']),
});

export const CompositionConfigSchema = z.object({
  strategy: z.enum(['deep-merge', 'shallow-merge', 'override', 'selective-merge']),
  conflictResolution: z.enum(['environment-wins', 'module-wins', 'timestamp-wins', 'priority-wins']),
  fallbackStrategy: z.enum(['base-module', 'empty', 'error', 'default-values']),
  mergeArrays: z.enum(['concat', 'replace', 'merge', 'dedupe']),
  preserveRootKeys: z.boolean(),
  enableValidation: z.boolean().optional().default(true),
  debugMode: z.boolean().optional().default(false),
});

export const PerformanceConfigSchema = z.object({
  preloadModules: z.array(z.string()),
  criticalModules: z.array(z.string()),
  bundleModules: z.array(z.string()),
  maxConcurrentLoads: z.number().min(1).max(20),
  enableCompression: z.boolean(),
  enableCDN: z.boolean(),
});

export const EnvironmentConfigSchema = z.object({
  inherits: z.string().optional(),
  overrides: z.array(z.string()),
  debug: z.boolean(),
  additionalModules: z.array(z.string()).optional(),
  excludeModules: z.array(z.string()).optional(),
});

export const ContentManifestSchema = z.object({
  version: z.string(),
  description: z.string().optional(),
  lastUpdated: z.string().optional(),
  modules: z.record(z.string(), ModuleConfigSchema),
  composition: CompositionConfigSchema,
  environments: z.record(z.string(), EnvironmentConfigSchema),
  performance: PerformanceConfigSchema,
  validation: z.object({
    enableSchemaValidation: z.boolean(),
    strictMode: z.boolean(),
    logValidationErrors: z.boolean(),
  }).optional(),
  features: z.object({
    lazyLoading: z.boolean(),
    environmentOverrides: z.boolean(),
    conditionalLoading: z.boolean(),
    performanceOptimization: z.boolean(),
    backwardCompatibility: z.boolean(),
  }).optional(),
});

// Content module schemas
export const ContentModuleSchema = z.object({
  id: z.string(),
  data: z.any(),
  loadedAt: z.number(),
  source: z.enum(['cache', 'network', 'fallback']),
});

export const LoadedModuleSchema = z.object({
  id: z.string(),
  data: z.any(),
  metadata: z.object({
    loadedAt: z.number(),
    source: z.enum(['cache', 'network', 'fallback']),
    loadTime: z.number(),
    size: z.number(),
    dependencies: z.array(z.string()),
  }),
});

// Environment schemas
export const EnvironmentFeaturesSchema = z.object({
  enableDebugMode: z.boolean(),
  enablePerformanceTracking: z.boolean(),
  enableCacheOptimization: z.boolean(),
  enableContentValidation: z.boolean(),
  enableErrorReporting: z.boolean(),
  allowDynamicContent: z.boolean(),
  enableAnalytics: z.boolean(),
});

export const EnvironmentContentConfigSchema = z.object({
  additionalModules: z.array(z.string()),
  excludeModules: z.array(z.string()),
  overridePaths: z.array(z.string()),
  fallbackBehavior: z.enum(['graceful', 'strict', 'silent']),
  cacheStrategy: z.enum(['aggressive', 'moderate', 'minimal', 'disabled']),
  compressionLevel: z.enum(['none', 'basic', 'optimal', 'maximum']),
});

export const FullEnvironmentConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  inherits: z.string().optional(),
  overrides: z.array(z.string()),
  variables: z.record(z.string(), z.any()),
  features: EnvironmentFeaturesSchema,
  content: EnvironmentContentConfigSchema,
  debug: z.boolean(),
});

// Composition schemas
export const CompositionContextSchema = z.object({
  environment: z.string(),
  timestamp: z.number(),
  moduleId: z.string(),
  priority: z.number(),
  source: z.enum(['base', 'override', 'environment']),
});

export const ConflictReportSchema = z.object({
  path: z.string(),
  strategy: z.string(),
  winner: z.string(),
  reason: z.string(),
  original: z.any(),
  resolved: z.any(),
});

export const CompositionResultSchema = z.object({
  data: z.any(),
  metadata: z.object({
    sources: z.array(z.string()),
    conflicts: z.array(ConflictReportSchema),
    mergeTime: z.number(),
    warnings: z.array(z.string()),
  }),
});

// Content loading schemas
export const ContentLoadResultSchema = z.object({
  content: z.any(),
  composition: CompositionResultSchema,
  modules: z.record(z.string(), LoadedModuleSchema),
  performance: z.object({
    totalLoadTime: z.number(),
    cacheHits: z.number(),
    cacheMisses: z.number(),
    modulesLoaded: z.number(),
  }),
});

// Specific content schemas for validation
export const GlobalContentSchema = z.object({
  site: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
    branding: z.object({
      tagline: z.string().optional(),
      slogan: z.string().optional(),
    }).optional(),
  }),
  navigation: z.object({
    header: z.object({
      links: z.array(z.object({
        href: z.string(),
        label: z.string(),
      })),
    }),
    footer: z.object({
      sections: z.array(z.object({
        title: z.string(),
        links: z.array(z.object({
          href: z.string(),
          label: z.string(),
        })),
      })),
      copyright: z.string(),
      socialMedia: z.record(z.string(), z.object({
        url: z.string(),
        label: z.string(),
      })).optional(),
    }),
    breadcrumbs: z.object({
      home: z.string(),
      separator: z.string(),
    }).optional(),
  }),
});

export const UIContentSchema = z.object({
  buttons: z.record(z.string(), z.string()),
  labels: z.record(z.string(), z.string()),
  messages: z.record(z.string(), z.string()),
  placeholders: z.record(z.string(), z.string()),
});

export const AccessibilityContentSchema = z.object({
  ariaLabels: z.record(z.string(), z.string()),
  altTexts: z.record(z.string(), z.string()),
  descriptions: z.record(z.string(), z.string()),
});

export const PageContentSchema = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    cta: z.any().optional(),
  }).optional(),
  sections: z.any().optional(),
  features: z.any().optional(),
  cta: z.any().optional(),
});

// Validation functions
export function validateManifest(manifest: unknown): z.SafeParseReturnType<unknown, z.infer<typeof ContentManifestSchema>> {
  return ContentManifestSchema.safeParse(manifest);
}

export function validateModule(module: unknown): z.SafeParseReturnType<unknown, z.infer<typeof ContentModuleSchema>> {
  return ContentModuleSchema.safeParse(module);
}

export function validateEnvironmentConfig(config: unknown): z.SafeParseReturnType<unknown, z.infer<typeof FullEnvironmentConfigSchema>> {
  return FullEnvironmentConfigSchema.safeParse(config);
}

export function validateCompositionResult(result: unknown): z.SafeParseReturnType<unknown, z.infer<typeof CompositionResultSchema>> {
  return CompositionResultSchema.safeParse(result);
}

export function validateGlobalContent(content: unknown): z.SafeParseReturnType<unknown, z.infer<typeof GlobalContentSchema>> {
  return GlobalContentSchema.safeParse(content);
}

export function validateUIContent(content: unknown): z.SafeParseReturnType<unknown, z.infer<typeof UIContentSchema>> {
  return UIContentSchema.safeParse(content);
}

export function validatePageContent(content: unknown): z.SafeParseReturnType<unknown, z.infer<typeof PageContentSchema>> {
  return PageContentSchema.safeParse(content);
}

// Generic validation function
export function validateContent<T extends z.ZodType>(
  content: unknown,
  schema: T
): z.SafeParseReturnType<unknown, z.infer<T>> {
  return schema.safeParse(content);
}

// Validation error helper
export function formatValidationErrors(errors: z.ZodError): string[] {
  return errors.errors.map(error => {
    const path = error.path.join('.');
    return `${path}: ${error.message}`;
  });
}

// Type exports
export type ContentManifest = z.infer<typeof ContentManifestSchema>;
export type ModuleConfig = z.infer<typeof ModuleConfigSchema>;
export type CompositionConfig = z.infer<typeof CompositionConfigSchema>;
export type PerformanceConfig = z.infer<typeof PerformanceConfigSchema>;
export type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema>;
export type FullEnvironmentConfig = z.infer<typeof FullEnvironmentConfigSchema>;
export type ContentModule = z.infer<typeof ContentModuleSchema>;
export type LoadedModule = z.infer<typeof LoadedModuleSchema>;
export type CompositionResult = z.infer<typeof CompositionResultSchema>;
export type ContentLoadResult = z.infer<typeof ContentLoadResultSchema>;
export type GlobalContent = z.infer<typeof GlobalContentSchema>;
export type UIContent = z.infer<typeof UIContentSchema>;
export type PageContent = z.infer<typeof PageContentSchema>;