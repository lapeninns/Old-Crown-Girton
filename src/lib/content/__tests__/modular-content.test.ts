/**
 * Modular Content System Tests
 * 
 * Comprehensive test suite covering composition, environment overrides,
 * content loading, and validation functionality.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  composeContent,
  composePageContent,
  composeComponentContent,
  DEFAULT_COMPOSITION_CONFIG,
} from '../composition';
import {
  EnvironmentManager,
  getEnvironmentManager,
  applyEnvironmentOverrides,
} from '../environment';
import {
  ContentLoader,
} from '../loader';
import {
  validateManifest,
  validateModule,
  validateCompositionResult,
  validateGlobalContent,
  ContentManifestSchema,
} from '../validation';

// Mock data for testing
const mockManifest = {
  version: '1.0.0',
  description: 'Test manifest',
  modules: {
    'core/global': {
      priority: 1,
      loadStrategy: 'always',
      cacheDuration: 1800000,
      files: ['core/global.json'],
      dependencies: [],
      size: 'small',
    },
    'core/ui': {
      priority: 1,
      loadStrategy: 'always',
      cacheDuration: 1800000,
      files: ['core/ui.json'],
      dependencies: ['core/global'],
      size: 'small',
    },
    'pages/home': {
      priority: 2,
      loadStrategy: 'lazy',
      cacheDuration: 600000,
      files: ['pages/home.json'],
      dependencies: ['core/global'],
      size: 'medium',
    },
  },
  composition: {
    strategy: 'deep-merge',
    conflictResolution: 'environment-wins',
    fallbackStrategy: 'base-module',
    mergeArrays: 'concat',
    preserveRootKeys: true,
  },
  environments: {
    dev: {
      inherits: 'base',
      overrides: ['environments/dev/overrides/'],
      debug: true,
    },
    prod: {
      inherits: 'base',
      overrides: ['environments/prod/overrides/'],
      debug: false,
    },
  },
  performance: {
    preloadModules: ['core/global'],
    criticalModules: ['core/ui'],
    bundleModules: ['core/global', 'core/ui'],
    maxConcurrentLoads: 3,
    enableCompression: true,
    enableCDN: true,
  },
};

const mockGlobalContent = {
  site: {
    name: 'Test Restaurant',
    title: 'Test Restaurant Title',
    description: 'Test restaurant description',
    keywords: ['test', 'restaurant'],
  },
  navigation: {
    header: {
      links: [
        { href: '/', label: 'Home' },
        { href: '/menu', label: 'Menu' },
      ],
    },
    footer: {
      sections: [
        {
          title: 'Quick Links',
          links: [
            { href: '/menu', label: 'Menu' },
            { href: '/contact', label: 'Contact' },
          ],
        },
      ],
      copyright: '© 2025 Test Restaurant',
    },
  },
};

const mockUIContent = {
  buttons: {
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
  },
  labels: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
  messages: {
    welcome: 'Welcome to our restaurant',
    error: 'Something went wrong',
  },
  placeholders: {
    search: 'Search...',
    email: 'Enter your email',
  },
};

const mockHomeContent = {
  hero: {
    title: 'Welcome to Test Restaurant',
    subtitle: 'Experience amazing food',
    description: 'Join us for an unforgettable dining experience',
  },
  sections: {
    features: {
      title: 'What Makes Us Special',
      items: [
        {
          icon: '🍕',
          title: 'Great Food',
          description: 'Delicious meals prepared fresh',
        },
      ],
    },
  },
};

describe('Content Composition', () => {
  describe('composeContent', () => {
    it('should merge simple objects', () => {
      const modules = [
        {
          data: { a: 1, b: 2 },
          context: {
            environment: 'base',
            timestamp: Date.now(),
            moduleId: 'module1',
            priority: 1,
            source: 'base' as const,
          },
        },
        {
          data: { b: 3, c: 4 },
          context: {
            environment: 'override',
            timestamp: Date.now() + 1000,
            moduleId: 'module2',
            priority: 2,
            source: 'override' as const,
          },
        },
      ];

      const result = composeContent(modules);

      expect(result.data).toEqual({ a: 1, b: 3, c: 4 });
      expect(result.metadata.sources).toEqual(['module1', 'module2']);
      expect(result.metadata.conflicts).toHaveLength(1);
      expect(result.metadata.conflicts[0].path).toBe('b');
    });

    it('should handle nested object merging', () => {
      const modules = [
        {
          data: {
            site: {
              name: 'Original Name',
              description: 'Original Description',
            },
          },
          context: {
            environment: 'base',
            timestamp: Date.now(),
            moduleId: 'base',
            priority: 1,
            source: 'base' as const,
          },
        },
        {
          data: {
            site: {
              name: 'Updated Name',
              version: '1.0.0',
            },
          },
          context: {
            environment: 'override',
            timestamp: Date.now() + 1000,
            moduleId: 'override',
            priority: 2,
            source: 'override' as const,
          },
        },
      ];

      const result = composeContent(modules);

      expect(result.data.site.name).toBe('Updated Name');
      expect(result.data.site.description).toBe('Original Description');
      expect(result.data.site.version).toBe('1.0.0');
    });

    it('should concatenate arrays by default', () => {
      const modules = [
        {
          data: { items: [1, 2] },
          context: {
            environment: 'base',
            timestamp: Date.now(),
            moduleId: 'base',
            priority: 1,
            source: 'base' as const,
          },
        },
        {
          data: { items: [3, 4] },
          context: {
            environment: 'override',
            timestamp: Date.now() + 1000,
            moduleId: 'override',
            priority: 2,
            source: 'override' as const,
          },
        },
      ];

      const result = composeContent(modules);

      expect(result.data.items).toEqual([1, 2, 3, 4]);
    });

    it('should handle empty modules gracefully', () => {
      const result = composeContent([]);

      expect(result.data).toEqual({});
      expect(result.metadata.warnings).toContain('No modules provided for composition');
    });

    it('should respect priority ordering', () => {
      const modules = [
        {
          data: { value: 'high' },
          context: {
            environment: 'base',
            timestamp: Date.now(),
            moduleId: 'high-priority',
            priority: 1,
            source: 'base' as const,
          },
        },
        {
          data: { value: 'low' },
          context: {
            environment: 'base',
            timestamp: Date.now(),
            moduleId: 'low-priority',
            priority: 10,
            source: 'base' as const,
          },
        },
      ];

      const result = composeContent(modules, {
        conflictResolution: 'priority-wins',
      });

      expect(result.data.value).toBe('high');
    });
  });

  describe('composePageContent', () => {
    it('should compose page content with overrides', () => {
      const baseContent = mockHomeContent;
      const pageOverrides = {
        hero: {
          title: 'Special Welcome Title',
        },
      };
      const envOverrides = {
        hero: {
          subtitle: 'Development Environment',
        },
      };

      const result = composePageContent(baseContent, pageOverrides, envOverrides);

      expect(result.data.hero.title).toBe('Special Welcome Title');
      expect(result.data.hero.subtitle).toBe('Development Environment');
      expect(result.data.hero.description).toBe('Join us for an unforgettable dining experience');
    });
  });

  describe('composeComponentContent', () => {
    it('should compose component content', () => {
      const baseContent = {
        title: 'Base Component',
        settings: { visible: true },
      };
      const conditionalContent = {
        title: 'Enhanced Component',
        settings: { enhanced: true },
      };

      const result = composeComponentContent('test-component', baseContent, conditionalContent);

      expect(result.data.title).toBe('Enhanced Component');
      expect(result.data.settings.visible).toBe(true);
      expect(result.data.settings.enhanced).toBe(true);
    });
  });
});

describe('Environment Management', () => {
  let envManager: EnvironmentManager;

  beforeEach(() => {
    envManager = new EnvironmentManager('dev');
  });

  describe('EnvironmentManager', () => {
    it('should initialize with default environments', () => {
      const environments = envManager.getAvailableEnvironments();
      expect(environments).toHaveLength(3);
      expect(environments.map(env => env.id)).toContain('dev');
      expect(environments.map(env => env.id)).toContain('staging');
      expect(environments.map(env => env.id)).toContain('prod');
    });

    it('should get current environment config', () => {
      const config = envManager.getCurrentEnvironment();
      expect(config.id).toBe('dev');
      expect(config.debug).toBe(true);
      expect(config.features.enableDebugMode).toBe(true);
    });

    it('should check feature flags', () => {
      expect(envManager.isFeatureEnabled('enableDebugMode')).toBe(true);
      expect(envManager.isFeatureEnabled('enableAnalytics')).toBe(false);
    });

    it('should get environment variables', () => {
      expect(envManager.getVariable('DEBUG_PANELS')).toBe(true);
      expect(envManager.getVariable('CACHE_TTL')).toBe(60000);
      expect(envManager.getVariable('NONEXISTENT', 'default')).toBe('default');
    });

    it('should switch environments', () => {
      envManager.setEnvironment('prod');
      const config = envManager.getCurrentEnvironment();
      expect(config.id).toBe('prod');
      expect(config.debug).toBe(false);
    });

    it('should resolve environment inheritance', () => {
      envManager.setEnvironment('staging');
      const config = envManager.getCurrentEnvironment();
      
      // Staging should inherit from dev but override some values
      expect(config.features.enableDebugMode).toBe(false); // Overridden
      expect(config.features.enablePerformanceTracking).toBe(true); // Inherited
    });
  });

  describe('applyEnvironmentOverrides', () => {
    it('should apply environment overrides to content', async () => {
      const baseContent = mockGlobalContent;
      
      const result = await applyEnvironmentOverrides(baseContent, 'dev');
      
      expect(result.data).toBeDefined();
      expect(result.metadata.sources).toContain('base-content');
    });
  });
});

describe('Content Validation', () => {
  describe('validateManifest', () => {
    it('should validate correct manifest', () => {
      const result = validateManifest(mockManifest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.version).toBe('1.0.0');
      }
    });

    it('should reject invalid manifest', () => {
      const invalidManifest = {
        version: '1.0.0',
        modules: {
          'invalid-module': {
            priority: 'invalid', // Should be number
            loadStrategy: 'invalid', // Should be enum
          },
        },
      };

      const result = validateManifest(invalidManifest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('validateGlobalContent', () => {
    it('should validate correct global content', () => {
      const result = validateGlobalContent(mockGlobalContent);
      expect(result.success).toBe(true);
    });

    it('should reject invalid global content', () => {
      const invalidContent = {
        site: {
          // Missing required fields
        },
        navigation: {
          // Missing required fields
        },
      };

      const result = validateGlobalContent(invalidContent);
      expect(result.success).toBe(false);
    });
  });
});

describe('Integration Tests', () => {
  describe('Full Content Loading Flow', () => {
    it('should load and compose content end-to-end', async () => {
      // This would be an integration test that exercises the full flow
      // from loading modules to composing final content
      
      const modules = [
        {
          data: mockGlobalContent,
          context: {
            environment: 'dev',
            timestamp: Date.now(),
            moduleId: 'core/global',
            priority: 1,
            source: 'base' as const,
          },
        },
        {
          data: mockUIContent,
          context: {
            environment: 'dev',
            timestamp: Date.now() + 100,
            moduleId: 'core/ui',
            priority: 1,
            source: 'base' as const,
          },
        },
        {
          data: mockHomeContent,
          context: {
            environment: 'dev',
            timestamp: Date.now() + 200,
            moduleId: 'pages/home',
            priority: 2,
            source: 'base' as const,
          },
        },
      ];

      const result = composeContent(modules);

      // Verify composition worked
      expect(result.data.site).toBeDefined();
      expect(result.data.buttons).toBeDefined();
      expect(result.data.hero).toBeDefined();
      
      // Verify metadata
      expect(result.metadata.sources).toHaveLength(3);
      expect(result.metadata.mergeTime).toBeGreaterThan(0);
    });
  });

  describe('Performance Tests', () => {
    it('should handle large content composition efficiently', () => {
      const startTime = performance.now();
      
      const largeModules = Array.from({ length: 100 }, (_, i) => ({
        data: { [`key${i}`]: `value${i}` },
        context: {
          environment: 'test',
          timestamp: Date.now() + i,
          moduleId: `module-${i}`,
          priority: i,
          source: 'base' as const,
        },
      }));

      const result = composeContent(largeModules);
      const endTime = performance.now();
      
      expect(result.data).toBeDefined();
      expect(Object.keys(result.data)).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
    });
  });

  describe('Error Handling', () => {
    it('should handle missing modules gracefully', () => {
      const result = composeContent([], {
        fallbackStrategy: 'empty',
      });
      
      expect(result.data).toEqual({});
      expect(result.metadata.warnings).toContain('No modules provided for composition');
    });

    it('should handle validation errors gracefully', () => {
      const invalidResult = validateManifest({ invalid: 'data' });
      
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.error.errors.length).toBeGreaterThan(0);
      }
    });
  });
});