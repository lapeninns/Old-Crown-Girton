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
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const [loadingStates, setLoadingStates] = useState<
    Map<string, 'loading' | 'loaded' | 'error'>
  >(new Map());
  const loadingMap = useRef<Map<string, HTMLImageElement>>(new Map());
  const listenersRef = useRef<
    Map<string, Array<(status: 'loaded' | 'error') => void>>
  >(new Map());

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
      // If src is already a built/static asset or data URL, skip Next image proxying
      if (!rawSrc) return rawSrc;
      if (rawSrc.startsWith('/_next/') || rawSrc.startsWith('data:') || rawSrc.startsWith('blob:') || /^https?:\/\//.test(rawSrc)) {
        return rawSrc;
      }
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
      if (!src || loaded.has(src) || failed.has(src) || loadingMap.current.has(src)) return;
      try {
        const img = new Image();
        loadingMap.current.set(src, img);
        const start = performance.now();
        const markLoaded = () => {
          setLoaded((prev) => {
            const next = new Set(prev).add(src);
            return next;
          });
          setLoadingStates((prev) => new Map(prev).set(src, 'loaded'));
          const listeners = listenersRef.current.get(src);
          if (listeners) {
            listeners.forEach((cb) => cb('loaded'));
            listenersRef.current.delete(src);
          }
          loadingMap.current.delete(src);
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.debug(`[preload] ${src} decoded in ${(performance.now() - start).toFixed(0)}ms`);
          }
        };
        const markError = () => {
          setFailed((prev) => new Set(prev).add(src));
          setLoadingStates((prev) => new Map(prev).set(src, 'error'));
          const listeners = listenersRef.current.get(src);
          if (listeners) {
            listeners.forEach((cb) => cb('error'));
            listenersRef.current.delete(src);
          }
          loadingMap.current.delete(src);
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(`[preload] failed to load ${src}`);
          }
        };
        img.onload = () => {
          // Ensure the image is decoded before marking as loaded to avoid flicker
          if ('decode' in img && typeof (img as any).decode === 'function') {
            (img as any)
              .decode()
              .then(markLoaded)
              .catch(() => markLoaded());
          } else {
            markLoaded();
          }
        };
        img.onerror = () => {
          markError();
        };
        img.decoding = "async";
  setLoadingStates((prev) => new Map(prev).set(src, 'loading'));
        // Give hint to browser (supported in modern browsers)
        (img as any).fetchPriority = 'low';
        img.src = buildOptimizedUrl(src);
        // If the image is already cached, onload may not fire; handle synchronous complete
        if ((img as any).complete && (img as any).naturalWidth > 0) {
          if ('decode' in img && typeof (img as any).decode === 'function') {
            (img as any)
              .decode()
              .then(markLoaded)
              .catch(() => markLoaded());
          } else {
            markLoaded();
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[preload] exception creating Image for', src, e);
      }
    });

    // Optional: cleanup any that fell out of window (keep cache in state though)
    // We won't revoke anything here; browser cache handles memory.
  }, [windowSources, loaded, failed]);

  const waitFor = (src: string, timeoutMs = 5000): Promise<'loaded' | 'error' | 'timeout'> => {
    if (!src) return Promise.resolve('error');
    if (loaded.has(src)) return Promise.resolve('loaded');
    if (failed.has(src)) return Promise.resolve('error');

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        // Give up waiting; do not clear listeners so it can still resolve later for others
        resolve('timeout');
      }, timeoutMs);
      const arr = listenersRef.current.get(src) || [];
      arr.push((status) => {
        clearTimeout(timer);
        if (status === 'loaded') setLoadingStates((prev) => new Map(prev).set(src, 'loaded'));
        if (status === 'error') setLoadingStates((prev) => new Map(prev).set(src, 'error'));
        resolve(status);
      });
      listenersRef.current.set(src, arr);
    });
  };

  return { loaded, loadingStates, waitFor };
}
