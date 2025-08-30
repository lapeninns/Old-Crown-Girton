"use client";

import { useEffect } from 'react';

type Options = {
  enabled?: boolean;
  onNext: () => void;
  onPrev: () => void;
  // Dynamic gate: avoid navigation when mid-transition/drag
  canNavigate?: boolean | (() => boolean);
  // Optional throttle window (ms) to prevent rapid fire
  throttleMs?: number;
  // Minimum delta to consider a horizontal intent
  threshold?: number;
};

export function useWheelNavigate(ref: React.RefObject<HTMLElement>, opts: Options) {
  const { enabled = true, onNext, onPrev } = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let lastNav = 0;
    const throttle = opts.throttleMs ?? 420;
    const threshold = opts.threshold ?? 40; // device/trackpad friendly

    const canGo = () => {
      if (typeof opts.canNavigate === 'function') return opts.canNavigate();
      if (typeof opts.canNavigate === 'boolean') return opts.canNavigate;
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      // Only if horizontal intent dominates; allow vertical scroll to bubble naturally
      const dx = e.deltaX;
      const dy = e.deltaY;
      const now = performance.now();
      if (Math.abs(dx) < Math.max(Math.abs(dy), threshold)) return;
      if (!canGo()) return;
      if (now - lastNav < throttle) return;
      lastNav = now;

      if (dx > 0) onNext();
      else if (dx < 0) onPrev();
    };

    el.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [ref, enabled, onNext, onPrev, opts.throttleMs, opts.threshold, opts.canNavigate]);
}

