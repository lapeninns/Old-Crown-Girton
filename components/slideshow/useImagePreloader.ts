"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Preload next/prev images around the current index.
// Returns a Set of srcs that have successfully loaded.
export function useImagePreloader(
  sources: string[],
  currentIndex: number,
  options?: { ahead?: number; behind?: number }
) {
  const ahead = options?.ahead ?? 2; // preload next N images
  const behind = options?.behind ?? 1; // optionally keep previous in cache
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const loadingMap = useRef<Map<string, HTMLImageElement>>(new Map());

  // Compute a small window of images to preload around the current index
  const windowSources = useMemo(() => {
    if (!sources?.length) return [] as string[];
    const n = sources.length;
    const wanted = new Set<string>();
    // include current
    wanted.add(sources[currentIndex % n]);
    // next ahead
    for (let i = 1; i <= ahead; i++) {
      wanted.add(sources[(currentIndex + i) % n]);
    }
    // previous behind
    for (let i = 1; i <= behind; i++) {
      wanted.add(sources[(currentIndex - i + n) % n]);
    }
    return Array.from(wanted);
  }, [sources, currentIndex, ahead, behind]);

  // Device sizes from next.config.js (default loader)
  const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

  const buildOptimizedUrl = (rawSrc: string) => {
    // Approximate width selection similar to Next's logic for sizes="100vw"
    try {
      const vw = Math.max(1, Math.floor(window.innerWidth || 1080));
      const dpr = Math.min(3, Math.max(1, Math.round((window.devicePixelRatio || 1) * 100) / 100));
      const target = Math.ceil(vw * dpr);
      const w = deviceSizes.find((s) => s >= target) || deviceSizes[deviceSizes.length - 1];
      const url = `/_next/image?url=${encodeURIComponent(rawSrc)}&w=${w}&q=75`;
      return url;
    } catch (_) {
      return rawSrc;
    }
  };

  useEffect(() => {
    if (!windowSources.length) return;

    windowSources.forEach((src) => {
      if (!src || loaded.has(src) || loadingMap.current.has(src)) return;
      try {
        const img = new Image();
        loadingMap.current.set(src, img);
        const start = performance.now();
        img.onload = () => {
          setLoaded((prev) => new Set(prev).add(src));
          loadingMap.current.delete(src);
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.debug(`[preload] ${src} loaded in ${(performance.now() - start).toFixed(0)}ms`);
          }
        };
        img.onerror = () => {
          loadingMap.current.delete(src);
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(`[preload] failed to load ${src}`);
          }
        };
        img.decoding = "async";
        // Give hint to browser (supported in modern browsers)
        (img as any).fetchPriority = 'low';
        img.src = buildOptimizedUrl(src);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[preload] exception creating Image for', src, e);
      }
    });

    // Optional: cleanup any that fell out of window (keep cache in state though)
    // We won't revoke anything here; browser cache handles memory.
  }, [windowSources, loaded]);

  return loaded;
}
