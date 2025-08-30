"use client";

import React, { useEffect, useRef } from 'react';

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
}

// Accessible, reduced-motion-friendly auto-scrolling marquee
export const AutoMarquee: React.FC<AutoMarqueeProps> = ({
  children,
  speedPxPerSec = 40,
  resumeAfterMs = 2500,
  ariaLabel,
  direction = 'right',
  maxFlingSpeed = 1200,
  minInertiaVelocity = 40,
  frictionPer60fps = 0.92,
}) => {
  // Clamp/validate incoming numeric props to sensible ranges to avoid unexpected behavior
  const safeMaxFling = Math.max(0, Number.isFinite(maxFlingSpeed) ? maxFlingSpeed : 1200);
  const safeMinInertia = Math.max(0, Number.isFinite(minInertiaVelocity) ? minInertiaVelocity : 40);
  // friction should be in (0, 1). Clamp to a safe range [0.6, 0.999]
  const rawFriction = Number.isFinite(frictionPer60fps) ? frictionPer60fps : 0.92;
  const safeFriction = Math.min(0.999, Math.max(0.6, rawFriction));
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const setWidthRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const pausedUntilRef = useRef<number>(0);
  const [prefersReduced, setPrefersReduced] = React.useState<boolean>(false);
  const draggingRef = useRef<boolean>(false);
  const lastPointerXRef = useRef<number>(0);
  const lastMoveTsRef = useRef<number>(0);
  const dragVelRef = useRef<number>(0); // px/s (smoothed while dragging)
  const inertiaVelRef = useRef<number>(0); // px/s (active after release)
  const inertiaActiveRef = useRef<boolean>(false);

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

  if (prefersReduced) {
    return (
      <div className="overflow-x-auto py-6 sm:py-8" aria-roledescription="carousel" aria-label={ariaLabel || 'Items'}>
        <div className="flex gap-4 sm:gap-6 items-stretch px-2">
          {children}
        </div>
      </div>
    );
  }

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
      setWidthRef.current = full / 2;
      // Initialize offset based on direction so movement starts seamless
      offsetRef.current = direction === 'right' ? -setWidthRef.current : 0;
      applyTransform();
    };

    const step = (ts: number) => {
      if (!trackRef.current) return;
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.max(0, Math.min(0.05, (ts - lastTsRef.current) / 1000));
      lastTsRef.current = ts;
      const now = performance.now();
      const paused = now < pausedUntilRef.current;
      const speed = speedPxPerSec;
      const w = setWidthRef.current;

      // Inertia phase: continue motion after drag release with friction decay
      if (inertiaActiveRef.current && w > 0) {
        offsetRef.current += inertiaVelRef.current * dt;
        // Seamless wrap
        while (offsetRef.current >= 0) offsetRef.current -= w;
        while (offsetRef.current <= -w) offsetRef.current += w;
        // Exponential decay based on dt (~60fps baseline)
        // Use configurable friction multiplier per 60fps frame
  const factor = Math.pow(safeFriction, dt * 60);
        inertiaVelRef.current *= factor;
        // Stop condition (tiny velocity) — keep small threshold
        if (Math.abs(inertiaVelRef.current) < 5) {
          inertiaActiveRef.current = false;
          // small pause before normal auto resumes
          pausedUntilRef.current = performance.now() + resumeAfterMs;
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
      rafRef.current = requestAnimationFrame(step);
    };

    const onResize = () => recalc();
    recalc();
    window.addEventListener('resize', onResize);
    rafRef.current = requestAnimationFrame(step);
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speedPxPerSec, resumeAfterMs, direction, frictionPer60fps]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const bumpPause = () => { pausedUntilRef.current = performance.now() + resumeAfterMs; };

    const onPointerDown = (e: PointerEvent) => {
      draggingRef.current = true;
      lastPointerXRef.current = e.clientX;
      lastMoveTsRef.current = performance.now();
      dragVelRef.current = 0;
      inertiaActiveRef.current = false;
      inertiaVelRef.current = 0;
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
      // instantaneous velocity, then smooth
      const v = dx / dt; // px/s
      // smooth with simple low-pass
      dragVelRef.current = dragVelRef.current * 0.8 + v * 0.2;
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
      // Begin inertia with clamped velocity
      const maxV = safeMaxFling; // px/s cap
      let v = Math.max(-maxV, Math.min(maxV, dragVelRef.current));
      // If velocity is above configured minimum, start inertia
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
  }, [resumeAfterMs, maxFlingSpeed, minInertiaVelocity]);

  return (
    <div ref={viewportRef} className="overflow-hidden py-6 sm:py-8 select-none" aria-roledescription="carousel" aria-label={ariaLabel || 'Items (auto scrolling)'}>
      <div ref={trackRef} className="flex gap-4 sm:gap-6 items-stretch will-change-transform">
        {children}
        {children}
      </div>
    </div>
  );
};

export default AutoMarquee;
