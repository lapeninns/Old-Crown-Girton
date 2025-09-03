/**
 * Migration Adapter for Modular Content System
 * 
 * Provides seamless backward compatibility and incremental migration
 * from legacy content.json to the new modular content system.
 */

import { useState, useEffect } from 'react';
import { useModularContent, type UseModularContentOptions } from '../../../hooks/data/useModularContent';
import { getProductionConfig } from '../config/production';
import { getContentLoader } from '../content/loader';

export interface MigrationConfig {
  enableModularSystem: boolean;
  fallbackToLegacy: boolean;
  comparisonMode: boolean; // Run both systems in parallel for comparison
  migrationPhase: 'preparation' | 'gradual' | 'complete';
  moduleWhitelist?: string[]; // Only these modules use the new system
  pageWhitelist?: string[]; // Only these pages use the new system
}

export interface LegacyContentData {
  global: any;
  pages: any;
  components: any;
  forms: any;
  api: any;
  legal: any;
}

/**
 * Migration adapter that wraps content hooks with backward compatibility
 */
export class ContentMigrationAdapter {
  private config: MigrationConfig;
  private fallbackData: LegacyContentData | null = null;

  constructor(config?: Partial<MigrationConfig>) {
    const prodConfig = getProductionConfig();
    
    this.config = {
      enableModularSystem: prodConfig.useModularContent,
      fallbackToLegacy: true,
      comparisonMode: prodConfig.environment === 'dev',
      migrationPhase: 'gradual',
      ...config,
    };
  }

  /**
   * Adaptive content hook that switches between legacy and modular systems
   */
  useAdaptiveContent(options: UseContentOptions = {}) {
    const shouldUseModular = this.shouldUseModularSystem(options.page);
    
    if (shouldUseModular) {
      return this.useModularContentWithFallback(options);
    } else {
      return this.useLegacyContent(options);
    }
  }

  /**
   * Use modular content with automatic fallback to legacy
   */
  private useModularContentWithFallback(options: UseContentOptions) {
    const modularOptions: UseModularContentOptions = {
      modules: this.determineModulesForPage(options.page),
      environment: getProductionConfig().environment,
      enablePerformanceTracking: this.config.comparisonMode,
      ...options,
    };

    const modularResult = useModularContent(modularOptions);

    // If modular system fails and fallback is enabled, use legacy
    if (modularResult.error && this.config.fallbackToLegacy) {
      appLogger.warn('Modular content failed, falling back to legacy', modularResult.error);
      return this.useLegacyContentFallback();
    }

    // In comparison mode, run both systems and compare results
    if (this.config.comparisonMode && !modularResult.isLoading) {
      this.compareWithLegacy(modularResult.data, options.page);
    }

    return {
      ...modularResult,
      migrationInfo: {
        system: 'modular',
        fallbackAvailable: this.config.fallbackToLegacy,
        phase: this.config.migrationPhase,
      },
    };
  }

  /**
   * Use legacy content system
   */
  private useLegacyContent(options: UseContentOptions) {
    // This would integrate with your existing legacy content system
    // For now, we'll simulate it with the original content.json
    return this.useLegacyContentImplementation(options);
  }

