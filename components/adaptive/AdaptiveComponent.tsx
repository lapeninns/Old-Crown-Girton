/**
 * Adaptive Component Loader
 * Dynamically loads components based on device capabilities and loading strategy
 */

import React, { Suspense, lazy, ComponentType, useMemo, useCallback } from 'react';
import { useProgressiveLoadingContext, shouldLoadComponent } from '../../hooks/optimized/useProgressiveLoadingCoordinator';

interface AdaptiveComponentProps {
  componentId: string;
  fallback?: React.ReactNode;
  priority?: 'high' | 'normal' | 'low';
  placeholder?: React.ReactNode;
  errorBoundary?: ComponentType<{ error: Error; retry: () => void }>;
  defer?: boolean; // Load only when needed
  preload?: boolean; // Preload in background
}

interface ComponentRegistry {
  [key: string]: () => Promise<{ default: ComponentType<any> }>;
}

/**
 * Component registry - maps component IDs to dynamic imports
 * Only includes components with default exports for proper lazy loading
 */
const COMPONENT_REGISTRY: ComponentRegistry = {
  // Navigation components
  'header': () => import('../../components/Header'),
  'footer': () => import('../../components/Footer'),
  
  // Content components  
  'hero': () => import('../../components/Hero'),
  'menu-interactive': () => import('../../components/menu/MenuInteractive'),
  'testimonials': () => import('../../components/Testimonials1'),
  'slideshow': () => import('../../components/slideshow/Slideshow'),
  
  // Interactive components
  'modal': () => import('../../components/Modal'),
  
  // Marketing components
  'cta': () => import('../../components/CTA'),
  'pricing': () => import('../../components/Pricing'),
  'features': () => import('../../components/FeaturesGrid'),
  'faq': () => import('../../components/FAQ'),
  
  // Layout components
  'client-home': () => import('../../components/ClientHomeContent')
};

/**
 * Error Boundary for component loading failures
 */
class ComponentErrorBoundary extends React.Component<
  { 
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error) => void;
  },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component loading error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center text-gray-500 bg-gray-50 rounded">
          <p>Component temporarily unavailable</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-sm underline text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple loading placeholder component
 */
function LoadingPlaceholder({ 
  className = '',
  height = '200px',
  variant = 'rectangular'
}: {
  className?: string;
  height?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}) {
  const baseClasses = 'animate-pulse bg-gray-200';
  
  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4'
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ height }}
      aria-label="Loading content..."
    />
  );
}

/**
 * Adaptive Component Loader
 */
