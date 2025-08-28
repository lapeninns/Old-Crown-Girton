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

  const goPrev = () => setIndex((i) => (i - 1 + slideCount) % slideCount);
  const goNext = () => setIndex((i) => (i + 1) % slideCount);

  return (
    <div className="relative w-full h-full" role="region" aria-label="Slideshow">
      <div className="slides-wrapper h-full">
        {/* Render only the active slide to avoid loading hidden images */}
        {slides[index] && (
          <div key={slides[index].id}>
            <Slide slide={slides[index]} slideIndex={index} active={true} />
          </div>
        )}
      </div>

      {/* Controls */}
      {slideCount > 1 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 md:px-4">
          <button
            aria-label="Previous slide"
            onClick={goPrev}
            className="pointer-events-auto bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={goNext}
            className="pointer-events-auto bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default Slideshow;
