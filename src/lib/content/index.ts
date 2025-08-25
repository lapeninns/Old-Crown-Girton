/**
 * Content Management System
 * 
 * Exports all content-related utilities, loaders, and composition functions
 * for the modular content architecture.
 */

// Core composition utilities
export {
  composeContent,
  composePageContent,
  composeComponentContent,
  DEFAULT_COMPOSITION_CONFIG,
} from './composition';

export type {
  CompositionConfig,
  CompositionContext,
  CompositionResult,
  ConflictReport,
} from './composition';

// Content loader service
export {
  ContentLoader,
  getContentLoader,
  initializeContentLoader,
} from './loader';

export type {
  ContentManifest,
  ModuleConfig,
  EnvironmentConfig,
  PerformanceConfig,
  LoadedModule,
  ContentLoadResult,
} from './loader';

// Environment management
export {
  EnvironmentManager,
  getEnvironmentManager,
  applyEnvironmentOverrides,
  isFeatureEnabled,
  getEnvironmentVariable,
} from './environment';

export type {
  EnvironmentConfig as EnvConfig,
  EnvironmentFeatures,
  EnvironmentContentConfig,
  EnvironmentOverride,
  EnvironmentContext,
} from './environment';

// Content validation
export {
  validateManifest,
  validateModule,
  validateEnvironmentConfig,
  validateCompositionResult,
  validateGlobalContent,
  validateUIContent,
  validatePageContent,
  validateContent,
  formatValidationErrors,
  ContentManifestSchema,
  ModuleConfigSchema,
  CompositionConfigSchema,
  GlobalContentSchema,
  UIContentSchema,
  PageContentSchema,
} from './validation';

export type {
  ContentManifest as ValidatedContentManifest,
  ModuleConfig as ValidatedModuleConfig,
  CompositionConfig as ValidatedCompositionConfig,
  GlobalContent,
  UIContent,
  PageContent,
} from './validation';

// Re-export hooks for convenience
export {
  useModularContent,
  usePageContent as useModularPageContent,
  useComponentContent as useModularComponentContent,
  useGlobalContent as useModularGlobalContent,
} from '../../../hooks/data/useModularContent';

export type {
  UseModularContentResult,
  UseModularContentOptions,
  ContentModule,
} from '../../../hooks/data/useModularContent';