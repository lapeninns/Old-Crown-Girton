"use client";

import React, { useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from 'react';

export interface AutoMarqueeHandle {
  pause: () => void;
  resume: () => void;
  isPaused: () => boolean;
  resetPosition: () => void;
}

interface AutoMarqueeProps {
  children: React.ReactNode;
  speedPxPerSec?: number;
  resumeAfterMs?: number;
  ariaLabel?: string;
  direction?: 'left' | 'right';
  // How many copies of the children to render (>= 2)
  duplicates?: number;
  // Optional callbacks
  onInertiaEnd?: () => void;
}

// Accessible, reduced-motion-friendly auto-scrolling marquee
export const AutoMarquee = forwardRef<AutoMarqueeHandle, AutoMarqueeProps>(function AutoMarquee(
  {
    children,
    speedPxPerSec = 40,
    resumeAfterMs = 2500,
    ariaLabel,
    direction = 'right',
    duplicates = 2,
    onInertiaEnd,
  },
  ref
) {
  // Clamp/validate incoming numeric props to sensible ranges to avoid unexpected behavior
  const dupCount = Math.max(2, Math.floor(duplicates));

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const setWidthRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const pausedUntilRef = useRef<number>(0);
  const manualPauseRef = useRef<boolean>(false);
  const [prefersReduced, setPrefersReduced] = useState<boolean>(false);
  const inViewRef = useRef<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handle = () => setPrefersReduced(Boolean(mq.matches));
    handle();
    try { mq.addEventListener('change', handle); } catch { try { mq.addListener(handle); } catch {} }
    return () => {
      try { mq.removeEventListener('change', handle); } catch { try { mq.removeListener(handle); } catch {} }
    };
  }, []);

  // Imperative API
  useImperativeHandle(ref, () => ({
    pause: () => { manualPauseRef.current = true; },
    resume: () => { manualPauseRef.current = false; pausedUntilRef.current = performance.now(); },
    isPaused: () => manualPauseRef.current,
    resetPosition: () => {
      offsetRef.current = direction === 'right' ? -setWidthRef.current : 0;
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
    },
  }), [direction]);

  const sets = useMemo(() => Array.from({ length: dupCount }), [dupCount]);

  if (prefersReduced) {
    return (
      <div
        ref={viewportRef}
        className="overflow-x-auto py-6 sm:py-8"
        aria-roledescription="carousel"
        aria-label={ariaLabel || 'Items'}
        role="region"
        tabIndex={0}
      >
        <div className="flex gap-4 sm:gap-6 items-stretch px-2">
          {children}
        </div>
      </div>
    );
  }

  // Dev FPS overlay state (sampled infrequently to avoid re-render cost)
  const isDev = process.env.NODE_ENV === 'development';
  const [debugFPS, setDebugFPS] = useState<number>(0);
  const debugAccumRef = useRef<number>(0);
  const debugCountRef = useRef<number>(0);
  const lastDebugTsRef = useRef<number>(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const applyTransform = () => {
      const x = offsetRef.current;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    };

    const recalc = () => {
      const full = track.scrollWidth;
      const w = dupCount > 0 ? full / dupCount : full;
      setWidthRef.current = w;
      // Initialize offset based on direction so movement starts seamless
      offsetRef.current = direction === 'right' ? -setWidthRef.current : 0;
      applyTransform();
    };

    const step = (ts: number) => {
      if (!trackRef.current) return;
      if (!inViewRef.current) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      if (!lastTsRef.current) lastTsRef.current = ts;
      // Raw delta in seconds for FPS calc
      const rawDt = (ts - lastTsRef.current) / 1000;
      const dt = Math.max(0, Math.min(0.05, rawDt));
      lastTsRef.current = ts;
      const now = performance.now();
      const paused = manualPauseRef.current || now < pausedUntilRef.current;
      const speed = speedPxPerSec;
      const w = setWidthRef.current;

      // Normal auto-scroll
      if (!paused && w > 0 && speed > 0) {
        if (direction === 'right') {
          offsetRef.current += speed * dt;
          if (offsetRef.current >= 0) {
            offsetRef.current -= w;
          }
        } else {
          offsetRef.current -= speed * dt;
          if (offsetRef.current <= -w) {
            offsetRef.current += w;
          }
        }
        applyTransform();
      }

      // Dev-only FPS sampler (update ~2x per second)
      if (isDev) {
        debugAccumRef.current += Math.max(0, rawDt);
        debugCountRef.current += 1;
        if (debugAccumRef.current >= 0.5) {
          const fps = debugCountRef.current / debugAccumRef.current;
          setDebugFPS(Number.isFinite(fps) ? Math.round(fps) : 0);
          debugAccumRef.current = 0;
          debugCountRef.current = 0;
        }
        lastDebugTsRef.current = ts;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    // ResizeObserver for dynamic content
    const ResizeObserverCtor = (window as any).ResizeObserver as undefined | (new (cb: ResizeObserverCallback) => ResizeObserver);
    const resizeObserver = ResizeObserverCtor ? new ResizeObserverCtor(() => recalc()) : null;
    if (resizeObserver) resizeObserver.observe(track);

    // IntersectionObserver to pause out of view
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        inViewRef.current = entry.isIntersecting;
      });
    }, { root: null, rootMargin: '0px', threshold: 0 });
    io.observe(viewport);

    recalc();
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speedPxPerSec, resumeAfterMs, direction, dupCount]);

  // Keyboard controls and pause/resume via Space
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const w = setWidthRef.current;
    if (!w || !trackRef.current) return;
    // Avoid interfering with inputs
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return;
    if (e.code === 'Space') {
      e.preventDefault();
      manualPauseRef.current = !manualPauseRef.current;
      return;
    }
  };

  return (
    <div
      ref={viewportRef}
      className="overflow-hidden py-6 sm:py-8 select-none relative"
      aria-roledescription="carousel"
      aria-label={ariaLabel || 'Items (auto scrolling)'}
      role="region"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div ref={trackRef} className="flex gap-4 sm:gap-6 items-stretch will-change-transform">
        {sets.map((_, i) => (
          <div key={i} aria-hidden={i > 0} className="contents">
            {children}
          </div>
        ))}
      </div>
      {isDev && (
        <div className="absolute right-2 bottom-2 z-20 pointer-events-none bg-black/60 text-white text-xs px-2 py-1 rounded">
          <span>FPS: {debugFPS}</span>
          <span className="mx-2">|</span>
          <span>Paused: {manualPauseRef.current || !inViewRef.current ? 'Y' : 'N'}</span>
        </div>
      )}
    </div>
  );
});

export default AutoMarquee;
