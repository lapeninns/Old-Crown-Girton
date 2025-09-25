"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import type { Slide as SlideType } from './types';
import SlideCTAButton from './SlideCTAButton';

const toSrcString = (src: any): string | null => {
  if (!src) return null;
  if (typeof src === 'string') return src;
  if (typeof src === 'object' && typeof src.src === 'string') return src.src;
  return null;
};

const normalizeImage = (image: SlideType['image']) => {
  if (typeof image === 'object' && image !== null && 'primary' in image) {
    const primary = image.primary;
    const fallback = image.fallback ?? image.primary;
    return { primary, fallback };
  }

  if (typeof image === 'string') {
    return {
      primary: image.replace(/\.(png|jpe?g|webp)$/i, '.avif'),
      fallback: image
    };
  }

  return {
    primary: image,
    fallback: image
  };
};

/* eslint-disable no-unused-vars */
type SlideAnnounceHandler = (message: string) => void;
/* eslint-enable no-unused-vars */

interface SlideProps {
  slide: SlideType;
  slideIndex: number;
  active?: boolean;
  preloaded?: boolean;
  visualOnly?: boolean;
  announce?: SlideAnnounceHandler;
}

const Slide: React.FC<SlideProps> = ({ slide, slideIndex, active, preloaded, visualOnly = false, announce }) => {
  const { primary, fallback } = useMemo(() => normalizeImage(slide.image), [slide.image]);
  const [currentSrc, setCurrentSrc] = useState<any>(primary);
  const [imageLoaded, setImageLoaded] = useState<boolean>(!!preloaded);
  const [imageError, setImageError] = useState<boolean>(false);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  const altText = useMemo(() => slide.alt || 'Slideshow image', [slide.alt]);

  useEffect(() => {
    setCurrentSrc(primary);
    setImageLoaded(!!preloaded);
    setImageError(false);
    setHasTriedFallback(false);
  }, [primary, preloaded]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    if (active && announce) {
      announce(`${slide.headline ?? altText} image loaded`);
    }
  };

  const handleImageError = () => {
    const fallbackSrc = fallback;
    if (!hasTriedFallback && fallbackSrc && toSrcString(fallbackSrc) !== toSrcString(currentSrc)) {
      setHasTriedFallback(true);
      setImageLoaded(false);
      setCurrentSrc(fallbackSrc);
      return;
    }

    setImageError(true);
    if (active && announce) {
      announce(`${slide.headline ?? altText} image failed to load`);
    }
  };

  const handleRetry = useCallback(() => {
    setImageError(false);
    setHasTriedFallback(false);
    setImageLoaded(false);
    setCurrentSrc(fallback || primary);
  }, [fallback, primary]);
  
  // Dynamic button logic with ABC cycling pattern
  // A (slides 0, 3, 6...): Book Online + Call for Takeaway
  // B (slides 1, 4, 7...): Call for Takeaway + Call for Booking
  // C (slides 2, 5, 8...): Call for Booking + Book Online
  const slideType = slideIndex % 3; // 0=A, 1=B, 2=C
  
  const baseBtn = 'text-white font-bold rounded-xl shadow-xl shadow-black/25 ring-1 ring-white/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60';

  const getButtonConfig = () => {
    switch (slideType) {
      case 0: // A: Book Online + Call for Takeaway
        return {
          primaryButton: {
            variant: 'book' as const,
            href: slide.ctas?.bookUrl,
            className: `${baseBtn} bg-accent hover:bg-accent/90`
          },
          secondaryButton: {
            variant: 'call-takeaway' as const,
            href: slide.ctas?.callTel,
            className: `${baseBtn} bg-crimson-600 hover:bg-crimson-700`
          }
        };
      case 1: // B: Call for Takeaway + Call for Booking
        return {
          primaryButton: {
            variant: 'call-takeaway' as const,
            href: slide.ctas?.callTel,
            className: `${baseBtn} bg-crimson-600 hover:bg-crimson-700`
          },
          secondaryButton: {
            variant: 'call-booking' as const,
            href: slide.ctas?.callTel,
            className: `${baseBtn} bg-accent hover:bg-accent/90`
          }
        };
      case 2: // C: Call for Booking + Book Online
        return {
          primaryButton: {
            variant: 'call-booking' as const,
            href: slide.ctas?.callTel,
            className: `${baseBtn} bg-crimson-600 hover:bg-crimson-700`
          },
          secondaryButton: {
            variant: 'book' as const,
            href: slide.ctas?.bookUrl,
            className: `${baseBtn} bg-accent hover:bg-accent/90`
          }
        };
      default:
        // Fallback (should never reach here)
        return {
          primaryButton: {
            variant: 'book' as const,
            href: slide.ctas?.bookUrl,
            className: `${baseBtn} bg-accent hover:bg-accent/90`
          },
          secondaryButton: {
            variant: 'call-takeaway' as const,
            href: slide.ctas?.callTel,
            className: `${baseBtn} bg-crimson-600 hover:bg-crimson-700`
          }
        };
    }
  };
  
  const { primaryButton, secondaryButton } = getButtonConfig();
  return (
    <section className="relative h-[52svh] sm:h-[58svh] md:h-[65svh] flex items-center justify-center overflow-hidden" aria-hidden={visualOnly || undefined}>
      <div className="absolute inset-0 z-0">
        {imageError && (
          <div className="absolute inset-0 bg-neutral-900/80 flex flex-col gap-3 items-center justify-center text-neutral-200 text-sm px-4 text-center" role="alert">
            <span aria-live="assertive">We couldn&apos;t load this slide image.</span>
            <button
              type="button"
              onClick={handleRetry}
              className="px-4 py-2 bg-white/20 rounded-lg border border-white/40 text-white hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Retry
            </button>
          </div>
        )}
        {(active || visualOnly) && !imageError && (
          <Image
            src={currentSrc}
            alt={altText}
            fill
            priority={slideIndex === 0}
            fetchPriority={slideIndex === 0 ? 'high' : 'auto'}
            loading={slideIndex === 0 ? 'eager' : 'lazy'}
            className={`object-cover transform xxs:scale-100 sm:scale-110 object-center transition-opacity duration-300 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="100vw"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="w-10 h-10 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {/* Overlay for text contrast; ease in slightly after image loads to avoid "grey flash" perception */}
  <div className={`absolute inset-0 bg-black/55 transition-opacity duration-300 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-80'}`} />
      </div>

      {!visualOnly && (
      <span className="sr-only" role="status" aria-live="polite">
        {imageLoaded ? 'Image loaded' : 'Image loading'}
      </span>
      )}

      {!visualOnly && (
      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 sm:mb-6 leading-tight md:leading-tight">
              <span className="block text-white">{slide.eyebrow}</span>
              <span className="block text-neutral-100 text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl">{slide.headline}</span>
            </h1>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-neutral-200 mb-5 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-1 sm:px-0">{slide.copy}</p>

          <div className="flex flex-wrap justify-center gap-2 xs:gap-2 sm:gap-3 text-[11px] xs:text-xs md:text-base text-neutral-100 mb-6 sm:mb-10 max-w-3xl mx-auto px-1 sm:px-0">
            {(slide.badges || []).map((b) => (
              <span key={b} className="px-2 sm:px-3 py-1 bg-white/20 rounded-full backdrop-blur border border-white/30 text-center text-white">
                {b}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 xs:gap-3 sm:gap-4 justify-center items-center max-w-full overflow-hidden px-2 sm:px-0">
            {primaryButton.href && (
              <SlideCTAButton
                variant={primaryButton.variant}
                href={primaryButton.href}
                className={`${primaryButton.className} text-white font-bold py-2 px-4 xs:py-2.5 xs:px-5 sm:py-3 sm:px-6 md:py-4 md:px-8 rounded-lg text-sm xs:text-base sm:text-lg shadow-lg w-full sm:w-auto max-w-full sm:max-w-xs truncate text-center`}
              />
            )}
            {secondaryButton.href && (
              <SlideCTAButton
                variant={secondaryButton.variant}
                href={secondaryButton.href}
                className={`${secondaryButton.className} text-white font-bold py-2 px-4 xs:py-2.5 xs:px-5 sm:py-3 sm:px-6 md:py-4 md:px-8 rounded-lg text-sm xs:text-base sm:text-lg shadow-lg w-full sm:w-auto max-w-full sm:max-w-xs truncate text-center`}
              />
            )}
          </div>
        </div>
      </div>
      )}


    </section>
  );
};

export default Slide;
