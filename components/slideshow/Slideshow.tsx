"use client";

import React, { useEffect, useState } from 'react';
import Slide from './Slide';
import { slides as defaultSlides } from './slides';

const Slideshow: React.FC<{ slides?: any[]; interval?: number; autoplay?: boolean }> = ({ slides = defaultSlides, interval = 5000, autoplay = true }) => {
  const slideCount = slides.length;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoplay || slideCount <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slideCount), interval);
    return () => clearInterval(id);
  }, [autoplay, interval, slideCount]);

  if (!slideCount) return <div className="w-full h-64 flex items-center justify-center bg-neutral-200 text-brand-600">No slides available.</div>;

  return (
    <div className="relative w-full h-full" role="region" aria-label="Slideshow">
      <div className="slides-wrapper h-full">
        {slides.map((s, i) => (
          <div key={s.id} style={{ display: i === index ? 'block' : 'none' }}>
            <Slide slide={s} active={i === index} />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <div className="absolute inset-y-0 left-0 flex items-center px-4 z-10">
        <button onClick={() => setIndex((idx) => (idx - 1 + slideCount) % slideCount)} aria-label="Previous slide" className="p-2 bg-black/40 rounded-full text-white">
          ‹
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 z-10">
        <button onClick={() => setIndex((idx) => (idx + 1) % slideCount)} aria-label="Next slide" className="p-2 bg-black/40 rounded-full text-white">
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((s, i) => (
          <button key={s.id} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`} className={`w-3 h-3 rounded-full ${i === index ? 'bg-neutral-50' : 'bg-neutral-50/40'}`} />
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
