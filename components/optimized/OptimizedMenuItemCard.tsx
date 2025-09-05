/**
 * Optimized Menu Item Card
 * Specifically designed for low-end devices and slow networks (2G/3G)
 */

'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { memoryMemo, useMemoryCallback, MemoryEfficientImage } from '@/lib/optimized/memoryOptimizations';
import { useProgressiveLoading } from '@/hooks/optimized/useProgressiveLoading';
import type { Menu } from '@/src/lib/data/schemas';

interface OptimizedMenuItemProps {
  item: Menu['sections'][0]['items'][0];
  section: string;
  searchTerm?: string;
  className?: string;
  priority?: 'high' | 'normal' | 'low';
  enableImageLoading?: boolean;
  networkAware?: boolean;
}

interface DietaryBadgeProps {
  type: 'vegetarian' | 'vegan' | 'glutenFree' | 'spicy';
  label: string;
  className?: string;
}

/**
 * Optimized dietary badge with memory efficiency
 */
const DietaryBadge = memoryMemo<DietaryBadgeProps>(({ type, label, className = '' }) => {
  const badgeClasses = useMemo(() => ({
    vegetarian: 'bg-indiagreen-100 text-indiagreen-800 border-indiagreen-200',
    vegan: 'bg-marigold-100 text-marigold-800 border-marigold-200',
    glutenFree: 'bg-cardamom-100 text-cardamom-800 border-cardamom-200',
    spicy: 'bg-crimson-100 text-crimson-800 border-crimson-200'
  }), []);

  return (
    <span 
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${badgeClasses[type]} ${className}`}
      aria-label={`${label} dietary option`}
    >
      {label}
    </span>
  );
});

/**
 * Progressive image placeholder component
 */
const ImagePlaceholder = memoryMemo(() => (
  <div className="relative h-32 w-full bg-neutral-100 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse bg-[length:200%_100%]" />
    <div className="absolute inset-0 flex items-center justify-center">
      <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
));

/**
 * Network-aware image component
 */
const NetworkAwareImage = memoryMemo<{
  src: string;
  alt: string;
  item: Menu['sections'][0]['items'][0];
  priority: 'high' | 'normal' | 'low';
}>(({ src, alt, item, priority }) => {
  const [shouldLoad, setShouldLoad] = useState(priority === 'high');
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Network detection
  const networkInfo = useMemo(() => {
    if (typeof navigator === 'undefined') return { effectiveType: '4g', saveData: false };
    
    const connection = (navigator as any)?.connection;
    return {
      effectiveType: connection?.effectiveType || '4g',
      saveData: connection?.saveData || false
    };
  }, []);

  const isSlowNetwork = ['slow-2g', '2g', '3g'].includes(networkInfo.effectiveType);
  const shouldDeferImages = isSlowNetwork || networkInfo.saveData;

  // Intersection observer for lazy loading
  useEffect(() => {
    if (shouldLoad || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !shouldDeferImages) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: shouldDeferImages ? '20px' : '100px' // Smaller margin on slow networks
      }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [shouldLoad, shouldDeferImages]);

  // Generate optimized image source
  const optimizedSrc = useMemo(() => {
    if (!src) return null;
    
    try {
      const url = new URL(src, window.location.origin);
      
      // Add network-aware optimizations
      if (isSlowNetwork) {
        url.searchParams.set('q', '60'); // Lower quality for slow networks
        url.searchParams.set('f', 'webp'); // Prefer WebP format
      } else {
        url.searchParams.set('q', '75');
        url.searchParams.set('f', 'auto');
      }
      
      return url.toString();
    } catch {
      return src; // Fallback to original if URL construction fails
    }
  }, [src, isSlowNetwork]);

  const handleError = useMemoryCallback(() => {
    setHasError(true);
  }, []);

  // Don't load images at all on very slow networks
  if (shouldDeferImages && priority === 'low') {
    return <ImagePlaceholder />;
  }

  if (!shouldLoad || hasError) {
    return (
      <div ref={imgRef}>
        <ImagePlaceholder />
      </div>
    );
  }

  return (
    <div ref={imgRef}>
      <MemoryEfficientImage
        src={optimizedSrc || src}
        alt={alt}
        width={400}
        height={128}
        className="w-full h-32 object-cover rounded-t-lg"
        fallback={<ImagePlaceholder />}
        quality={isSlowNetwork ? 'low' : 'medium'}
        onError={handleError}
      />
    </div>
  );
});

/**
 * Main optimized menu item card component
 */
const OptimizedMenuItemCard = memoryMemo<OptimizedMenuItemProps>(({
  item,
  section,
  searchTerm,
  className = '',
  priority = 'normal',
  enableImageLoading = true,
  networkAware = true
}) => {
  // Price formatting with memoization
  const priceText = useMemo(() => {
    if (!item?.price) return '';
    
    try {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: item.price.currency || 'GBP'
      }).format(item.price.amount);
    } catch {
      return `£${item.price.amount}`;
    }
  }, [item?.price]);

  // Dietary information extraction
  const dietaryInfo = useMemo(() => {
    const dietary = item.dietary || {};
    const spiceTag = item.tags?.find(tag => tag.startsWith('spice-'));
    const spiceLevel = spiceTag ? parseInt(spiceTag.split('-')[1]) : null;

    return {
      isGlutenFree: dietary.glutenFree,
      isVegetarian: dietary.vegetarian,
      isVegan: dietary.vegan,
      isSpicy: dietary.spicy,
      spiceLevel
    };
  }, [item.dietary, item.tags]);

  // Image URL generation with fallback
  const imageInfo = useMemo(() => {
    if (!enableImageLoading) return { shouldShow: false, url: null };

    const MENU_ITEM_IMAGES_ENABLED = process.env.NEXT_PUBLIC_MENU_ITEM_IMAGES === 'true';
    if (!MENU_ITEM_IMAGES_ENABLED || !item?.name) {
      return { shouldShow: false, url: null };
    }

    const fromData = (item as any).image as string | undefined;
    const url = fromData || `/images/dishes/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`;

    return { shouldShow: true, url };
  }, [enableImageLoading, item]);

  // Search term highlighting with performance optimization
  const highlightText = useMemoryCallback((text: string) => {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-accent-200 text-accent-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  }, [searchTerm]);

  // Spice level display
  const spiceLevelDisplay = useMemo(() => {
    if (!dietaryInfo.spiceLevel) return null;

    const spiceEmojis = {
      1: '🌶️',
      2: '🌶️🌶️',
      3: '🌶️🌶️🌶️'
    };

    const spiceColors = {
      1: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      2: 'bg-orange-100 text-orange-800 border-orange-200',
      3: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${
          spiceColors[dietaryInfo.spiceLevel as keyof typeof spiceColors] ||
          'bg-red-100 text-red-800 border-red-200'
        }`}
        aria-label={`Spice level ${dietaryInfo.spiceLevel} out of 3`}
      >
        {spiceEmojis[dietaryInfo.spiceLevel as keyof typeof spiceEmojis] || '🌶️'}
      </span>
    );
  }, [dietaryInfo.spiceLevel]);

  return (
    <article
      className={`group bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-shadow duration-200 hover:shadow-md ${className}`}
      aria-label={`Menu item: ${item.name}`}
    >
      {/* Image Section */}
      {imageInfo.shouldShow && (
        <NetworkAwareImage
          src={imageInfo.url!}
          alt={`${item.name} - ${section} from Old Crown Girton`}
          item={item}
          priority={priority}
        />
      )}

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Header with Name and Price */}
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-semibold text-brand-800 text-base leading-tight flex-1 min-w-0">
            <span className="break-words hyphens-auto" lang="en">
              {highlightText(item.name)}
            </span>
          </h3>
          {priceText && (
            <span className="text-brand-700 font-bold text-base tabular-nums flex-shrink-0 ml-2">
              {priceText}
            </span>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-brand-600 leading-relaxed line-clamp-2">
            {highlightText(item.description)}
          </p>
        )}

        {/* Dietary Badges and Spice Level */}
        {(dietaryInfo.isGlutenFree ||
          dietaryInfo.isVegetarian ||
          dietaryInfo.isVegan ||
          dietaryInfo.isSpicy ||
          dietaryInfo.spiceLevel) && (
          <div className="flex flex-wrap gap-2" role="list" aria-label="Dietary and spice information">
            {dietaryInfo.isGlutenFree && <DietaryBadge type="glutenFree" label="GF" />}
            {dietaryInfo.isVegetarian && <DietaryBadge type="vegetarian" label="V" />}
            {dietaryInfo.isVegan && <DietaryBadge type="vegan" label="VE" />}
            {dietaryInfo.isSpicy && <DietaryBadge type="spicy" label="🌶️" />}
            {spiceLevelDisplay}
          </div>
        )}
      </div>
    </article>
  );
});

OptimizedMenuItemCard.displayName = 'OptimizedMenuItemCard';
NetworkAwareImage.displayName = 'NetworkAwareImage';
DietaryBadge.displayName = 'DietaryBadge';
ImagePlaceholder.displayName = 'ImagePlaceholder';

export default OptimizedMenuItemCard;
