"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Slide from './Slide';
import { slides as defaultSlides } from './slides';
import { useImagePreloader } from './useImagePreloader';
import SlideshowDebugger from './SlideshowDebugger';

const toSrcString = (src: any): string => {
  if (!src) return '';
  if (typeof src === 'string') return src;
  if (typeof src === 'object' && typeof src.src === 'string') return src.src;
  return '';
};

const getPrimaryImageSrc = (image: any): string => {
  if (typeof image === 'object' && image !== null && 'primary' in image) {
    return toSrcString(image.primary);
  }

  if (typeof image === 'string') {
    return image.replace(/\.(png|jpe?g|webp)$/i, '.avif');
  }

  return toSrcString(image);
};

const TRANSITION_MS = 400;

// Mobile performance optimization - detect device capabilities
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth < 768;
};

// Network-aware configuration
const getOptimalConfig = () => {
  const isMobile = isMobileDevice();
  const connection = (navigator as any)?.connection;
  const isSlowNetwork = connection?.effectiveType && ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
  
  return {
    preloadCount: isMobile || isSlowNetwork ? 1 : 2, // Reduce preloading on mobile/slow networks
    autoplayInterval: isMobile ? 6000 : 5000, // Slower autoplay on mobile to reduce resource usage
    enableTouchOptimization: isMobile,
    reduceAnimations: isSlowNetwork || (connection?.saveData)
  };
};

const REQUIRED_SLIDE_IDS = new Set(['slide-ev-charging', 'slide-11']);

const shuffleSlides = (slides: any[]) => {
  const shuffled = [...slides];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const collectSlides = (allSlides: any[]): { required: any[]; optional: any[] } => {
  if (!Array.isArray(allSlides) || allSlides.length === 0) {
    return { required: [], optional: [] };
  }
  const seen = new Set<string>();
  const required: any[] = [];
  const optional: any[] = [];

  allSlides.forEach((slide) => {
    if (!slide || !slide.id || seen.has(slide.id)) return;
    seen.add(slide.id);
    if (REQUIRED_SLIDE_IDS.has(slide.id)) {
      required.push(slide);
    } else {
      optional.push(slide);
    }
  });

  return { required, optional };
};

const selectSessionSlides = (allSlides: any[], targetCount = 5) => {
  const { required, optional } = collectSlides(allSlides);
  if (!required.length && !optional.length) return [];

  const needed = Math.max(0, targetCount - required.length);
  const randomizedOptional = shuffleSlides(optional);
  const selectedOptional = randomizedOptional.slice(0, needed);

  const combined = [...required, ...selectedOptional];

  if (combined.length < targetCount) {
    for (const slide of randomizedOptional) {
      if (combined.length >= targetCount) break;
      if (!combined.includes(slide)) combined.push(slide);
    }
  }

  return shuffleSlides(combined).slice(0, targetCount);
};

const getDefaultSessionSlides = (allSlides: any[], targetCount = 5) => {
  const { required, optional } = collectSlides(allSlides);
  if (!required.length && !optional.length) return [];

  const combined = [...required];
  for (const slide of optional) {
    if (combined.length >= targetCount) break;
    combined.push(slide);
  }

  return combined.slice(0, targetCount);
};

const Slideshow: React.FC<{ slides?: any[]; interval?: number; autoplay?: boolean }> = ({ slides = defaultSlides, interval = 5000, autoplay = true }) => {
  const [sessionSlides, setSessionSlides] = useState(() => getDefaultSessionSlides(slides, 5));
  const slideCount = sessionSlides.length;
  const prefersReduced = useReducedMotion();
  const config = getOptimalConfig();
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [showPrev, setShowPrev] = useState(false);
  const transitioningRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const mouseEndX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const minSwipeDistance = config.enableTouchOptimization ? 30 : 50; // Smaller threshold for mobile
  const actualInterval = config.autoplayInterval || interval;

  const incomingInitial = prefersReduced ? { opacity: 0 } : { opacity: 0, x: 18 };
  const incomingAnimate = prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0 };
  const incomingTransition = prefersReduced
    ? { duration: 0.2, ease: 'linear' as const }
    : { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const };

  const outgoingTransition = prefersReduced
    ? { duration: 0.2, ease: 'linear' as const }
    : { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const };

  useEffect(() => {
    const randomized = selectSessionSlides(slides, 5);
    const newSlides = randomized.length ? randomized : getDefaultSessionSlides(slides, 5);
    setSessionSlides((current) => {
      if (current.length === newSlides.length && current.every((slide, idx) => slide?.id === newSlides[idx]?.id)) {
        return current;
      }
      return newSlides;
    });
    setIndex(0);
    setPrevIndex(null);
  }, [slides]);

  // Mobile-optimized preloader - reduced preload count for performance
  const { loaded, waitFor } = useImagePreloader(
    sessionSlides.map((s) => getPrimaryImageSrc(s.image)),
    index,
    { ahead: config.preloadCount, behind: config.preloadCount > 1 ? 1 : 0 }
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
    const nextImage = sessionSlides[next]?.image;
    const nextSrc = getPrimaryImageSrc(nextImage);
    if (nextSrc && !loaded.has(nextSrc)) {
      const status = await waitFor(nextSrc, Math.max(1000, Math.min(6000, interval)));
      if (status === 'error') {
        // proceed even if failed; avoids stalling
      }
    }
    startTransitionTo(next);
  };

  // Mobile-optimized autoplay with network awareness
  useEffect(() => {
    if (!autoplay || slideCount <= 1) return;
    if (prefersReduced) return;

    const intervalMs = config.reduceAnimations ? Math.max(actualInterval, interval * 1.5) : actualInterval;

    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      await requestAdvance(1);
    }, intervalMs);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [autoplay, actualInterval, interval, slideCount, index, prefersReduced, config.reduceAnimations]);

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
        {sessionSlides[index] && (
          <motion.div
            key={`curr-${sessionSlides[index].id}`}
            className="relative z-0"
            initial={incomingInitial}
            animate={incomingAnimate}
            transition={incomingTransition}
          >
            <Slide
              slide={sessionSlides[index]}
              slideIndex={index}
              active={true}
              preloaded={loaded.has(getPrimaryImageSrc(sessionSlides[index].image))}
            />
          </motion.div>
        )}
        {/* Previous slide (on top, fading out) */}
        <AnimatePresence>
          {prevIndex !== null && sessionSlides[prevIndex] && (
            <motion.div
              key={`prev-${sessionSlides[prevIndex].id}`}
              className="absolute inset-0 z-10 pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: showPrev ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={outgoingTransition}
            >
              <Slide
                slide={sessionSlides[prevIndex]}
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
