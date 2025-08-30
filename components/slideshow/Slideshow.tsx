"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useVelocity, animate } from 'framer-motion';
import Slide from './Slide';
import { slides as defaultSlides } from './slides';
import { useImagePreloader } from './useImagePreloader';
import SlideshowDebugger from './SlideshowDebugger';
import { useWheelNavigate } from './useWheelNavigate';

const TRANSITION_MS = 400;

const Slideshow: React.FC<{ slides?: any[]; interval?: number; autoplay?: boolean }> = ({ slides = defaultSlides, interval = 5000, autoplay = true }) => {
  const slideCount = slides.length;
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [showPrev, setShowPrev] = useState(false);
  const transitioningRef = useRef(false);
  const interactingRef = useRef(false);
  const [isInteracting, setIsInteracting] = useState(false);
  // Legacy refs removed; Framer Motion handles drag/gesture logic
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Motion values for buttery-smooth drag with minimal React re-rendering
  const x = useMotionValue(0);
  const xVelocity = useVelocity(x);

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
    if (!autoplay || slideCount <= 1 || isInteracting || transitioningRef.current) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      await requestAdvance(1);
    }, interval);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [autoplay, interval, slideCount, index, loaded, isInteracting]);

  // Passive wheel/trackpad horizontal navigation (no re-render during wheel)
  useWheelNavigate(containerRef, {
    enabled: slideCount > 1,
    get canNavigate() {
      return !transitioningRef.current && !isInteracting;
    },
    onPrev: () => requestAdvance(-1),
    onNext: () => requestAdvance(1),
  });

  if (!slideCount) return <div className="w-full h-64 flex items-center justify-center bg-neutral-200 text-brand-600">No slides available.</div>;

  const goPrev = () => requestAdvance(-1);
  const goNext = () => requestAdvance(1);

  // Remove manual touch/mouse drag in favor of Framer Motion drag for consistency

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full touch-pan-y overscroll-contain cursor-grab active:cursor-grabbing select-none"
      role="region"
      aria-label="Slideshow - Swipe to navigate"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={prefersReduced ? 0.05 : 0.18}
      dragMomentum={false}
      style={{ x, willChange: isInteracting ? 'transform' : 'auto' }}
      onDragStart={() => { interactingRef.current = true; setIsInteracting(true); }}
      onDragEnd={(e, info) => {
        const { offset } = info;
        const velocityX = xVelocity.get();
        const travel = Math.abs(offset.x);
        const fast = Math.abs(velocityX) > (prefersReduced ? 500 : 700);
        const far = travel > (prefersReduced ? 60 : 90);
        const swipe = fast || far;

        const settleSpring = { type: 'spring' as const, stiffness: prefersReduced ? 600 : 420, damping: prefersReduced ? 42 : 36 };
        const reset = () => {
          animate(x, 0, settleSpring).then(() => { interactingRef.current = false; setIsInteracting(false); });
        };

        if (!swipe) {
          reset();
          return;
        }
        if (offset.x < 0) {
          goNext();
        } else {
          goPrev();
        }
        reset();
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
        <AnimatePresence mode="wait">
          {prevIndex !== null && slides[prevIndex] && (
            <motion.div
              key={`prev-${slides[prevIndex].id}`}
              className="absolute inset-0 z-10 pointer-events-none"
              style={{ willChange: transitioningRef.current ? 'opacity' : 'auto' }}
              initial={{ opacity: prefersReduced ? 1 : 1 }}
              animate={{ opacity: showPrev ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReduced ? 0.12 : 0.28, ease: 'easeInOut' }}
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
