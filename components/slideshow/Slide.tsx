"use client";

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import type { Slide as SlideType } from './types';
import { useReducedMotion } from 'framer-motion';

const Slide: React.FC<{ slide: SlideType; slideIndex: number; active?: boolean; preloaded?: boolean; visualOnly?: boolean }> = ({ slide, slideIndex, active, preloaded, visualOnly = false }) => {
  const prefersReduced = useReducedMotion();
  const [imageLoaded, setImageLoaded] = useState<boolean>(!!preloaded);
  const [imageError, setImageError] = useState<boolean>(false);
  const altText = useMemo(() => slide.alt || 'Slideshow image', [slide.alt]);
  
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
            text: '🍽️ Book Online',
            href: slide.ctas?.bookUrl,
            className: `${baseBtn} bg-accent hover:bg-accent/90`
          },
          secondaryButton: {
            text: '📞 Call for Takeaway',
            href: slide.ctas?.callTel,
            className: `${baseBtn} bg-crimson-600 hover:bg-crimson-700`
          }
        };
      case 1: // B: Call for Takeaway + Call for Booking
        return {
          primaryButton: {
            text: '📞 Call for Takeaway',
            href: slide.ctas?.callTel,
            className: `${baseBtn} bg-crimson-600 hover:bg-crimson-700`
          },
          secondaryButton: {
            text: '📞 Call for Booking',
            href: slide.ctas?.callTel,
            className: `${baseBtn} bg-accent hover:bg-accent/90`
          }
        };
      case 2: // C: Call for Booking + Book Online
        return {
          primaryButton: {
            text: '📞 Call for Booking',
            href: slide.ctas?.callTel,
            className: `${baseBtn} bg-crimson-600 hover:bg-crimson-700`
          },
          secondaryButton: {
            text: '🍽️ Book Online',
            href: slide.ctas?.bookUrl,
            className: `${baseBtn} bg-accent hover:bg-accent/90`
          }
        };
      default:
        // Fallback (should never reach here)
        return {
          primaryButton: {
            text: '🍽️ Book Online',
            href: slide.ctas?.bookUrl,
            className: `${baseBtn} bg-accent hover:bg-accent/90`
          },
          secondaryButton: {
            text: '📞 Call for Takeaway',
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
        {/* Placeholder backdrop while loading or on error */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-neutral-800 animate-pulse" aria-hidden="true" />
        )}
        {imageError && (
          <div className="absolute inset-0 bg-neutral-700 flex items-center justify-center text-neutral-200 text-sm" role="img" aria-label={`${altText} (failed to load)`}>
            Image failed to load
          </div>
        )}
        {(active || visualOnly) && !imageError && (
          <Image
            src={slide.image}
            alt={altText}
            fill
            priority={slideIndex === 0}
            className={`object-cover transform xxs:scale-100 sm:scale-110 object-center transition-opacity ${prefersReduced ? 'duration-150' : 'duration-300'} ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="100vw"
            draggable={false}
            onLoadingComplete={(img: any) => {
              try {
                if (img && typeof img.decode === 'function') {
                  img.decode().then(() => setImageLoaded(true)).catch(() => setImageLoaded(true));
                } else {
                  setImageLoaded(true);
                }
              } catch {
                setImageLoaded(true);
              }
            }}
            onError={() => setImageError(true)}
          />
        )}
        {/* Overlay for text contrast; ease in slightly after image loads to avoid "grey flash" perception */}
        <div className={`absolute inset-0 bg-black/75 transition-opacity ${prefersReduced ? 'duration-150' : 'duration-300'} ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-70'}`} />
      </div>

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
              <a 
                target={primaryButton.text.includes('Book Online') ? '_blank' : undefined} 
                rel={primaryButton.text.includes('Book Online') ? 'noopener noreferrer' : undefined} 
                href={primaryButton.href} 
                className={`${primaryButton.className} text-white font-bold py-2 px-4 xs:py-2.5 xs:px-5 sm:py-3 sm:px-6 md:py-4 md:px-8 rounded-lg text-sm xs:text-base sm:text-lg shadow-lg w-full sm:w-auto max-w-full sm:max-w-xs truncate text-center`}
              >
                {primaryButton.text}
              </a>
            )}
            {secondaryButton.href && (
              <a 
                target={secondaryButton.text.includes('Book Online') ? '_blank' : undefined} 
                rel={secondaryButton.text.includes('Book Online') ? 'noopener noreferrer' : undefined} 
                href={secondaryButton.href} 
                className={`${secondaryButton.className} text-white font-bold py-2 px-4 xs:py-2.5 xs:px-5 sm:py-3 sm:px-6 md:py-4 md:px-8 rounded-lg text-sm xs:text-base sm:text-lg shadow-lg w-full sm:w-auto max-w-full sm:max-w-xs truncate text-center`}
              >
                {secondaryButton.text}
              </a>
            )}
          </div>
        </div>
      </div>
      )}


    </section>
  );
};

export default React.memo(Slide);
