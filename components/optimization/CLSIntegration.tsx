/**
 * CLS Integration Helper
 * Easy integration of CLS fixes into existing pages
 */

import React from 'react';
import { CLSOptimizedPage } from './CLSOptimizedComponents';

/**
 * CLS Fix Integration for Homepage
 * Drop-in replacement for existing homepage
 */
export function CLSFixedHomepage() {
  return <CLSOptimizedPage />;
}

/**
 * HOC to wrap any page with CLS optimization
 */
export function withCLSOptimization<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  const CLSOptimizedComponent = (props: T) => {
    return (
      <div className="cls-optimized-wrapper">
        <style jsx global>{`
          /* Prevent font layout shifts */
          @font-face {
            font-family: 'Inter';
            font-display: swap;
            src: url('/fonts/inter.woff2') format('woff2');
          }
          
          /* Reserve space for loading states */
          .loading-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          
          /* CLS measurement styles */
          .cls-debug {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
          }
        `}</style>
        <WrappedComponent {...props} />
      </div>
    );
  };

  CLSOptimizedComponent.displayName = `withCLSOptimization(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return CLSOptimizedComponent;
}

/**
 * CLS Metrics Provider
 * Tracks and reports CLS metrics
 */
export function CLSMetricsProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Track CLS using Web Vitals API
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          console.log('Layout shift detected:', {
            value: (entry as any).value,
            sources: (entry as any).sources?.map((source: any) => ({
              node: source.node,
              currentRect: source.currentRect,
              previousRect: source.previousRect
            }))
          });
        }
      }
    });

    observer.observe({ entryTypes: ['layout-shift'] });

    // Web Vitals CLS tracking
    if (typeof window !== 'undefined') {
      try {
        // Fallback CLS measurement without web-vitals dependency
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          
          if (clsValue > 0.1) {
            console.warn('Poor CLS detected:', clsValue);
          } else if (clsValue > 0.025) {
            console.log('Needs improvement CLS:', clsValue);
          } else {
            console.log('Good CLS:', clsValue);
          }
        });

        observer.observe({ entryTypes: ['layout-shift'] });
        
        // Cleanup observer after 10 seconds
        setTimeout(() => {
          observer.disconnect();
          console.log('Final CLS Score:', clsValue);
        }, 10000);
      } catch (error) {
        console.log('CLS measurement not available in this browser');
      }
    }

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}

/**
 * Quick CLS Fix Utilities
 */
export const CLSUtils = {
  /**
   * Create aspect ratio container to prevent image shifts
   */
  createAspectRatioContainer: (aspectRatio: string) => ({
    position: 'relative' as const,
    width: '100%',
    aspectRatio,
    overflow: 'hidden' as const
  }),

  /**
   * Reserve space for dynamic content
   */
  reserveSpace: (dimensions: { width?: string | number; height?: string | number; minHeight?: string | number }) => ({
    ...dimensions,
    display: 'block'
  }),

  /**
   * Prevent font swap layout shifts
   */
  fontLoadingCSS: `
    @font-face {
      font-family: 'Primary';
      font-display: swap;
      src: local('Arial'), local('Helvetica');
    }
    
    body {
      font-family: 'Primary', 'Arial', sans-serif;
    }
  `,

  /**
   * Skeleton loading styles
   */
  skeletonCSS: `
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
};

/**
 * CLS-Safe Image Component
 * Drop-in replacement for Next.js Image
 */
export function CLSSafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  priority = false,
  ...props 
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  [key: string]: any;
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const aspectRatio = height / width;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: '100%', 
        aspectRatio: `${width} / ${height}`,
        backgroundColor: '#f5f5f5' 
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
    </div>
  );
}

/**
 * CLS Test Page
 * Use this to test CLS improvements
 */
export function CLSTestPage() {
  const [showDynamicContent, setShowDynamicContent] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowDynamicContent(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <CLSMetricsProvider>
      <div className="min-h-screen">
        <h1 className="text-4xl font-bold text-center py-8">CLS Test Page</h1>
        
        {/* Test image loading */}
        <section className="container mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold mb-4">Image Loading Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <CLSSafeImage
                key={i}
                src={`https://picsum.photos/400/300?random=${i}`}
                alt={`Test image ${i}`}
                width={400}
                height={300}
                className="rounded-lg shadow-md"
              />
            ))}
          </div>
        </section>

        {/* Test dynamic content */}
        <section className="container mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold mb-4">Dynamic Content Test</h2>
          <div 
            className="bg-white p-6 rounded-lg shadow-md"
            style={{ minHeight: '200px' }}
          >
            {showDynamicContent ? (
              <div>
                <h3 className="text-xl font-semibold mb-2">Dynamic Content Loaded</h3>
                <p>This content appeared without causing layout shift because we reserved space for it.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded skeleton"></div>
                <div className="h-4 bg-gray-200 rounded skeleton w-3/4"></div>
              </div>
            )}
          </div>
        </section>

        {/* CLS Debug Info */}
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg font-mono text-sm">
          <div>CLS Monitoring Active</div>
          <div>Check Console for CLS measurements</div>
        </div>
      </div>
    </CLSMetricsProvider>
  );
}

export default {
  CLSFixedHomepage,
  withCLSOptimization,
  CLSMetricsProvider,
  CLSUtils,
  CLSSafeImage,
  CLSTestPage
};
