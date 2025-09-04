/**
 * Adaptive Image Component
 * Progressively loads images based on device capabilities and network conditions
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useProgressiveLoadingContext } from '../../hooks/optimized/useProgressiveLoadingCoordinator';

interface AdaptiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: 'high' | 'normal' | 'low';
  fallbackSrc?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  lazy?: boolean;
  sizes?: string;
  quality?: number; // Override quality (0.1-1.0)
}

interface ImageVariant {
  src: string;
  width: number;
  quality: number;
  format: 'webp' | 'jpeg' | 'png';
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
  priority = 'normal',
  fallbackSrc,
  placeholder,
  onLoad,
  onError,
  lazy = true,
  sizes,
  quality
}: AdaptiveImageProps) {
  const { capabilities, strategy } = useProgressiveLoadingContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const currentImgRef = imgRef.current;
    if (!currentImgRef) return;

    // Use larger threshold for slow networks to start loading earlier
    const rootMargin = strategy.lazyLoadThreshold || 100;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: `${rootMargin}px`,
        threshold: 0.1
      }
    );

    observerRef.current.observe(currentImgRef);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, isInView, strategy.lazyLoadThreshold]);

  // Progressive image loading with fallbacks
  const loadImage = useCallback(async () => {
    if (!isInView || isLoaded || hasError) return;

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
      });

      // Race between load and timeout
      await Promise.race([loadPromise, timeoutPromise]);
      
      // If successful, update the display image
      setCurrentSrc(optimalVariant.src);
      setIsLoaded(true);
      onLoad?.();
      
    } catch (error) {
      console.warn('Image loading failed:', error);
      
      // Try fallback if available
      if (fallbackSrc && !hasError) {
        setCurrentSrc(fallbackSrc);
        setIsLoaded(true);
      } else {
        setHasError(true);
        onError?.(error as Error);
      }
    }
  }, [
    isInView,
    isLoaded,
    hasError,
    imageVariants,
    srcSet,
    imageSizes,
    strategy.timeoutMs,
    fallbackSrc,
    onLoad,
    onError
  ]);

  // Trigger loading when in view
  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      // For high priority images or fast devices, load immediately
      if (priority === 'high' || capabilities.deviceTier === 'premium') {
        loadImage();
      } else {
        // For normal/low priority, use requestIdleCallback to avoid blocking
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => loadImage());
        } else {
          setTimeout(loadImage, 100);
        }
      }
    }
  }, [isInView, isLoaded, hasError, priority, capabilities.deviceTier, loadImage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Generate responsive sizes attribute
  const responsiveSizes = useMemo(() => {
    if (sizes) return sizes;
    
    // Auto-generate sizes based on device capabilities
    if (capabilities.deviceTier === 'low-end') {
      return '(max-width: 640px) 100vw, 50vw';
    } else if (capabilities.deviceTier === 'mid-range') {
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    } else {
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1920px) 33vw, 25vw';
    }
  }, [sizes, capabilities.deviceTier]);

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
            className="animate-pulse bg-gray-200 rounded"
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
    <img
      ref={imgRef}
      src={currentSrc}
      srcSet={srcSet}
      sizes={responsiveSizes}
      alt={alt}
      width={width}
      height={height}
      className={`adaptive-image ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        transition: 'opacity 0.3s ease-in-out',
        objectFit: 'cover'
      }}
      loading="lazy"
      decoding="async"
    />
  );
}

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

export default AdaptiveImage;
