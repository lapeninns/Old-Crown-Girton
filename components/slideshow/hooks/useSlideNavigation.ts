"use client";

import { useCallback, useRef } from "react";
import type React from "react";

/* eslint-disable no-unused-vars */
type AdvanceHandler = (direction: 1 | -1) => void;
type IndexHandler = (index: number) => void;
type AutoplayHandler = (nextValue: boolean) => void;
type AnnounceHandler = (message: string) => void;
/* eslint-enable no-unused-vars */

export interface SlideNavigationOptions {
  slideCount: number;
  currentIndex: number;
  isAutoplaying: boolean;
  autoplayEnabled?: boolean;
  onRequestAdvance: AdvanceHandler;
  onRequestIndex: IndexHandler;
  onAutoplayChange: AutoplayHandler;
  announce: AnnounceHandler;
}

export interface SlideNavigationApi {
  handleKeyDown: React.KeyboardEventHandler<HTMLElement>;
  toggleAutoplay: () => void;
  stopAutoplay: () => void;
}

const KEY_ARROW_LEFT = "ArrowLeft";
const KEY_ARROW_RIGHT = "ArrowRight";
const KEY_HOME = "Home";
const KEY_END = "End";
const KEY_SPACE = " ";
const KEY_ENTER = "Enter";
const KEY_ESCAPE = "Escape";

export function useSlideNavigation(options: SlideNavigationOptions): SlideNavigationApi {
  const {
    slideCount,
    currentIndex: _currentIndex,
    isAutoplaying,
    autoplayEnabled = true,
    onRequestAdvance,
    onRequestIndex,
    onAutoplayChange,
    announce
  } = options;

  void _currentIndex;

  const lastActionRef = useRef<"next" | "prev" | "goto" | "toggle" | "stop" | null>(null);

  const requestIndex = useCallback(
    (index: number) => {
      if (slideCount <= 0) return;
      const clamped = ((index % slideCount) + slideCount) % slideCount;
      onRequestIndex(clamped);
      lastActionRef.current = "goto";
    },
    [onRequestIndex, slideCount]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (slideCount <= 1) return;
      const { key, shiftKey } = event;
      switch (key) {
        case KEY_ARROW_RIGHT:
        case "PageDown":
          event.preventDefault();
          onRequestAdvance(1);
          lastActionRef.current = "next";
          break;
        case KEY_ARROW_LEFT:
        case "PageUp":
          event.preventDefault();
          onRequestAdvance(-1);
          lastActionRef.current = "prev";
          break;
        case KEY_HOME:
          event.preventDefault();
          requestIndex(0);
          break;
        case KEY_END:
          event.preventDefault();
          requestIndex(slideCount - 1);
          break;
        case KEY_SPACE:
        case KEY_ENTER:
          if (!shiftKey && autoplayEnabled) {
            event.preventDefault();
            const nextValue = !isAutoplaying;
            onAutoplayChange(nextValue);
            lastActionRef.current = "toggle";
            announce(nextValue ? "Autoplay resumed" : "Autoplay paused");
          }
          break;
        case KEY_ESCAPE:
          if (autoplayEnabled && isAutoplaying) {
            event.preventDefault();
            onAutoplayChange(false);
            lastActionRef.current = "stop";
            announce("Autoplay stopped");
          }
          break;
        default:
          break;
      }
    },
    [announce, autoplayEnabled, isAutoplaying, onAutoplayChange, onRequestAdvance, requestIndex, slideCount]
  );

  const toggleAutoplay = useCallback(() => {
    if (!autoplayEnabled) return;
    const nextValue = !isAutoplaying;
    onAutoplayChange(nextValue);
    lastActionRef.current = "toggle";
    announce(nextValue ? "Autoplay resumed" : "Autoplay paused");
  }, [announce, autoplayEnabled, isAutoplaying, onAutoplayChange]);

  const stopAutoplay = useCallback(() => {
    if (!autoplayEnabled || !isAutoplaying) return;
    onAutoplayChange(false);
    lastActionRef.current = "stop";
    announce("Autoplay stopped");
  }, [announce, autoplayEnabled, isAutoplaying, onAutoplayChange]);

  return {
    handleKeyDown,
    toggleAutoplay,
    stopAutoplay
  };
}

export default useSlideNavigation;
