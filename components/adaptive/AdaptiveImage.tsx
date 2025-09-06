/**
 * Adaptive Image Component
 * Progressively loads images based on device capabilities and network conditions
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useProgressiveLoadingContext } from '../../hooks/optimized/useProgressiveLoadingCoordinator';
import { getSharedObserver, createFallbackObserver, observe } from '@/src/lib/lazy/intersection';
import LoadQueue from '@/src/lib/lazy/loadQueue';

const LAZY_V2 = process.env.NEXT_PUBLIC_LAZY_V2 === 'true';

interface AdaptiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  lazy?: boolean;
  sizes?: string;
  quality?: number;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
  onVisible?: () => void;
}

interface ImageVariant {
  src: string;
  width: number;
  quality: number;
  format: 'webp' | 'jpeg' | 'png' | 'avif';
  avif?: string;
  webp?: string;
}

/**
 * Generate responsive image variants based on device capabilities
 */
function generateImageVariants(
  baseSrc: string,
  capabilities: any,
  strategy: any,
  qualityOverride?: number
): ImageVariant[] {
  const { shouldUseWebP, recommendedImageQuality } = capabilities;
  const { imageSizes, imageQuality } = strategy;
  
  const quality = qualityOverride || imageQuality || recommendedImageQuality;
  const formats: ('webp' | 'jpeg' | 'png')[] = shouldUseWebP ? ['webp', 'jpeg'] : ['jpeg'];
  
  const variants: ImageVariant[] = [];
  
  for (const format of formats) {
    for (const width of imageSizes) {
      variants.push({
        src: generateOptimizedSrc(baseSrc, width, quality, format),
        width,
        quality,
        format
      });
    }
  }
  
  return variants.sort((a, b) => a.width - b.width);
}

/**
 * Generate optimized image URL (placeholder implementation)
 * In production, this would integrate with your CDN/image optimization service
 */
function generateOptimizedSrc(
  baseSrc: string,
  width: number,
  quality: number,
  format: 'webp' | 'jpeg' | 'png'
): string {
  // This is a placeholder - replace with your actual image optimization logic
  const qualityParam = Math.round(quality * 100);
  
  // Example URL pattern for Next.js Image Optimization
  if (baseSrc.startsWith('/')) {
    return `/_next/image?url=${encodeURIComponent(baseSrc)}&w=${width}&q=${qualityParam}&f=${format}`;
  }
  
  // For external URLs, you might use a service like Cloudinary, ImageKit, etc.
  return baseSrc;
}

/**
 * Create responsive srcSet from image variants
 */
function createSrcSet(variants: ImageVariant[]): string {
  return variants
    .map(variant => `${variant.src} ${variant.width}w`)
    .join(', ');
}

/**
 * Adaptive Image Component with Progressive Loading
 */