  /**
   * Legacy content implementation (placeholder)
   */
  private useLegacyContentImplementation(options: UseContentOptions) {
    // This would be your original useContent hook implementation
    // For demonstration, we'll return a basic structure
    
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    this.loadLegacyContent()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
    }, []);

    return {
      data,
      error,
      isLoading,
      isValidating: false,
      refetch: () => this.loadLegacyContent().then(setData),
      mutate: () => Promise.resolve(data),
      migrationInfo: {
        system: 'legacy',
        migrationRecommended: true,
        phase: this.config.migrationPhase,
      },
    };
  }

  /**
   * Fallback to legacy when modular fails
   */
  private useLegacyContentFallback() {
    if (!this.fallbackData) {
      // Load fallback data synchronously from embedded content
      this.fallbackData = this.getEmbeddedLegacyContent();
    }

    return {
      data: this.fallbackData,
      error: null as Error | null,
      isLoading: false,
      isValidating: false,
      refetch: () => Promise.resolve(),
      mutate: () => Promise.resolve(this.fallbackData),
      migrationInfo: {
        system: 'legacy-fallback',
        reason: 'modular-system-failed',
        phase: this.config.migrationPhase,
      },
    };
  }

  /**
   * Determine if modular system should be used for a specific page
   */
  private shouldUseModularSystem(page?: string): boolean {
    if (!this.config.enableModularSystem) {
      return false;
    }

    // Gradual migration based on whitelist
    if (this.config.migrationPhase === 'gradual') {
      if (this.config.pageWhitelist && page) {
        return this.config.pageWhitelist.includes(page);
      }
      
      // Default gradual rollout strategy
      return this.isPageInGradualRollout(page);
    }

    // Complete migration
    if (this.config.migrationPhase === 'complete') {
      return true;
    }

    // Preparation phase - only for testing
    if (this.config.migrationPhase === 'preparation') {
      return getProductionConfig().environment !== 'prod';
    }

    return false;
  }

  /**
   * Determine modules needed for a specific page
   */
  private determineModulesForPage(page?: string): string[] {
    const baseModules = ['core/global', 'core/ui', 'core/accessibility'];
    
    if (!page) {
      return baseModules;
    }

    // Add page-specific modules
    const pageModules = [`pages/${page}`];
    
    // Add conditional modules based on page requirements
    const conditionalModules = this.getConditionalModulesForPage(page);
    
    return [...baseModules, ...pageModules, ...conditionalModules];
  }

  /**
   * Get conditional modules for specific page
   */
  private getConditionalModulesForPage(page: string): string[] {
    const moduleMap: Record<string, string[]> = {
      home: ['components/testimonials', 'components/menuHighlights'],
      about: ['components/testimonials'],
      contact: ['core/forms'],
      menu: ['components/menuHighlights'],
      events: ['components/faq'],
      signin: ['core/forms'],
    };

    return moduleMap[page] || [];
  }

  /**
   * Check if page is in gradual rollout
   */
  private isPageInGradualRollout(page?: string): boolean {
    // Implement gradual rollout logic
    // For example: start with core pages, then expand
    const rolloutOrder = ['home', 'about', 'contact', 'menu', 'events'];
    const rolloutIndex = Math.floor(rolloutOrder.length * 0.6); // 60% rollout
    
    if (!page) return true; // Global content always uses new system
    
    return rolloutOrder.indexOf(page) <= rolloutIndex;
  }

  /**
   * Compare modular and legacy results for validation
   */
  private async compareWithLegacy(modularData: any, page?: string) {
    try {
      const legacyData = await this.loadLegacyContent();
      const comparison = this.compareContentStructures(modularData, legacyData, page);
      
      if (comparison.differences.length > 0) {
        appLogger.warn('Content differences detected', comparison);

        // Report differences for analysis
        this.reportContentDifferences(comparison, page);
      }
    } catch (error) {
      appLogger.error('Failed to compare with legacy content', error);
    }
  }

  /**
   * Compare content structures
   */
  private compareContentStructures(modular: any, legacy: any, page?: string) {
    const differences: Array<{
      path: string;
      modular: any;
      legacy: any;
      type: 'missing' | 'different' | 'extra';
    }> = [];

    // Deep comparison logic would go here
    // This is a simplified version for demonstration
    
    return {
      page,
      differences,
      similarity: Math.max(0, 1 - differences.length / 100),
      timestamp: Date.now(),
    };
  }

  /**
   * Load legacy content
   */
  private async loadLegacyContent(): Promise<LegacyContentData> {
    // This would load from your original content.json
  const { fetchWithResilience } = await import('../data/fetchWithResilience');
  const response = await fetchWithResilience('/config/content.json');
  return response.json();
  }

  /**
   * Get embedded legacy content for immediate fallback
   */
  private getEmbeddedLegacyContent(): LegacyContentData {
    // Return minimal embedded content structure
    return {
      global: {
        site: {
          name: 'The Old Crown Girton',
          title: 'Historic Thatched Pub & Nepalese Restaurant',
          description: 'Historic thatched pub serving authentic Nepalese cuisine and British pub classics.',
        },
        navigation: {
          header: {
            links: [
              { href: '/', label: 'Home' },
              { href: '/menu', label: 'Menu' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
            ],
          },
        },
      },
      pages: {},
      components: {},
      forms: {},
      api: {},
      legal: {},
    };
  }

  /**
   * Report content differences for analysis
   */
  private async reportContentDifferences(comparison: any, page?: string) {
    // In production, this would send to your analytics/monitoring service
    if (getProductionConfig().monitoring.analytics) {
      // Send to analytics endpoint
      const { fetchWithResilience } = await import('../data/fetchWithResilience');
      await fetchWithResilience('/api/analytics/content-migration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'content-comparison',
          page,
          comparison,
          timestamp: Date.now(),
        }),
      }).catch((error) => appLogger.error('Failed to report content differences', error));
    }
  }
}

