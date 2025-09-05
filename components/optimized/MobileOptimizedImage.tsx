"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface MobileOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * Mobile-optimized image component with network-aware loading
 * Automatically adjusts quality and format based on device capabilities
 */
export default function MobileOptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  quality,
  loading = 'lazy',
  placeholder = 'blur',
  blurDataURL
}: MobileOptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<'high' | 'medium' | 'low'>('medium');
  const imgRef = useRef<HTMLDivElement>(null);

  // Detect network quality and device capabilities
  useEffect(() => {
    const detectNetworkQuality = () => {
      // Check for network information API
      const connection = (navigator as any)?.connection;
      if (connection) {
        const { effectiveType, saveData } = connection;
        
        if (saveData || ['slow-2g', '2g'].includes(effectiveType)) {
          setNetworkQuality('low');
        } else if (effectiveType === '3g') {
          setNetworkQuality('medium');
        } else {
          setNetworkQuality('high');
        }
      } else {
        // Fallback: detect by device memory
        const deviceMemory = (navigator as any)?.deviceMemory || 4;
        if (deviceMemory <= 2) {
          setNetworkQuality('low');
        } else if (deviceMemory <= 4) {
          setNetworkQuality('medium');
        } else {
          setNetworkQuality('high');
        }
      }
    };

    detectNetworkQuality();

    // Listen for network changes
    const handleConnectionChange = () => detectNetworkQuality();
    if ((navigator as any)?.connection) {
      (navigator as any).connection.addEventListener('change', handleConnectionChange);
      return () => {
        (navigator as any).connection?.removeEventListener('change', handleConnectionChange);
      };
    }
  }, []);

  // Adaptive quality based on network conditions
  const getAdaptiveQuality = () => {
    if (quality) return quality; // Respect explicit quality setting
    
    switch (networkQuality) {
      case 'low': return 60;
      case 'medium': return 75;
      case 'high': return 85;
      default: return 75;
    }
  };

  // Adaptive sizes for responsive loading
  const getAdaptiveSizes = () => {
    if (sizes) return sizes;
    
    // Mobile-first responsive sizes
    switch (networkQuality) {
      case 'low': 
        return '(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw';
      case 'medium':
        return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
      case 'high':
        return '(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw';
      default:
        return '(max-width: 768px) 100vw, 50vw';
    }
  };

  // Generate blur placeholder if not provided
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    
    // Simple base64 blur placeholder
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
  };

  const handleLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  // Show error state
  if (imageError) {
    return (
      <div 
        className={`flex items-center justify-center bg-neutral-100 text-neutral-500 ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={`${alt} (failed to load)`}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={loading}
        quality={getAdaptiveQuality()}
        sizes={getAdaptiveSizes()}
        placeholder={placeholder}
        blurDataURL={getBlurDataURL()}
        className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-transparent">
        </div>
      )}
    </div>
  );
}