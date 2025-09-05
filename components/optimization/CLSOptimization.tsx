"use client";

/**
 * CLS (Cumulative Layout Shift) Optimization System
 * Prevents layout shifts through dimension reservation and progressive loading
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface CLSMetrics {
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  entries: PerformanceEntry[];
}

export interface DimensionReservation {
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  minHeight?: number | string;
}

/**
 * CLS-Optimized Image Component
 * Reserves space before loading to prevent layout shifts
 */
interface CLSImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty' | React.ReactNode;
  blurDataURL?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function CLSImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  onLoad,
  onError
}: CLSImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Calculate aspect ratio for consistent spacing
  const aspectRatio = (height / width) * 100;

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Render placeholder with exact dimensions
  const renderPlaceholder = () => {
    if (placeholder === 'empty') {
      return null;
    }

    if (React.isValidElement(placeholder)) {
      return placeholder;
    }

    // Default blur placeholder
    return (
      <div
        className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
        style={{
          backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(5px)'
        }}
      >
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        aspectRatio: `${width} / ${height}`
      }}
    >
      {/* Reserved space container - prevents CLS */}
      <div
        className="relative w-full"
        style={{ paddingBottom: `${aspectRatio}%` }}
      >
        {/* Placeholder */}
        {!isLoaded && !hasError && renderPlaceholder()}
        
        {/* Actual image */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
        
        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-sm text-center">
              <div>Image unavailable</div>
              <button 
                onClick={() => {
                  setHasError(false);
                  setIsLoaded(false);
                }}
                className="mt-2 text-xs text-blue-600 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * CLS-Optimized Container Component
 * Reserves space for dynamic content
 */
interface CLSContainerProps {
  children: React.ReactNode;
  dimensions: DimensionReservation;
  className?: string;
  loading?: boolean;
  placeholder?: React.ReactNode;
}

export function CLSContainer({
  children,
  dimensions,
  className = '',
  loading = false,
  placeholder
}: CLSContainerProps) {
  const containerStyle: React.CSSProperties = {
    width: dimensions.width,
    height: dimensions.height,
    minHeight: dimensions.minHeight,
    aspectRatio: dimensions.aspectRatio
  };

  if (loading) {
    return (
      <div className={`${className}`} style={containerStyle}>
        {placeholder || <CLSPlaceholder dimensions={dimensions} />}
      </div>
    );
  }

  return (
    <div className={`${className}`} style={containerStyle}>
      {children}
    </div>
  );
}

/**
 * Generic placeholder component that maintains dimensions
 */
interface CLSPlaceholderProps {
  dimensions: DimensionReservation;
  variant?: 'rectangular' | 'circular' | 'text' | 'card';
  className?: string;
}

export function CLSPlaceholder({
  dimensions,
  variant = 'rectangular',
  className = ''
}: CLSPlaceholderProps) {
  const baseClasses = 'animate-pulse bg-gray-200';
  
  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
    card: 'rounded-lg'
  };

  const style: React.CSSProperties = {
    width: dimensions.width,
    height: dimensions.height,
    minHeight: dimensions.minHeight,
    aspectRatio: dimensions.aspectRatio
  };

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${variantClasses[variant]} ${className} p-4 space-y-3`} style={style}>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        <div className="h-8 bg-gray-300 rounded w-1/3 mt-4"></div>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

/**
 * CLS measurement and monitoring hook
 */
export function useCLSMeasurement() {
  const [clsMetrics, setCLSMetrics] = useState<CLSMetrics>({
    value: 0,
    rating: 'good',
    entries: []
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];

    // Modern Layout Shift API
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift') {
          const layoutShiftEntry = entry as any;
          
          // Only count unexpected layout shifts (not user-initiated)
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
            clsEntries.push(entry);
          }
        }
      }

      // Determine rating based on Core Web Vitals thresholds
      let rating: 'good' | 'needs-improvement' | 'poor';
      if (clsValue <= 0.1) rating = 'good';
      else if (clsValue <= 0.25) rating = 'needs-improvement';
      else rating = 'poor';

      setCLSMetrics({
        value: clsValue,
        rating,
        entries: clsEntries
      });
    });

    try {
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
      console.warn('Layout Shift API not supported:', error);
    }

    return () => observer.disconnect();
  }, []);

  return clsMetrics;
}

/**
 * CLS Debug Component for Development
 */
export function CLSDebugger() {
  const clsMetrics = useCLSMeasurement();
  const [isVisible, setIsVisible] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed bottom-4 left-4 px-3 py-2 rounded-lg text-sm font-medium z-50 ${getRatingColor(clsMetrics.rating)}`}
      >
        CLS: {clsMetrics.value.toFixed(3)} ({clsMetrics.rating})
      </button>

      {isVisible && (
        <div className="fixed bottom-16 left-4 bg-white border shadow-lg rounded-lg p-4 z-50 max-w-sm">
          <h3 className="font-bold text-lg mb-3">CLS Debug Info</h3>
          
          <div className="space-y-2 text-sm">
            <div>
              <strong>Current CLS:</strong> {clsMetrics.value.toFixed(3)}
            </div>
            <div>
              <strong>Rating:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${getRatingColor(clsMetrics.rating)}`}>
                {clsMetrics.rating}
              </span>
            </div>
            <div>
              <strong>Shifts Detected:</strong> {clsMetrics.entries.length}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t">
            <h4 className="font-medium mb-2">Thresholds:</h4>
            <div className="text-xs space-y-1">
              <div className="text-green-600">Good: ≤ 0.1</div>
              <div className="text-yellow-600">Needs Improvement: 0.1 - 0.25</div>
              <div className="text-red-600">Poor: {'>'}0.25</div>
            </div>
          </div>

          {clsMetrics.entries.length > 0 && (
            <div className="mt-4 pt-3 border-t">
              <h4 className="font-medium mb-2">Recent Shifts:</h4>
              <div className="max-h-32 overflow-y-auto text-xs space-y-1">
                {clsMetrics.entries.slice(-5).map((entry, index) => (
                  <div key={index} className="text-gray-600">
                    {(entry as any).value?.toFixed(3)} at {entry.startTime.toFixed(0)}ms
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/**
 * Font loading optimization to prevent CLS
 */
export function useFontOptimization() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('fonts' in document)) return;

    // Preload critical fonts
    const criticalFonts = [
      'Inter',
      'system-ui',
      '-apple-system'
    ];

    criticalFonts.forEach(fontFamily => {
      if (document.fonts.check(`1em ${fontFamily}`)) {
        // Font is already loaded
        return;
      }

      // Load font and add fallback class during loading
      document.fonts.load(`1em ${fontFamily}`).then(() => {
        document.documentElement.classList.add('fonts-loaded');
      }).catch(() => {
        // Fallback fonts will be used
        document.documentElement.classList.add('fonts-fallback');
      });
    });

    // Set timeout for font loading
    setTimeout(() => {
      if (!document.documentElement.classList.contains('fonts-loaded')) {
        document.documentElement.classList.add('fonts-timeout');
      }
    }, 3000);
  }, []);
}

/**
 * CLS-optimized layout components
 */
export const CLSOptimizedLayouts = {
  /**
   * Hero section with reserved space
   */
  Hero: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <CLSContainer
      dimensions={{ height: '400px', width: '100%' }}
      className={`hero-section ${className}`}
    >
      {children}
    </CLSContainer>
  ),

  /**
   * Menu grid with consistent sizing
   */
  MenuGrid: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <CLSContainer
      dimensions={{ minHeight: '600px', width: '100%' }}
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {children}
    </CLSContainer>
  ),

  /**
   * Testimonials section
   */
  Testimonials: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <CLSContainer
      dimensions={{ minHeight: '300px', width: '100%' }}
      className={`testimonials-section ${className}`}
    >
      {children}
    </CLSContainer>
  )
};

export default {
  CLSImage,
  CLSContainer,
  CLSPlaceholder,
  CLSDebugger,
  useCLSMeasurement,
  useFontOptimization,
  CLSOptimizedLayouts
};
