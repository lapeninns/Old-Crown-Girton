'use client';

import React, { useEffect, ReactNode } from 'react';

declare global {
  interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
  }
  interface EventTiming extends PerformanceEntry {
    interactionId: number;
    processingStart: number;
  }
}

export function PerformanceProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource' && (entry as PerformanceResourceTiming).name?.includes('image')) {
          console.log(`Image ${(entry as PerformanceResourceTiming).name} loaded in ${entry.duration}ms`);
        } else if (entry.entryType === 'largest-contentful-paint') {
          console.log(`LCP: ${entry.startTime}ms`);
        } else if (entry.entryType === 'layout-shift') {
          const lsEntry = entry as LayoutShift;
          console.log(`CLS entry: ${lsEntry.hadRecentInput ? 'Input' : 'No input'} value ${lsEntry.value}`);
        } else if (entry.entryType === 'event') {
          const etEntry = entry as EventTiming;
          if (etEntry.interactionId !== undefined) {
            console.log(`INP: ${etEntry.processingStart - etEntry.startTime}ms`);
          }
        }
      });
    });

    observer.observe({ 
      entryTypes: ['resource', 'largest-contentful-paint', 'layout-shift', 'event'],
      buffered: true 
    });

    // Debug flag for lazy logs
    if (localStorage.getItem('debugLazy') === 'true') {
      // Log enter observe etc. – integrate with lazy utils if needed
      console.log('Lazy V2 enabled, monitoring...');
    }

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}