export function AdaptiveComponent({
  componentId,
  fallback,
  priority = 'normal',
  placeholder,
  errorBoundary: ErrorBoundaryComponent,
  defer = false,
  preload = false,
  ...props
}: AdaptiveComponentProps & any) {
  const { capabilities, strategy, loadingPlan, preloadContent } = useProgressiveLoadingContext();

  // Check if component should be loaded based on device tier and strategy
  const shouldLoad = useMemo(() => {
    if (defer) return false; // Deferred components load only when explicitly triggered
    
    return shouldLoadComponent(componentId, capabilities.deviceTier, loadingPlan);
  }, [componentId, capabilities.deviceTier, loadingPlan, defer]);

  // Create lazy component with adaptive loading
  const LazyComponent = useMemo(() => {
    if (!shouldLoad) return null;

    const importFn = COMPONENT_REGISTRY[componentId];
    if (!importFn) {
      console.warn(`Component ${componentId} not found in registry`);
      return null;
    }

    return lazy(() => {
      // Add timeout for component loading
      const timeoutMs = strategy.timeoutMs;
      
      const loadPromise = importFn();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Component ${componentId} load timeout`)), timeoutMs)
      );

      return Promise.race([loadPromise, timeoutPromise]).catch(error => {
        console.error(`Failed to load component ${componentId}:`, error);
        
        // Return a fallback component for graceful degradation
        return {
          default: () => (
            <div className="p-4 text-center text-gray-500 bg-gray-50 rounded">
              <p>Content temporarily unavailable</p>
            </div>
          )
        };
      });
    });
  }, [componentId, shouldLoad, strategy.timeoutMs]);

  // Preload component if requested and supported
  const handlePreload = useCallback(() => {
    if (preload && strategy.enablePreload) {
      preloadContent(componentId).catch(error => 
        console.warn(`Preload failed for ${componentId}:`, error)
      );
    }
  }, [preload, strategy.enablePreload, preloadContent, componentId]);

  // Trigger preload on mount for high priority components
  React.useEffect(() => {
    if (priority === 'high' || loadingPlan.immediate.includes(componentId)) {
      handlePreload();
    }
  }, [priority, loadingPlan.immediate, componentId, handlePreload]);

  // Don't render anything if component shouldn't load
  if (!shouldLoad || !LazyComponent) {
    return null;
  }

  // Generate appropriate placeholder
  const defaultPlaceholder = placeholder || (
    <LoadingPlaceholder 
      className="w-full"
      height={getPlaceholderHeight(componentId)}
    />
  );

  // Generate appropriate fallback
  const defaultFallback = fallback || defaultPlaceholder;

  // Wrap in error boundary if provided
  const ComponentWithErrorBoundary = ErrorBoundaryComponent ? (
    <ErrorBoundaryComponent 
      error={new Error('Component load failed')} 
      retry={() => window.location.reload()}
    >
      <Suspense fallback={defaultFallback}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundaryComponent>
  ) : (
    <ComponentErrorBoundary fallback={defaultFallback}>
      <Suspense fallback={defaultFallback}>
        <LazyComponent {...props} />
      </Suspense>
    </ComponentErrorBoundary>
  );

  return ComponentWithErrorBoundary;
}

/**
 * Get appropriate placeholder height based on component type
 */
function getPlaceholderHeight(componentId: string): string {
  const heightMap: Record<string, string> = {
    'header': '80px',
    'navigation': '60px',
    'hero': '400px',
    'menu': '600px',
    'testimonials': '300px',
    'slideshow': '400px',
    'footer': '200px',
    'modal': '300px',
    'contact-form': '400px',
    'cta': '150px',
    'pricing': '500px',
    'features': '400px'
  };

  return heightMap[componentId] || '200px';
}

/**
 * Hook for manual component loading (for deferred components)
 */
export function useDeferredComponent(componentId: string) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const { loadComponent } = useProgressiveLoadingContext();

  const loadNow = useCallback(async () => {
    try {
      await loadComponent(componentId);
      setIsLoaded(true);
    } catch (error) {
      console.error(`Failed to load deferred component ${componentId}:`, error);
    }
  }, [componentId, loadComponent]);

  return { isLoaded, loadNow };
}

/**
 * Component for rendering critical components immediately
 */
export function CriticalComponent({ 
  componentId, 
  ...props 
}: AdaptiveComponentProps & any) {
  return (
    <AdaptiveComponent 
      componentId={componentId}
      priority="high"
      defer={false}
      preload={true}
      {...props}
    />
  );
}

/**
 * Component for rendering non-critical components with lazy loading
 */
export function LazyComponent({ 
  componentId, 
  ...props 
}: AdaptiveComponentProps & any) {
  return (
    <AdaptiveComponent 
      componentId={componentId}
      priority="normal"
      defer={false}
      preload={false}
      {...props}
    />
  );
}

/**
 * Component for rendering low-priority components that load in background
 */
export function BackgroundComponent({ 
  componentId, 
  ...props 
}: AdaptiveComponentProps & any) {
  return (
    <AdaptiveComponent 
      componentId={componentId}
      priority="low"
      defer={true}
      preload={true}
      {...props}
    />
  );
}

/**
 * Higher-order component for making any component adaptive
 */
export function withAdaptiveLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentId: string,
  options: Partial<AdaptiveComponentProps> = {}
) {
  return function AdaptiveWrappedComponent(props: P) {
    const { capabilities } = useProgressiveLoadingContext();
    
    // For high-end devices, render directly without lazy loading overhead
    if (capabilities.deviceTier === 'premium' || capabilities.deviceTier === 'high-end') {
      return <WrappedComponent {...props} />;
    }
    
    // For other devices, use adaptive loading
    return (
      <AdaptiveComponent 
        componentId={componentId}
        {...options}
        component={WrappedComponent}
        {...props}
      />
    );
  };
}

export default AdaptiveComponent;
