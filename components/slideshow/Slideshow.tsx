"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Slide from './Slide';
import { slides as defaultSlides } from './slides';
import { useImagePreloader } from './useImagePreloader';
import SlideshowDebugger from './SlideshowDebugger';

const TRANSITION_MS = 400;

const Slideshow: React.FC<{ slides?: any[]; interval?: number; autoplay?: boolean }> = ({ slides = defaultSlides, interval = 5000, autoplay = true }) => {
  const slideCount = slides.length;
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [showPrev, setShowPrev] = useState(false);
  const transitioningRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const mouseEndX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const minSwipeDistance = 50;

  // Preload next images to avoid visible loading on navigation
  const { loaded, waitFor } = useImagePreloader(
    slides.map((s) => s.image),
    index,
    { ahead: 2, behind: 1 }
  );

  // Request an advance with crossfade; waits until the target image is decoded
  const startTransitionTo = (next: number) => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;
    setPrevIndex(index);
    setShowPrev(true);
    setIndex(next);
    // Fade out prev on next frame to trigger CSS transition
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      requestAnimationFrame(() => setShowPrev(false));
    } else {
      setTimeout(() => setShowPrev(false), 0);
    }
    // Cleanup after transition
    setTimeout(() => {
      setPrevIndex(null);
      transitioningRef.current = false;
    }, TRANSITION_MS + 30);
  };

  const requestAdvance = async (direction: 1 | -1) => {
    if (transitioningRef.current) return;
    const next = (index + direction + slideCount) % slideCount;
    const nextSrc = slides[next]?.image;
    if (nextSrc && !loaded.has(nextSrc)) {
      const status = await waitFor(nextSrc, Math.max(1000, Math.min(6000, interval)));
      if (status === 'error') {
        // proceed even if failed; avoids stalling
      }
    }
    startTransitionTo(next);
  };

  // Autoplay that waits for the next image to be ready
  useEffect(() => {
    if (!autoplay || slideCount <= 1) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      await requestAdvance(1);
    }, interval);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [autoplay, interval, slideCount, index, loaded]);

  if (!slideCount) return <div className="w-full h-64 flex items-center justify-center bg-neutral-200 text-brand-600">No slides available.</div>;

  const goPrev = () => requestAdvance(-1);
  const goNext = () => requestAdvance(1);

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
    <motion.div
      className="relative w-full touch-pan-y cursor-grab active:cursor-grabbing select-none"
      role="region"
      aria-label="Slideshow - Swipe to navigate"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      drag={prefersReduced ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, info) => {
        const { offset, velocity } = info;
        const swipe = Math.abs(offset.x) > 80 || Math.abs(velocity.x) > 300;
        if (!swipe) return;
        if (offset.x < 0) {
          goNext();
        } else {
          goPrev();
        }
      }}
    >
      {process.env.NODE_ENV !== 'production' && <SlideshowDebugger />}
      <div className="slides-wrapper relative">
        {/* Current slide in normal flow to establish height */}
        {slides[index] && (
          <div key={`curr-${slides[index].id}`} className="relative z-0">
            <Slide
              slide={slides[index]}
              slideIndex={index}
              active={true}
              preloaded={loaded.has(slides[index].image)}
            />
          </div>
        )}
        {/* Previous slide (on top, fading out) */}
        <AnimatePresence>
          {prevIndex !== null && slides[prevIndex] && (
            <motion.div
              key={`prev-${slides[prevIndex].id}`}
              className="absolute inset-0 z-10 pointer-events-none"
              initial={{ opacity: prefersReduced ? 1 : 1 }}
              animate={{ opacity: showPrev ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.3, ease: 'easeInOut' }}
            >
              <Slide
                slide={slides[prevIndex]}
                slideIndex={prevIndex}
                active={false}
                visualOnly
                preloaded={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Slideshow;
