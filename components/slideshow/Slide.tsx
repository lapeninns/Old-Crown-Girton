"use client";

import * as React from 'react';
import Image from 'next/image';
import type { Slide as SlideType } from './types';

const Slide: React.FC<{ slide: SlideType; active?: boolean }> = ({ slide }) => {
  return (
    <section className="relative h-[60vh] sm:h-[65vh] md:h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image src={slide.image} alt={slide.alt || 'Slideshow image'} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-snug md:leading-tight">
            <span className="block text-accent">{slide.eyebrow}</span>
            <span className="block text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl">{slide.headline}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">{slide.copy}</p>

          <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base text-white/85 mb-10 max-w-3xl mx-auto">
            {(slide.badges || []).map((b) => (
              <span key={b} className="px-3 py-1 bg-white/10 rounded-full backdrop-blur border border-white/15">
                {b}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {slide.ctas?.bookUrl && (
              <a target="_blank" rel="noopener noreferrer" href={slide.ctas.bookUrl} className="bg-primary hover:bg-accent-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg shadow-lg transition-all duration-200 w-full sm:w-auto">
                Book Online
              </a>
            )}
            {slide.ctas?.callTel && (
              <a href={slide.ctas.callTel} className="bg-crimson-600 hover:bg-crimson-800 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg shadow-lg transition-all duration-200 w-full sm:w-auto">
                📞 Call for Takeaway
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
};

export default Slide;
