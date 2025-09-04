/**
 * Progressive Loading Coordinator
 * Orchestrates adaptive content delivery based on device capabilities
 */

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { useDeviceCapabilities, DeviceCapabilities, DeviceTier } from './useDeviceCapabilities';
import { useProgressiveLoading } from './useProgressiveLoading';

export interface LoadingStrategy {
  // Content prioritization
  criticalComponents: string[];
  deferredComponents: string[];
  preloadComponents: string[];
  
  // Image loading strategy
  imageQuality: number;
  imageSizes: number[];
  lazyLoadThreshold: number; // px from viewport
  
  // Network optimizations
  enablePrefetch: boolean;
  enablePreload: boolean;
  maxConcurrentRequests: number;
  chunkSize: number; // bytes
  
  // Caching strategy
  cacheStrategy: 'aggressive' | 'moderate' | 'minimal';
  cacheTTL: number;
  
  // Fallback behavior
  timeoutMs: number;
  retryStrategy: 'exponential' | 'linear' | 'disabled';
  gracefulDegradation: boolean;
}

export interface ContentLoadingPlan {
  immediate: string[];
  priority: string[];
  background: string[];
  deferred: string[];
  disabled: string[];
}

interface ProgressiveLoadingContextValue {
  capabilities: DeviceCapabilities;
  strategy: LoadingStrategy;
  loadingPlan: ContentLoadingPlan;
  
  // Loading control methods
  loadComponent: (componentId: string, priority?: 'high' | 'normal' | 'low') => Promise<any>;
  preloadContent: (contentId: string) => Promise<void>;
  adaptStrategy: (overrides: Partial<LoadingStrategy>) => void;
  
  // Performance monitoring
  getLoadingMetrics: () => LoadingMetrics;
  reportPerformance: (metrics: PerformanceEntry) => void;
}

interface LoadingMetrics {
  totalLoadTime: number;
  componentsLoaded: number;
  failedLoads: number;
  cacheHitRate: number;
  memoryUsage: number;
  networkUtilization: number;
}

const ProgressiveLoadingContext = createContext<ProgressiveLoadingContextValue | null>(null);

/**
 * Generate optimal loading strategy based on device capabilities
 */
