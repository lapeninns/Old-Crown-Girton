"use client";

import React from 'react';
import Image from 'next/image';
import type { Slide as SlideType } from './types';

const Slide: React.FC<{ slide: SlideType; slideIndex: number; active?: boolean }> = ({ slide, slideIndex, active }) => {
  
  // Dynamic button logic with ABC cycling pattern
  // A (slides 0, 3, 6...): Book Online + Call for Takeaway
  // B (slides 1, 4, 7...): Call for Takeaway + Call for Booking
  // C (slides 2, 5, 8...): Call for Booking + Book Online
  const slideType = slideIndex % 3; // 0=A, 1=B, 2=C
  
  const getButtonConfig = () => {
    switch (slideType) {
      case 0: // A: Book Online + Call for Takeaway
        return {
          primaryButton: {
            text: '🍽️ Book Online',
            href: slide.ctas?.bookUrl,
            className: 'bg-accent hover:bg-accent-700'
          },
          secondaryButton: {
            text: '📞 Call for Takeaway',
            href: slide.ctas?.callTel,
            className: 'bg-crimson-600 hover:bg-crimson-800'
          }
        };
      case 1: // B: Call for Takeaway + Call for Booking
        return {
          primaryButton: {
            text: '📞 Call for Takeaway',
            href: slide.ctas?.callTel,
            className: 'bg-crimson-600 hover:bg-crimson-800'
          },
          secondaryButton: {
            text: '📞 Call for Booking',
            href: slide.ctas?.callTel,
            className: 'bg-accent hover:bg-accent-700'
          }
        };
      case 2: // C: Call for Booking + Book Online
        return {
          primaryButton: {
            text: '📞 Call for Booking',
            href: slide.ctas?.callTel,
            className: 'bg-accent hover:bg-accent-700'
          },
          secondaryButton: {
            text: '🍽️ Book Online',
            href: slide.ctas?.bookUrl,
            className: 'bg-accent hover:bg-accent-700'
          }
        };
      default:
        // Fallback (should never reach here)
        return {
          primaryButton: {
            text: '🍽️ Book Online',
            href: slide.ctas?.bookUrl,
            className: 'bg-accent hover:bg-accent-700'
          },
          secondaryButton: {
            text: '📞 Call for Takeaway',
            href: slide.ctas?.callTel,
            className: 'bg-crimson-600 hover:bg-crimson-800'
          }
        };
    }
  };
  
  const { primaryButton, secondaryButton } = getButtonConfig();
  return (
    <section className="relative h-[45vh] sm:h-[55vh] md:h-[65vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {active && (
          <Image
            src={slide.image}
            alt={slide.alt || 'Slideshow image'}
            fill
            priority={slideIndex === 0}
            className="object-cover transform scale-110 object-center"
            sizes="100vw"
          />
        )}
        {/* Even stronger black overlay for higher contrast */}
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-snug md:leading-tight">
            <span className="block text-white">{slide.eyebrow}</span>
            <span className="block text-neutral-100 text-xl sm:text-2xl md:text-3xl lg:text-4xl">{slide.headline}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-200 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">{slide.copy}</p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-sm md:text-base text-neutral-100 mb-8 sm:mb-10 max-w-3xl mx-auto px-2 sm:px-0">
            {(slide.badges || []).map((b) => (
              <span key={b} className="px-2 sm:px-3 py-1 bg-white/20 rounded-full backdrop-blur border border-white/30 text-center text-white">
                {b}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-full overflow-hidden px-2 sm:px-0">
            {primaryButton.href && (
              <a 
                target={primaryButton.text.includes('Book Online') ? '_blank' : undefined} 
                rel={primaryButton.text.includes('Book Online') ? 'noopener noreferrer' : undefined} 
                href={primaryButton.href} 
                className={`${primaryButton.className} text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg shadow-lg w-full sm:w-auto max-w-full sm:max-w-xs truncate text-center`}
              >
                {primaryButton.text}
              </a>
            )}
            {secondaryButton.href && (
              <a 
                target={secondaryButton.text.includes('Book Online') ? '_blank' : undefined} 
                rel={secondaryButton.text.includes('Book Online') ? 'noopener noreferrer' : undefined} 
                href={secondaryButton.href} 
                className={`${secondaryButton.className} text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg shadow-lg w-full sm:w-auto max-w-full sm:max-w-xs truncate text-center`}
              >
                {secondaryButton.text}
              </a>
            )}
          </div>
        </div>
      </div>


    </section>
  );
};

export default Slide;
