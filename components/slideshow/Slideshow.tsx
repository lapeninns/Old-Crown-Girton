"use client";

import React, { useEffect, useState, useRef } from 'react';
import Slide from './Slide';
import { slides as defaultSlides } from './slides';
import { useImagePreloader } from './useImagePreloader';
import SlideshowDebugger from './SlideshowDebugger';

const Slideshow: React.FC<{ slides?: any[]; interval?: number; autoplay?: boolean }> = ({ slides = defaultSlides, interval = 5000, autoplay = true }) => {
  const slideCount = slides.length;
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const mouseEndX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const minSwipeDistance = 50;

  useEffect(() => {
    if (!autoplay || slideCount <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slideCount), interval);
    return () => clearInterval(id);
  }, [autoplay, interval, slideCount]);

  if (!slideCount) return <div className="w-full h-64 flex items-center justify-center bg-neutral-200 text-brand-600">No slides available.</div>;

  // Preload next images to avoid visible loading on navigation
  const loadedSet = useImagePreloader(
    slides.map((s) => s.image),
    index,
    { ahead: 2, behind: 1 }
  );

  const goPrev = () => setIndex((i) => (i - 1 + slideCount) % slideCount);
  const goNext = () => setIndex((i) => (i + 1) % slideCount);

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && slideCount > 1) {
      goNext();
    }
    if (isRightSwipe && slideCount > 1) {
      goPrev();
    }
  };

  // Mouse event handlers for desktop drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    mouseStartX.current = e.clientX;
    mouseEndX.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    mouseEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current || !mouseStartX.current || !mouseEndX.current) {
      isDragging.current = false;
      return;
    }
    
    const distance = mouseStartX.current - mouseEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && slideCount > 1) {
      goNext();
    }
    if (isRightSwipe && slideCount > 1) {
      goPrev();
    }
    
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  return (
    <div 
      className="relative w-full h-full touch-pan-y cursor-grab active:cursor-grabbing select-none" 
      role="region" 
      aria-label="Slideshow - Swipe to navigate"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {process.env.NODE_ENV !== 'production' && <SlideshowDebugger />}
      <div className="slides-wrapper h-full">
        {/* Render only the active slide to avoid loading hidden images */}
        {slides[index] && (
          <div key={slides[index].id}>
            <Slide
              slide={slides[index]}
              slideIndex={index}
              active={true}
              preloaded={loadedSet.has(slides[index].image)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Slideshow;