function generateLoadingStrategy(capabilities: DeviceCapabilities): LoadingStrategy {
  const { deviceTier, networkSpeed, memoryPressure, saveData, enablePreloading } = capabilities;
  
  // Base strategy configuration
  let strategy: LoadingStrategy = {
    criticalComponents: ['header', 'navigation', 'main-content'],
    deferredComponents: [],
    preloadComponents: [],
    imageQuality: 0.8,
    imageSizes: [320, 640, 1024, 1920],
    lazyLoadThreshold: 100,
    enablePrefetch: true,
    enablePreload: true,
    maxConcurrentRequests: 4,
    chunkSize: 64000, // 64KB
    cacheStrategy: 'moderate',
    cacheTTL: 300000, // 5 minutes
    timeoutMs: 5000,
    retryStrategy: 'exponential',
    gracefulDegradation: true
  };

  // Device tier adaptations
  switch (deviceTier) {
    case 'low-end':
      strategy = {
        ...strategy,
        criticalComponents: ['header', 'main-content'],
        deferredComponents: ['animations', 'modals', 'slideshow', 'testimonials'],
        preloadComponents: [],
        imageQuality: 0.6,
        imageSizes: [320, 640],
        lazyLoadThreshold: 50,
        enablePrefetch: false,
        enablePreload: false,
        maxConcurrentRequests: 1,
        chunkSize: 32000, // 32KB
        cacheStrategy: 'aggressive',
        cacheTTL: 600000, // 10 minutes
        timeoutMs: 15000,
        retryStrategy: 'linear'
      };
      break;
      
    case 'mid-range':
      strategy = {
        ...strategy,
        criticalComponents: ['header', 'navigation', 'main-content', 'menu'],
        deferredComponents: ['animations', 'modals'],
        preloadComponents: ['menu'],
        imageQuality: 0.75,
        imageSizes: [320, 640, 1024],
        lazyLoadThreshold: 75,
        enablePrefetch: enablePreloading,
        enablePreload: enablePreloading,
        maxConcurrentRequests: 2,
        chunkSize: 48000, // 48KB
        cacheStrategy: 'moderate',
        timeoutMs: 8000
      };
      break;
      
    case 'high-end':
      strategy = {
        ...strategy,
        criticalComponents: ['header', 'navigation', 'main-content', 'menu', 'hero'],
        deferredComponents: ['modals'],
        preloadComponents: ['menu', 'hero', 'testimonials'],
        imageQuality: 0.85,
        imageSizes: [320, 640, 1024, 1920],
        lazyLoadThreshold: 100,
        maxConcurrentRequests: 4,
        chunkSize: 64000,
        timeoutMs: 6000
      };
      break;
      
    case 'premium':
      strategy = {
        ...strategy,
        criticalComponents: ['header', 'navigation', 'main-content', 'menu', 'hero'],
        deferredComponents: [],
        preloadComponents: ['menu', 'hero', 'testimonials', 'slideshow', 'animations'],
        imageQuality: 0.95,
        imageSizes: [320, 640, 1024, 1920, 2560],
        lazyLoadThreshold: 150,
        maxConcurrentRequests: 6,
        chunkSize: 128000, // 128KB
        cacheStrategy: 'minimal',
        timeoutMs: 4000
      };
      break;
  }

  // Network speed adaptations
  if (networkSpeed === 'slow-2g' || networkSpeed === '2g') {
    strategy.imageQuality = Math.min(strategy.imageQuality, 0.5);
    strategy.imageSizes = [320, 640];
    strategy.enablePrefetch = false;
    strategy.enablePreload = false;
    strategy.maxConcurrentRequests = 1;
    strategy.chunkSize = 16000; // 16KB
    strategy.timeoutMs = 20000;
    strategy.cacheStrategy = 'aggressive';
    strategy.cacheTTL = 900000; // 15 minutes
  } else if (networkSpeed === '3g') {
    strategy.imageQuality = Math.min(strategy.imageQuality, 0.7);
    strategy.imageSizes = [320, 640, 1024];
    strategy.maxConcurrentRequests = Math.min(strategy.maxConcurrentRequests, 2);
    strategy.chunkSize = Math.min(strategy.chunkSize, 32000);
    strategy.timeoutMs = Math.max(strategy.timeoutMs, 10000);
  }

  // Memory pressure adaptations
  if (memoryPressure === 'high' || memoryPressure === 'critical') {
    strategy.preloadComponents = [];
    strategy.enablePrefetch = false;
    strategy.enablePreload = false;
    strategy.maxConcurrentRequests = Math.min(strategy.maxConcurrentRequests, 1);
    strategy.cacheStrategy = 'minimal';
    strategy.cacheTTL = Math.min(strategy.cacheTTL, 180000); // 3 minutes
  }

  // Data saver adaptations
  if (saveData) {
    strategy.imageQuality = Math.min(strategy.imageQuality, 0.6);
    strategy.imageSizes = [320, 640];
    strategy.enablePrefetch = false;
    strategy.preloadComponents = [];
    strategy.maxConcurrentRequests = 1;
    strategy.cacheStrategy = 'aggressive';
  }

  return strategy;
}

/**
 * Generate content loading plan based on strategy
 */
function generateContentLoadingPlan(strategy: LoadingStrategy): ContentLoadingPlan {
  const { criticalComponents, deferredComponents, preloadComponents } = strategy;
  
  return {
    immediate: criticalComponents,
    priority: preloadComponents.filter(comp => !criticalComponents.includes(comp)),
    background: preloadComponents,
    deferred: deferredComponents,
    disabled: [] // Components to disable entirely on low-end devices
  };
}

/**
 * Progressive Loading Provider Component
 */
interface ProgressiveLoadingProviderProps {
  children: React.ReactNode;
  strategyOverrides?: Partial<LoadingStrategy>;
  enableDebug?: boolean;
}