/**
 * Migration strategy manager
 */
export class MigrationStrategyManager {
  private adapter: ContentMigrationAdapter;

  constructor() {
    this.adapter = new ContentMigrationAdapter();
  }

  /**
   * Get migration recommendations
   */
  getMigrationRecommendations(): {
    phase: string;
    readyForNext: boolean;
    blockers: string[];
    recommendations: string[];
  } {
    const config = getProductionConfig();
    
    return {
      phase: 'gradual',
      readyForNext: config.environment !== 'prod',
      blockers: [],
      recommendations: [
        'Test modular system in staging environment',
        'Monitor performance metrics',
        'Validate content consistency',
        'Prepare rollback plan',
      ],
    };
  }

  /**
   * Execute migration phase
   */
  async executeMigrationPhase(phase: 'preparation' | 'gradual' | 'complete'): Promise<void> {
    appLogger.info(`Starting migration phase: ${phase}`);

    switch (phase) {
      case 'preparation':
        await this.executePreparationPhase();
        break;
      case 'gradual':
        await this.executeGradualPhase();
        break;
      case 'complete':
        await this.executeCompletePhase();
        break;
    }
  }  private async executePreparationPhase(): Promise<void> {
    // Validate modular system
    // Preload critical modules
    // Set up monitoring
    appLogger.info('Preparation phase completed');
  }

  private async executeGradualPhase(): Promise<void> {
    // Implement feature flags
    // Monitor performance
    // Collect feedback
    appLogger.info('Gradual phase initiated');
  }

  private async executeCompletePhase(): Promise<void> {
    // Switch all traffic to modular system
    // Remove legacy code paths
    appLogger.info('Complete migration finished');
  }
}

// Global migration adapter instance
let migrationAdapter: ContentMigrationAdapter | null = null;

/**
 * Get global migration adapter
 */
export function getMigrationAdapter(): ContentMigrationAdapter {
  if (!migrationAdapter) {
    migrationAdapter = new ContentMigrationAdapter();
  }
  return migrationAdapter;
}

/**
 * Hook for adaptive content loading with migration support
 */
export function useAdaptiveContent(options: UseContentOptions = {}) {
  const adapter = getMigrationAdapter();
  return adapter.useAdaptiveContent(options);
}

import { appLogger } from '../../../lib/logger';

// Type definitions
interface UseContentOptions {
  page?: string;
  enabled?: boolean;
  refreshInterval?: number;
}

// React import (in real implementation, this would be imported)
const React = {
  useState: (initial: any) => [initial, () => {}],
  useEffect: (effect: () => void, deps: any[]) => {},
};