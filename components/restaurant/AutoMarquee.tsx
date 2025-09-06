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
  // Maximum fling speed in px/s (cap applied when releasing drag)
  maxFlingSpeed?: number;
  // Minimum velocity (px/s) required to trigger inertia on release
  minInertiaVelocity?: number;
  // Friction multiplier applied per 60fps frame (0 < frictionPer60fps < 1) — lower = faster decay
  frictionPer60fps?: number;
  // How many copies of the children to render (>= 2)
  duplicates?: number;
  // Optional callbacks
  onDragStart?: () => void;
  onDragEnd?: () => void;
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
    maxFlingSpeed = 2400,
    minInertiaVelocity = 20,
    frictionPer60fps = 0.97,
    duplicates = 2,
    onDragStart,
    onDragEnd,
    onInertiaEnd,
  },
  ref
) {
  // Clamp/validate incoming numeric props to sensible ranges to avoid unexpected behavior
  const safeMaxFling = Math.max(0, Number.isFinite(maxFlingSpeed) ? maxFlingSpeed : 2400);
  const safeMinInertia = Math.max(0, Number.isFinite(minInertiaVelocity) ? minInertiaVelocity : 20);
  // friction should be in (0, 1). Clamp to a safe range [0.6, 0.999]
  const rawFriction = Number.isFinite(frictionPer60fps) ? frictionPer60fps : 0.97;
  const safeFriction = Math.min(0.999, Math.max(0.6, rawFriction));
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
  const draggingRef = useRef<boolean>(false);
  const lastPointerXRef = useRef<number>(0);
  const lastMoveTsRef = useRef<number>(0);
  const inertiaVelRef = useRef<number>(0); // px/s (active after release)
  const inertiaActiveRef = useRef<boolean>(false);
  const inViewRef = useRef<boolean>(true);
  const keyScrollSpeed = 600; // px/s for keyboard nudge

  // Velocity buffer for better inertia estimate (circular)
  const velBuf = useRef<{ v: number; t: number }[]>(Array.from({ length: 8 }, () => ({ v: 0, t: 0 })));
  const velIdx = useRef<number>(0);

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

      // Inertia phase: continue motion after drag release with friction decay
      if (inertiaActiveRef.current && w > 0) {
        offsetRef.current += inertiaVelRef.current * dt;
        // Seamless wrap
        while (offsetRef.current >= 0) offsetRef.current -= w;
        while (offsetRef.current <= -w) offsetRef.current += w;
        // Exponential decay based on dt (~60fps baseline)
        const factor = Math.pow(safeFriction, dt * 60);
        inertiaVelRef.current *= factor;
        // Stop condition (tiny velocity)
        if (Math.abs(inertiaVelRef.current) < 5) {
          inertiaActiveRef.current = false;
          pausedUntilRef.current = performance.now() + resumeAfterMs;
          onInertiaEnd?.();
        }
        applyTransform();
      } else if (!paused && w > 0 && speed > 0) {
        // Normal auto-scroll
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
  }, [speedPxPerSec, resumeAfterMs, direction, safeFriction, dupCount, onInertiaEnd]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const bumpPause = () => { pausedUntilRef.current = performance.now() + resumeAfterMs; };

    const onPointerDown = (e: PointerEvent) => {
      draggingRef.current = true;
      lastPointerXRef.current = e.clientX;
      lastMoveTsRef.current = performance.now();
      // clear buffer
      velBuf.current.fill({ v: 0, t: lastMoveTsRef.current });
      inertiaActiveRef.current = false;
      inertiaVelRef.current = 0;
      onDragStart?.();
      // Pause immediately on interaction
      bumpPause();
      try { (e.currentTarget as Element).setPointerCapture?.(e.pointerId); } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current || !trackRef.current) return;
      e.preventDefault();
      const currentX = e.clientX;
      const dx = currentX - lastPointerXRef.current;
      lastPointerXRef.current = currentX;
      const now = performance.now();
      const dt = Math.max(0.001, (now - lastMoveTsRef.current) / 1000);
      lastMoveTsRef.current = now;
      // instantaneous velocity sample
      const v = dx / dt; // px/s
      velBuf.current[velIdx.current] = { v, t: now };
      velIdx.current = (velIdx.current + 1) % velBuf.current.length;

      offsetRef.current += dx;
      // Normalize to seamless range
      const w = setWidthRef.current;
      if (w > 0) {
        while (offsetRef.current >= 0) offsetRef.current -= w;
        while (offsetRef.current <= -w) offsetRef.current += w;
      }
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    };

    const endDrag = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      onDragEnd?.();
      // Weighted average of recent velocities
      const now = performance.now();
      const recent = velBuf.current.filter(s => now - s.t < 200);
      let v = 0;
      if (recent.length) {
        // time-weighted average to reduce jitter
        const weights = recent.map((s, i) => (i + 1));
        const sumW = weights.reduce((a, b) => a + b, 0);
        const sum = recent.reduce((acc, s, i) => acc + s.v * weights[i], 0);
        v = sum / sumW;
      }
      const maxV = safeMaxFling; // px/s cap
      v = Math.max(-maxV, Math.min(maxV, v));
      if (Math.abs(v) > safeMinInertia) {
        inertiaVelRef.current = v;
        inertiaActiveRef.current = true;
      }
      // Short pause to avoid immediate handoff
      bumpPause();
    };

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove, { passive: false });
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('pointerleave', endDrag);
    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove as any);
      viewport.removeEventListener('pointerup', endDrag as any);
      viewport.removeEventListener('pointercancel', endDrag as any);
      viewport.removeEventListener('pointerleave', endDrag as any);
    };
  }, [resumeAfterMs, safeMaxFling, safeMinInertia, onDragStart, onDragEnd]);

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
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const dt = 1 / 60; // one frame nudge
      offsetRef.current += dir * keyScrollSpeed * dt;
      while (offsetRef.current >= 0) offsetRef.current -= w;
      while (offsetRef.current <= -w) offsetRef.current += w;
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      // nudge pauses auto briefly
      pausedUntilRef.current = performance.now() + 600;
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
          <span className="mx-2">|</span>
          <span>Inertia: {inertiaActiveRef.current ? 'Y' : 'N'}</span>
        </div>
      )}
    </div>
  );
});

export default AutoMarquee;
