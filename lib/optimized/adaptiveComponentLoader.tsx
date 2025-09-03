/**
 * Network-Aware Component Loader
 * Adapts component loading strategies based on device capabilities and network speed
 */

import React, { Suspense, lazy, ComponentType, useState, useEffect, useMemo } from 'react';

type NetworkSpeed = 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'unknown';

interface NetworkInfo {
  effectiveType: NetworkSpeed;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface LoadingStrategy {
  preloadComponents: string[];
  deferredComponents: string[];
  criticalComponents: string[];
  fallbackTimeout: number;
  maxConcurrentLoads: number;
}

interface AdaptiveLoadingOptions {
  fallbackComponent?: ComponentType;
  loadingComponent?: ComponentType;
  errorComponent?: ComponentType;
  networkAware?: boolean;
  preloadCritical?: boolean;
  enablePrefetch?: boolean;
  priority?: 'low' | 'normal' | 'high';
}

/**
 * Network detection hook with device capability analysis
 */
function useNetworkDetection(): NetworkInfo {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(() => {
    if (typeof navigator === 'undefined') {
      return { effectiveType: '4g', downlink: 10, rtt: 50, saveData: false };
    }

    const connection = (navigator as any)?.connection;
    return {
      effectiveType: connection?.effectiveType || '4g',
      downlink: connection?.downlink || 10,
      rtt: connection?.rtt || 50,
      saveData: connection?.saveData || false
    };
  });

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const connection = (navigator as any)?.connection;
    if (!connection) return;

    const updateNetworkInfo = () => {
      setNetworkInfo({
        effectiveType: connection.effectiveType || '4g',
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 50,
        saveData: connection.saveData || false
      });
    };

    connection.addEventListener('change', updateNetworkInfo);
    return () => connection.removeEventListener('change', updateNetworkInfo);
  }, []);

  return networkInfo;
}

/**
 * Device capability detection
 */
function useDeviceCapabilities() {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return { 
        isLowEndDevice: false, 
        memoryLimit: Infinity, 
        cpuCores: 4,
        supportsConcurrentLoading: true 
      };
    }

    // Memory detection
    const memory = (navigator as any)?.deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    // Low-end device heuristics
    const isLowEndDevice = memory <= 2 || hardwareConcurrency <= 2;
    
    return {
      isLowEndDevice,
      memoryLimit: memory * 1024, // Convert to MB
      cpuCores: hardwareConcurrency,
      supportsConcurrentLoading: !isLowEndDevice
    };
  }, []);
}

/**
 * Generate loading strategy based on network and device capabilities
 */
function generateLoadingStrategy(
  networkInfo: NetworkInfo, 
  deviceCapabilities: ReturnType<typeof useDeviceCapabilities>
): LoadingStrategy {
  const { effectiveType, saveData } = networkInfo;
  const { isLowEndDevice, supportsConcurrentLoading } = deviceCapabilities;

  // Conservative settings for slow networks and low-end devices
  if (['slow-2g', '2g'].includes(effectiveType) || isLowEndDevice || saveData) {
    return {
      preloadComponents: [], // No preloading
      deferredComponents: ['testimonials', 'slideshow', 'modal', 'animations'],
      criticalComponents: ['header', 'navigation', 'content'],
      fallbackTimeout: 8000,
      maxConcurrentLoads: 1
    };
  }

  // Moderate settings for 3G networks
  if (effectiveType === '3g') {
    return {
      preloadComponents: ['menu', 'hero'],
      deferredComponents: ['testimonials', 'slideshow', 'modal'],
      criticalComponents: ['header', 'navigation', 'content', 'menu'],
      fallbackTimeout: 5000,
      maxConcurrentLoads: supportsConcurrentLoading ? 2 : 1
    };
  }

  // Aggressive settings for fast networks
  return {
    preloadComponents: ['menu', 'hero', 'testimonials', 'slideshow'],
    deferredComponents: ['modal', 'admin'],
    criticalComponents: ['header', 'navigation', 'content', 'menu', 'hero'],
    fallbackTimeout: 3000,
    maxConcurrentLoads: supportsConcurrentLoading ? 4 : 2
  };
}

/**
 * Component registry for dynamic loading
 */
