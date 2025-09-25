"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type React from "react";

interface GestureOptions {
  minSwipeDistance: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

type GestureBinding = {
  onTouchStart: React.TouchEventHandler;
  onTouchMove: React.TouchEventHandler;
  onTouchEnd: React.TouchEventHandler;
  onMouseDown: React.MouseEventHandler;
  onMouseMove: React.MouseEventHandler;
  onMouseUp: React.MouseEventHandler;
  onMouseLeave: () => void;
};

export interface GestureHandlingApi {
  bindings: GestureBinding;
  isDragging: boolean;
  velocity: number;
}

export function useGestureHandling(options: GestureOptions): GestureHandlingApi {
  const { minSwipeDistance, onSwipeLeft, onSwipeRight, onInteractionStart, onInteractionEnd } = options;
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const mouseStartTime = useRef<number | null>(null);
  const mouseEndX = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState(0);

  const finishInteraction = useCallback(() => {
    setIsDragging(false);
    onInteractionEnd?.();
  }, [onInteractionEnd]);

  const computeVelocity = useCallback((startX: number | null, endX: number | null, startTime: number | null) => {
    if (startX === null || endX === null || startTime === null) return 0;
    const distance = startX - endX;
    const delta = window.performance.now() - startTime;
    if (delta <= 0) return 0;
    return distance / delta; // px per ms
  }, []);

  const triggerSwipe = useCallback(
    (distance: number, computedVelocity: number) => {
      let handled = false;
      if (distance > minSwipeDistance) {
        onSwipeLeft();
        setVelocity(computedVelocity);
        handled = true;
      }
      if (distance < -minSwipeDistance) {
        onSwipeRight();
        setVelocity(computedVelocity);
        handled = true;
      }
      if (!handled) {
        setVelocity(0);
      }
    },
    [minSwipeDistance, onSwipeLeft, onSwipeRight]
  );

  const bindings = useMemo<GestureBinding>(() => ({
    onTouchStart: (event) => {
      if (event.touches.length !== 1) return;
      touchEndX.current = null;
      touchStartX.current = event.touches[0].clientX;
      touchStartTime.current = window.performance.now();
      setIsDragging(true);
      onInteractionStart?.();
    },
    onTouchMove: (event) => {
      if (event.touches.length !== 1) return;
      touchEndX.current = event.touches[0].clientX;
    },
    onTouchEnd: () => {
      if (touchStartX.current == null || touchStartTime.current == null) {
        finishInteraction();
        return;
      }
      const end = touchEndX.current ?? touchStartX.current;
      const distance = touchStartX.current - end;
      const vel = computeVelocity(touchStartX.current, end, touchStartTime.current);
      triggerSwipe(distance, vel);
      touchStartX.current = null;
      touchStartTime.current = null;
      touchEndX.current = null;
      finishInteraction();
    },
    onMouseDown: (event) => {
      mouseStartX.current = event.clientX;
      mouseStartTime.current = window.performance.now();
      mouseEndX.current = null;
      setIsDragging(true);
      onInteractionStart?.();
    },
    onMouseMove: (event) => {
      if (!isDragging) return;
      mouseEndX.current = event.clientX;
    },
    onMouseUp: () => {
      if (!isDragging) {
        finishInteraction();
        return;
      }
      const end = mouseEndX.current ?? mouseStartX.current;
      const distance = (mouseStartX.current ?? end ?? 0) - (end ?? 0);
      const vel = computeVelocity(mouseStartX.current, end, mouseStartTime.current);
      triggerSwipe(distance, vel);
      mouseStartX.current = null;
      mouseStartTime.current = null;
      mouseEndX.current = null;
      finishInteraction();
    },
    onMouseLeave: () => {
      if (!isDragging) return;
      mouseStartX.current = null;
      mouseStartTime.current = null;
      mouseEndX.current = null;
      finishInteraction();
    }
  }), [computeVelocity, finishInteraction, isDragging, onInteractionStart, triggerSwipe]);

  return {
    bindings,
    isDragging,
    velocity
  };
}

export default useGestureHandling;