export function AdaptiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fallbackSrc,
  placeholder,
  onLoad,
  onError,
  lazy = true,
  sizes,
  quality,
  root,
  rootMargin = '300px 0px',
  threshold = 0,
  once = true,
  onVisible
}: AdaptiveImageProps) {
  const { capabilities, strategy } = useProgressiveLoadingContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const queueRef = useRef(new LoadQueue());

  // Generate image variants based on device capabilities
  const imageVariants = useMemo(() => 
    generateImageVariants(src, capabilities, strategy, quality),
    [src, capabilities, strategy, quality]
  );

  // Create srcSet and sizes
  const srcSet = useMemo(() => createSrcSet(imageVariants), [imageVariants]);
  const imageSizes = sizes || `
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  `;

  // Adaptive config
  const config = useMemo(() => ({
    root,
    rootMargin: getAdaptiveRootMargin(rootMargin),
    threshold
  }), [root, rootMargin, threshold]);

  // Enhanced loadImage with queue, retries, abort
  const loadImage = useCallback(async (retryCount = 0) => {
    if (isLoaded || hasError || !isInView) return;
    const controller = new AbortController();
    const task = async () => {
      try {
        // Use the best variant for current device
        const optimalVariant = imageVariants[0]; // Start with smallest/most optimized
        
        // Create a new image element for preloading
        const img = new Image();
        
        // Set up timeout for slow networks
        const timeoutMs = strategy.timeoutMs || 5000;
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Image load timeout')), timeoutMs)
        );

        // Set up image load promise
        const loadPromise = new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Image failed to load'));
          
          // Use srcSet for responsive loading
          if (srcSet && img.srcset !== undefined) {
            img.srcset = srcSet;
            img.sizes = imageSizes;
          }
          img.src = optimalVariant.src;
          img.decoding = 'async';
          if (priority) img.fetchPriority = 'high';
        });

        // Race between load and timeout
        await Promise.race([loadPromise, timeoutPromise]);
        
        // If successful, update the display image
        setCurrentSrc(optimalVariant.src);
        setIsLoaded(true);
        onLoad?.();
        onVisible?.();
      } catch (error) {
        if (retryCount < 2 && !controller.signal.aborted) {
          // Retry with backoff
          setTimeout(() => loadImage(retryCount + 1), Math.pow(2, retryCount) * 100);
        } else {
          console.warn('Image loading failed after retries:', error);
          // Try fallback if available
          if (fallbackSrc && !hasError) {
            setCurrentSrc(fallbackSrc);
            setIsLoaded(true);
          } else {
            setHasError(true);
            onError?.(error as Error);
          }
        }
      }
    };
    queueRef.current.add(task);
    return controller;
  }, [
    isLoaded,
    hasError,
    isInView,
    imageVariants,
    srcSet,
    imageSizes,
    strategy.timeoutMs,
    fallbackSrc,
    onLoad,
    onError,
    onVisible,
    priority
  ]);

  // IO with shared observer
  useEffect(() => {
    if (!lazy || priority || !imgRef.current) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setIsInView(true);
        loadImage();
        if (once) unobserveRef.current?.();
      }
    };

    let unobserve: () => void;
    if ('IntersectionObserver' in window && LAZY_V2) {
      unobserve = observe(imgRef.current, callback, config);
    } else {
      // Fallback
      unobserve = createFallbackObserver(imgRef.current, ([entry]) => callback([entry]), config);
    }
    unobserveRef.current = unobserve;

    return unobserve;
  }, [lazy, priority, config, loadImage, once]);

  // Cleanup on unmount
  useEffect(() => () => {
    queueRef.current.abortAll();
    unobserveRef.current?.();
  }, []);

  // CLS prevention: aspect-ratio style
  const style = useMemo(() => ({
    aspectRatio: width && height ? `${width}/${height}` : undefined,
    width: `${width}px`,
    height: `${height}px`
  }), [width, height]);

  // Enhanced srcset with AVIF/WebP if supported
  const enhancedSrcSet = useMemo(() => {
    if (supportsAVIF()) {
      return imageVariants.map(v => `${v.avif || v.src} 1x`).join(', ');
    }
    return createSrcSet(imageVariants); // Existing
  }, [imageVariants]);

  // Show placeholder while loading
  if (!isInView || (!isLoaded && !hasError)) {
    return (
      <div 
        ref={imgRef}
        className={`adaptive-image-placeholder ${className}`}
        style={{ width, height }}
        aria-label={`Loading ${alt}`}
      >
        {placeholder || (
          <div 
            className="bg-transparent"
            style={{ width: width || '100%', height: height || '200px' }}
          />
        )}
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div 
        className={`adaptive-image-error ${className}`}
        style={{ width, height }}
        aria-label={`Failed to load ${alt}`}
      >
        <div className="flex items-center justify-center bg-gray-100 text-gray-400 text-sm p-4">
          Image unavailable
        </div>
      </div>
    );
  }

  // Render the loaded image
  return (
    <div className={className} style={{ containIntrinsicSize: `${height}px ${width}px` }}>
      {placeholder || <div style={{ aspectRatio: style.aspectRatio }} className="bg-gray-200 animate-pulse" />}
      <img
        ref={imgRef}
        src={priority ? src : ''} // Delay src set
        srcSet={enhancedSrcSet}
        sizes={imageSizes}
        alt={alt}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        style={style}
        onLoad={() => {/* handle */}}
        onError={() => {/* handle */}}
      />
    </div>
  );
}

const unobserveRef = useRef<() => void>(null);

/**
 * Hook for adaptive image preloading
 */
export function useImagePreloader() {
  const { capabilities, strategy } = useProgressiveLoadingContext();

  const preloadImage = useCallback(async (src: string, priority: 'high' | 'normal' | 'low' = 'normal') => {
    if (!strategy.enablePreload) return;

    const variants = generateImageVariants(src, capabilities, strategy);
    const optimalVariant = variants[0];

    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Preload failed'));
      
      // For high priority, start loading immediately
      if (priority === 'high') {
        img.src = optimalVariant.src;
      } else {
        // For normal/low priority, use requestIdleCallback
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            img.src = optimalVariant.src;
          });
        } else {
          setTimeout(() => {
            img.src = optimalVariant.src;
          }, 100);
        }
      }
    });
  }, [capabilities, strategy]);

  return { preloadImage };
}

function getAdaptiveRootMargin(base: string): string {
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    if (conn.saveData || ['slow-2g', '2g'].includes(conn.effectiveType)) {
      return base.replace('300', '100'); // Tighten on slow
    }
  }
  return base; // Widen on fast
}

// AVIF support check
const supportsAVIF = () => {
  return 'HTMLCanvasElement' in window && (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif', 1.0) === 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAG1pbmZ...'; // Simplified check
  })();
};

function createSrcSetWithFormats(variants: any[]) {
  // Generate srcset with webp/avif fallbacks
  // e.g., `${variant.webp} 1x, ${variant.avif} 1x`
  return variants.map(v => `${v.src} 1x`).join(', ');
}

export default AdaptiveImage;