class ComponentRegistry {
  private components = new Map<string, () => Promise<{ default: ComponentType }>>();
  private loadedComponents = new Set<string>();
  private loadingComponents = new Set<string>();
  private loadingStrategy: LoadingStrategy;

  constructor(strategy: LoadingStrategy) {
    this.loadingStrategy = strategy;
    this.setupIdlePreloading();
  }

  register(name: string, loader: () => Promise<{ default: ComponentType }>) {
    this.components.set(name, loader);
  }

  private setupIdlePreloading() {
    if (typeof window === 'undefined' || !('requestIdleCallback' in window)) return;

    window.requestIdleCallback(() => {
      this.preloadCriticalComponents();
    });
  }

  private async preloadCriticalComponents() {
    const { preloadComponents, maxConcurrentLoads } = this.loadingStrategy;
    
    // Preload in batches to avoid overwhelming low-end devices
    for (let i = 0; i < preloadComponents.length; i += maxConcurrentLoads) {
      const batch = preloadComponents.slice(i, i + maxConcurrentLoads);
      
      await Promise.allSettled(
        batch.map(async (componentName) => {
          if (!this.loadedComponents.has(componentName)) {
            try {
              const loader = this.components.get(componentName);
              if (loader) {
                await loader();
                this.loadedComponents.add(componentName);
              }
            } catch (error) {
              console.debug(`Preload failed for ${componentName}:`, error);
            }
          }
        })
      );

      // Small delay between batches for low-end devices
      if (i + maxConcurrentLoads < preloadComponents.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  async loadComponent(name: string, priority: 'low' | 'normal' | 'high' = 'normal') {
    if (this.loadedComponents.has(name)) {
      return this.components.get(name);
    }

    if (this.loadingComponents.has(name)) {
      // Return a promise that waits for the component to load
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (this.loadedComponents.has(name)) {
            resolve(this.components.get(name));
          } else {
            setTimeout(checkLoaded, 50);
          }
        };
        checkLoaded();
      });
    }

    this.loadingComponents.add(name);

    try {
      const loader = this.components.get(name);
      if (loader) {
        await loader();
        this.loadedComponents.add(name);
        return loader;
      }
    } catch (error) {
      console.error(`Failed to load component ${name}:`, error);
      throw error;
    } finally {
      this.loadingComponents.delete(name);
    }

    return null;
  }

  updateStrategy(strategy: LoadingStrategy) {
    this.loadingStrategy = strategy;
  }
}

// Global component registry
let componentRegistry: ComponentRegistry;

/**
 * Network-aware dynamic component loader
 */
