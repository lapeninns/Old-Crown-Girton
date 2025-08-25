"use client";

import * as React from 'react';
import Image from 'next/image';
import type { Slide as SlideType } from './types';

const Slide: React.FC<{ slide: SlideType; active?: boolean }> = ({ slide, active }) => {
  return (
    <section className="relative h-[45vh] sm:h-[55vh] md:h-[65vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {active && (
          <Image
            src={slide.image}
            alt={slide.alt || 'Slideshow image'}
            fill
            className="object-cover transform scale-110 object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            quality={75}
          />
        )}
        {/* Even stronger black overlay for higher contrast */}
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground-strong mb-6 leading-snug md:leading-tight">
            <span className="block text-foreground-strong">{slide.eyebrow}</span>
            <span className="block text-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl">{slide.headline}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-foreground-subtle mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">{slide.copy}</p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-sm md:text-base text-foreground mb-8 sm:mb-10 max-w-3xl mx-auto px-2 sm:px-0">
            {(slide.badges || []).map((b) => (
              <span key={b} className="px-2 sm:px-3 py-1 bg-neutral-50/10 rounded-full backdrop-blur border border-white/15 text-center">
                {b}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-full overflow-hidden px-2 sm:px-0">
            {slide.ctas?.bookUrl && (
              <a target="_blank" rel="noopener noreferrer" href={slide.ctas.bookUrl} className="bg-primary hover:bg-accent-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg shadow-lg transition-all duration-200 w-full sm:w-auto max-w-full sm:max-w-xs truncate text-center">
                Book Online
              </a>
            )}
            {slide.ctas?.callTel && (
              <a href={slide.ctas.callTel} className="bg-crimson-600 hover:bg-crimson-800 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg shadow-lg transition-all duration-200 w-full sm:w-auto max-w-full sm:max-w-xs truncate text-center">
                📞 Call for Takeaway
              </a>
            )}
          </div>
        </div>
      </div>


    </section>
  );
};

export default Slide;