export function ProgressiveLoadingProvider({ 
  children, 
  strategyOverrides = {},
  enableDebug = false 
}: ProgressiveLoadingProviderProps) {
  const capabilities = useDeviceCapabilities();
  const [loadingMetrics, setLoadingMetrics] = useState<LoadingMetrics>({
    totalLoadTime: 0,
    componentsLoaded: 0,
    failedLoads: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    networkUtilization: 0
  });

  // Generate strategy based on capabilities and overrides
  const strategy = useMemo(() => {
    const baseStrategy = generateLoadingStrategy(capabilities);
    return { ...baseStrategy, ...strategyOverrides };
  }, [capabilities, strategyOverrides]);

  // Generate loading plan
  const loadingPlan = useMemo(() => 
    generateContentLoadingPlan(strategy), 
    [strategy]
  );

  // Component loading method with progressive loading
  const loadComponent = useCallback(async (
    componentId: string, 
    priority: 'high' | 'normal' | 'low' = 'normal'
  ) => {
    const startTime = Date.now();
    
    try {
      // Dynamic import with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Component load timeout')), strategy.timeoutMs)
      );
      
      const loadPromise = import(/* webpackChunkName: "[request]" */ `../../components/${componentId}`);
      
      const result = await Promise.race([loadPromise, timeoutPromise]);
      
      // Update metrics
      setLoadingMetrics(prev => ({
        ...prev,
        totalLoadTime: prev.totalLoadTime + (Date.now() - startTime),
        componentsLoaded: prev.componentsLoaded + 1
      }));
      
      return result;
    } catch (error) {
      // Update failure metrics
      setLoadingMetrics(prev => ({
        ...prev,
        failedLoads: prev.failedLoads + 1
      }));
      
      if (strategy.gracefulDegradation) {
        // Return fallback component
        console.warn(`Failed to load component ${componentId}, using fallback:`, error);
        return null;
      }
      
      throw error;
    }
  }, [strategy.timeoutMs, strategy.gracefulDegradation]);

  // Content preloading method
  const preloadContent = useCallback(async (contentId: string) => {
    if (!strategy.enablePreload) return;
    
    try {
      // Use requestIdleCallback for non-blocking preload
      if ('requestIdleCallback' in window) {
        return new Promise<void>((resolve) => {
          window.requestIdleCallback(() => {
            loadComponent(contentId, 'low').then(() => resolve()).catch(() => resolve());
          });
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        await new Promise(resolve => setTimeout(resolve, 100));
        await loadComponent(contentId, 'low');
      }
    } catch (error) {
      // Preload failures should not break the app
      console.warn(`Preload failed for ${contentId}:`, error);
    }
  }, [strategy.enablePreload, loadComponent]);

  // Strategy adaptation method
  const adaptStrategy = useCallback((overrides: Partial<LoadingStrategy>) => {
    // This would trigger a re-render with new strategy
    // Implementation depends on state management approach
    console.log('Strategy adaptation requested:', overrides);
  }, []);

  // Performance reporting method
  const reportPerformance = useCallback((metrics: PerformanceEntry) => {
    if (enableDebug) {
      console.log('Performance metrics:', metrics);
    }
    
    // Update internal metrics
    setLoadingMetrics(prev => ({
      ...prev,
      networkUtilization: prev.networkUtilization + (metrics.duration || 0)
    }));
  }, [enableDebug]);

  // Get current metrics
  const getLoadingMetrics = useCallback(() => loadingMetrics, [loadingMetrics]);

  // Debug logging
  useEffect(() => {
    if (enableDebug && process.env.NODE_ENV === 'development') {
      console.group('🚀 Progressive Loading Strategy');
      console.log('Device Tier:', capabilities.deviceTier);
      console.log('Strategy:', strategy);
      console.log('Loading Plan:', loadingPlan);
      console.groupEnd();
    }
  }, [enableDebug, capabilities.deviceTier, strategy, loadingPlan]);

  const contextValue: ProgressiveLoadingContextValue = {
    capabilities,
    strategy,
    loadingPlan,
    loadComponent,
    preloadContent,
    adaptStrategy,
    getLoadingMetrics,
    reportPerformance
  };

  return (
    <ProgressiveLoadingContext.Provider value={contextValue}>
      {children}
    </ProgressiveLoadingContext.Provider>
  );
}

/**
 * Hook to access progressive loading context
 */
export function useProgressiveLoadingContext() {
  const context = useContext(ProgressiveLoadingContext);
  if (!context) {
    throw new Error('useProgressiveLoadingContext must be used within ProgressiveLoadingProvider');
  }
  return context;
}

/**
 * Hook for adaptive component loading
 */
export function useAdaptiveLoading<T>(
  componentId: string,
  priority: 'high' | 'normal' | 'low' = 'normal'
) {
  const { loadComponent, strategy } = useProgressiveLoadingContext();
  
  return useProgressiveLoading<T>(
    () => loadComponent(componentId, priority),
    {
      maxRetries: strategy.retryStrategy === 'disabled' ? 0 : 3,
      retryDelay: 1000,
      enableNetworkAwareness: true,
      enableProgressTracking: true,
      staleWhileRevalidate: true,
      backgroundRefresh: true
    }
  );
}

/**
 * Utility to check if a component should be loaded
 */
export function shouldLoadComponent(
  componentId: string,
  tier: DeviceTier,
  loadingPlan: ContentLoadingPlan
): boolean {
  // Check if component is in disabled list for this tier
  if (loadingPlan.disabled.includes(componentId)) return false;
  
  // For low-end devices, only load critical components initially
  if (tier === 'low-end') {
    return loadingPlan.immediate.includes(componentId);
  }
  
  // For other tiers, load immediate and priority components
  return loadingPlan.immediate.includes(componentId) || 
         loadingPlan.priority.includes(componentId);
}

export type { ProgressiveLoadingContextValue };
export default ProgressiveLoadingProvider;
