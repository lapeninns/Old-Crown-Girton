"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for LocationSection with network-aware loading
const LocationSection = dynamic(() => import('@/components/restaurant/LocationSection'), {
  ssr: false
});

interface LazyLocationSectionProps {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Optimized lazy loader for LocationSection with intersection observer
 * Includes network-aware loading and reduced motion support
 */
export default function LazyLocationSection({ 
  threshold = 0.1, 
  rootMargin = '50px 0px 0px 0px' 
}: LazyLocationSectionProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Network detection for adaptive loading
  const [networkInfo, setNetworkInfo] = useState<{
    effectiveType: string;
    saveData: boolean;
  }>({ effectiveType: '4g', saveData: false });

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      setNetworkInfo({
        effectiveType: connection?.effectiveType || '4g',
        saveData: connection?.saveData || false
      });

      // Listen for network changes
      const updateNetworkInfo = () => {
        setNetworkInfo({
          effectiveType: connection?.effectiveType || '4g',
          saveData: connection?.saveData || false
        });
      };

      connection?.addEventListener('change', updateNetworkInfo);
      return () => connection?.removeEventListener('change', updateNetworkInfo);
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // For slow networks or data saver mode, use smaller root margin
    const adaptiveRootMargin = networkInfo.saveData || 
      ['slow-2g', '2g'].includes(networkInfo.effectiveType) 
      ? '20px 0px 0px 0px' 
      : rootMargin;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        
        if (entry.isIntersecting) {
          // Delayed loading for non-critical content
          const delay = networkInfo.saveData ? 500 : 100;
          
          setTimeout(() => {
            setShouldLoad(true);
            observer.disconnect();
          }, delay);
        }
      },
      { 
        threshold, 
        rootMargin: adaptiveRootMargin 
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, networkInfo]);

  // Handle reduced motion preferences
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && isIntersecting) {
      setShouldLoad(true);
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} data-section="location">
      {shouldLoad ? (
        <Suspense fallback={null}>
          <LocationSection />
        </Suspense>
      ) : (
        // Static placeholder to preserve layout without animations
        // Match the loaded map height to avoid layout shift (CLS)
        <section className="bg-brand-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-[600px]" />
          </div>
        </section>
      )}
    </div>
  );
}
