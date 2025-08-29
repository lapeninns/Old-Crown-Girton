"use client";

import { useEffect } from "react";
import type { FC } from 'react';

const SlideshowDebugger: FC = () => {
  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return;
    const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
      list.getEntries().forEach((entry) => {
        if (typeof entry.name === 'string' && entry.name.includes('/images/slideshow/')) {
          // eslint-disable-next-line no-console
          console.log('[slideshow] image resource', {
            name: entry.name,
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime)
          });
        }
      });
    });
    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('PerformanceObserver resource not supported', e);
    }
    return () => observer.disconnect();
  }, []);
  return null;
};

export default SlideshowDebugger;