export function createAdaptiveLoader<Props = {}>(
  name: string,
  loader: () => Promise<{ default: ComponentType<Props> }>,
  options: AdaptiveLoadingOptions = {}
): ComponentType<Props> {
  const {
    fallbackComponent,
    loadingComponent,
    errorComponent,
    networkAware = true,
    preloadCritical = true,
    enablePrefetch = true,
    priority = 'normal'
  } = options;

  // Default components
  const DefaultLoading = loadingComponent || (() => (
    <div className="animate-pulse">
      <div className="h-32 bg-neutral-200 rounded-lg mb-4" />
      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-neutral-200 rounded w-1/2" />
    </div>
  ));

  const DefaultError = errorComponent || (({ error }: { error?: Error }) => (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
      <p className="text-red-800 text-sm">Failed to load component{error ? `: ${error.message}` : ''}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 text-xs text-red-600 hover:text-red-800"
      >
        Retry
      </button>
    </div>
  ));

  // Create lazy component with error boundary
  const LazyComponent = lazy(async () => {
    try {
      const component = await loader();
      
      // Mark as successfully loaded
      if (componentRegistry) {
        componentRegistry['loadedComponents']?.add(name);
      }
      
      return component;
    } catch (error) {
      console.error(`Component loading failed: ${name}`, error);
      
      // Return fallback component if available
      if (fallbackComponent) {
        return { default: fallbackComponent };
      }
      
      throw error;
    }
  });

  // Adaptive wrapper component
  const AdaptiveComponent: ComponentType<Props> = (props) => {
    const networkInfo = useNetworkDetection();
    const deviceCapabilities = useDeviceCapabilities();
    const loadingStrategy = generateLoadingStrategy(networkInfo, deviceCapabilities);

    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Initialize global registry
    useEffect(() => {
      if (!componentRegistry) {
        componentRegistry = new ComponentRegistry(loadingStrategy);
      } else {
        componentRegistry.updateStrategy(loadingStrategy);
      }
      
      componentRegistry.register(name, loader);
    }, [loadingStrategy]);

    // Prefetch on interaction or idle for high priority components
    useEffect(() => {
      if (enablePrefetch && priority === 'high') {
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            componentRegistry?.loadComponent(name, priority).catch(() => {
              // Silent prefetch failure
            });
          });
        }
      }
    }, [priority]);

    // Check if component should be deferred on slow networks
    const shouldDefer = useMemo(() => {
      const { effectiveType, saveData } = networkInfo;
      const { isLowEndDevice } = deviceCapabilities;
      
      return (
        networkAware && 
        (['slow-2g', '2g'].includes(effectiveType) || isLowEndDevice || saveData) &&
        priority === 'low' &&
        loadingStrategy.deferredComponents.includes(name)
      );
    }, [networkInfo, deviceCapabilities, priority, loadingStrategy, networkAware]);

    if (shouldDefer) {
      return fallbackComponent ? React.createElement(fallbackComponent, props) : null;
    }

    if (hasError) {
      const ErrorComponent = DefaultError as ComponentType<{ error?: Error }>;
      return React.createElement(ErrorComponent, { error: error || undefined });
    }

    const fallbackTimeout = loadingStrategy.fallbackTimeout;

    return (
      <Suspense
        fallback={
          <div>
            <DefaultLoading />
            {/* Timeout fallback for very slow networks */}
            <TimeoutFallback
              timeout={fallbackTimeout}
              onTimeout={() => {
                if (fallbackComponent) {
                  return React.createElement(fallbackComponent, props);
                }
              }}
            />
          </div>
        }
      >
        <ErrorBoundary
          onError={(error) => {
            setHasError(true);
            setError(error);
          }}
        >
          <LazyComponent {...props} />
        </ErrorBoundary>
      </Suspense>
    );
  };

  AdaptiveComponent.displayName = `Adaptive(${name})`;
  return AdaptiveComponent;
}

/**
 * Timeout fallback component
 */
const TimeoutFallback: React.FC<{ 
  timeout: number; 
  onTimeout?: () => React.ReactElement | null; 
}> = ({ timeout, onTimeout }) => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  if (showTimeout && onTimeout) {
    return onTimeout();
  }

  return null;
};

/**
 * Error boundary for component loading
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

/**
 * Hook for component loading metrics and control
 */
export function useAdaptiveLoading() {
  const networkInfo = useNetworkDetection();
  const deviceCapabilities = useDeviceCapabilities();
  const loadingStrategy = generateLoadingStrategy(networkInfo, deviceCapabilities);

  return {
    networkInfo,
    deviceCapabilities,
    loadingStrategy,
    isLowEndDevice: deviceCapabilities.isLowEndDevice,
    isSlowNetwork: ['slow-2g', '2g', '3g'].includes(networkInfo.effectiveType),
    shouldDeferLoading: (componentName: string) => {
      return loadingStrategy.deferredComponents.includes(componentName);
    },
    preloadComponent: (componentName: string) => {
      return componentRegistry?.loadComponent(componentName, 'high');
    }
  };
}

// Component creation helpers for common patterns
export const AdaptiveLazy = {
  /**
   * Critical component (always loads)
   */
  critical: <Props = {}>(
    name: string,
    loader: () => Promise<{ default: ComponentType<Props> }>
  ) => createAdaptiveLoader(name, loader, { priority: 'high', preloadCritical: true }),

  /**
   * Normal priority component
   */
  normal: <Props = {}>(
    name: string,
    loader: () => Promise<{ default: ComponentType<Props> }>
  ) => createAdaptiveLoader(name, loader, { priority: 'normal' }),

  /**
   * Low priority component (deferred on slow networks)
   */
  deferred: <Props = {}>(
    name: string,
    loader: () => Promise<{ default: ComponentType<Props> }>,
    fallback?: ComponentType<Props>
  ) => createAdaptiveLoader(name, loader, { 
    priority: 'low', 
    fallbackComponent: fallback,
    networkAware: true 
  })
};

export default createAdaptiveLoader;
