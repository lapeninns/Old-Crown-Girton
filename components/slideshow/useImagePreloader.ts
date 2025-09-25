"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LRUCache } from 'lru-cache';

const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

type PreloadPriorityKey = 'current' | 'next' | 'previous' | 'ahead' | 'background';

type PriorityMap = Record<PreloadPriorityKey, number>;

const DEFAULT_PRIORITY_MAP: PriorityMap = {
  current: 0,
  next: 1,
  previous: 2,
  ahead: 3,
  background: 4
};

type AssetEvent = {
  src: string;
  status: 'loading' | 'loaded' | 'error' | 'timeout' | 'aborted';
  duration: number;
  priority: number;
  bytes: number | null;
  startedAt: number;
};

export type PreloaderAssetEvent = AssetEvent;

interface PreloadTask {
  controller: AbortController;
  state: 'loading' | 'loaded' | 'error' | 'aborted';
  priority: number;
  startedAt: number;
}

// Helper function to extract src from image objects or return string as-is
function extractImageSrc(src: string | any): string {
  if (typeof src === 'string') return src;
  if (src && typeof src === 'object' && src.src) return src.src;
  if (src && typeof src === 'object') {
    console.warn('[preload] Invalid image source object:', src);
    return '';
  }
  return '';
}

// Preload next/prev images around the current index.
// Returns a Set of srcs that have successfully loaded.
interface PreloadOptions {
  ahead?: number;
  behind?: number;
  background?: number;
  priorityWeights?: Partial<PriorityMap>;
  maxCache?: number;
  onAssetEvent?: AssetEventHandler;
}

/* eslint-disable no-unused-vars */
type ListenerState = 'loaded' | 'error';
type Listener = (state: ListenerState) => void;
type AssetEventHandler = (event: AssetEvent) => void;
/* eslint-enable no-unused-vars */

export function useImagePreloader(
  sources: (string | any)[],
  currentIndex: number,
  options?: PreloadOptions
) {
  const ahead = options?.ahead ?? 2;
  const behind = options?.behind ?? 1;
  const background = options?.background ?? 0;
  const priorityWeights: PriorityMap = useMemo(() => ({
    ...DEFAULT_PRIORITY_MAP,
    ...(options?.priorityWeights ?? {})
  }), [options?.priorityWeights]);
  const onAssetEvent = options?.onAssetEvent;
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const [loadingStates, setLoadingStates] = useState<
    Map<string, 'loading' | 'loaded' | 'error'>
  >(new Map());
  const loadingMap = useRef<Map<string, PreloadTask>>(new Map());
  const listenersRef = useRef<Map<string, Listener[]>>(new Map());
  const cacheRef = useRef<LRUCache<string, boolean> | null>(null);

  const maxCache = options?.maxCache ?? 12;
  if (!cacheRef.current || cacheRef.current.max !== maxCache) {
    cacheRef.current = new LRUCache<string, boolean>({
      max: maxCache,
      dispose: (_value, key) => {
        setLoaded((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
        setLoadingStates((prev) => {
          const next = new Map(prev);
          next.delete(key);
          return next;
        });
      }
    });
  }

  const windowPlan = useMemo(() => {
    if (!sources?.length) return [] as Array<{ src: string; priority: number }>;
    const n = sources.length;
    const plan = new Map<string, { src: string; priority: number }>();

    const assign = (rawSrc: string | null, key: PreloadPriorityKey) => {
      if (!rawSrc) return;
      const priority = priorityWeights[key];
      if (!plan.has(rawSrc) || plan.get(rawSrc)!.priority > priority) {
        plan.set(rawSrc, { src: rawSrc, priority });
      }
    };

    const currentSrc = extractImageSrc(sources[currentIndex % n]);
    assign(currentSrc, 'current');

    for (let i = 1; i <= ahead; i += 1) {
      const src = extractImageSrc(sources[(currentIndex + i) % n]);
      assign(src, i === 1 ? 'next' : 'ahead');
    }

    for (let i = 1; i <= behind; i += 1) {
      const src = extractImageSrc(sources[(currentIndex - i + n) % n]);
      assign(src, i === 1 ? 'previous' : 'background');
    }

    if (background > 0) {
      for (let i = ahead + 1; i <= ahead + background; i += 1) {
        const src = extractImageSrc(sources[(currentIndex + i) % n]);
        assign(src, 'background');
      }
    }

    return Array.from(plan.values()).sort((a, b) => a.priority - b.priority);
  }, [sources, currentIndex, ahead, behind, background, priorityWeights]);

  const buildOptimizedUrl = useCallback((rawSrc: string) => {
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
      const w = DEVICE_SIZES.find((s) => s >= target) || DEVICE_SIZES[DEVICE_SIZES.length - 1];
      const url = `/_next/image?url=${encodeURIComponent(rawSrc)}&w=${w}&q=75`;
      return url;
    } catch (_) {
      return rawSrc;
    }
  }, []);

  useEffect(() => {
    if (!windowPlan.length) return;

    const activeSources = new Set(windowPlan.map((entry) => entry.src));

    windowPlan.forEach(({ src, priority }) => {
      if (!src || loaded.has(src) || failed.has(src) || loadingMap.current.has(src)) return;

      const controller = new AbortController();
      const startedAt = performance.now();
      const task: PreloadTask = { controller, state: 'loading', priority, startedAt };
      loadingMap.current.set(src, task);
      setLoadingStates((prev) => {
        const next = new Map(prev);
        next.set(src, 'loading');
        return next;
      });
      onAssetEvent?.({ src, status: 'loading', duration: 0, priority, bytes: null, startedAt });

      const optimizedUrl = buildOptimizedUrl(src);

      fetch(optimizedUrl, { signal: controller.signal, cache: 'force-cache' })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`Failed to preload image (${response.status})`);
          }
          const contentLength = response.headers.get('content-length');
          const bytes = contentLength ? Number(contentLength) : null;
          const blob = await response.blob();
          if (typeof window !== 'undefined' && 'createImageBitmap' in window && typeof window.createImageBitmap === 'function') {
            try {
              await window.createImageBitmap(blob);
            } catch (bitmapError) {
              // ignore decode errors; fallback to normal load
            }
          }
          return { bytes: bytes ?? blob.size ?? null };
        })
        .then(({ bytes }) => {
          task.state = 'loaded';
          cacheRef.current?.set(src, true);
          setLoaded((prev) => {
            const next = new Set(prev);
            next.add(src);
            return next;
          });
          setLoadingStates((prev) => {
            const next = new Map(prev);
            next.set(src, 'loaded');
            return next;
          });
          loadingMap.current.delete(src);
          const listeners = listenersRef.current.get(src);
          if (listeners) {
            listeners.forEach((cb) => cb('loaded'));
            listenersRef.current.delete(src);
          }
          const duration = performance.now() - startedAt;
          onAssetEvent?.({ src, status: 'loaded', duration, priority, bytes, startedAt });
        })
        .catch((error) => {
          const duration = performance.now() - startedAt;
          loadingMap.current.delete(src);
          const listeners = listenersRef.current.get(src);

          if (error.name === 'AbortError') {
            task.state = 'aborted';
            setLoadingStates((prev) => {
              const next = new Map(prev);
              next.delete(src);
              return next;
            });
            if (listeners) {
              listeners.forEach((cb) => cb('error'));
              listenersRef.current.delete(src);
            }
            onAssetEvent?.({ src, status: 'aborted', duration, priority, bytes: null, startedAt });
            return;
          }

          task.state = 'error';
          setFailed((prev) => {
            const next = new Set(prev);
            next.add(src);
            return next;
          });
          setLoadingStates((prev) => {
            const next = new Map(prev);
            next.set(src, 'error');
            return next;
          });
          if (listeners) {
            listeners.forEach((cb) => cb('error'));
            listenersRef.current.delete(src);
          }
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[preload] failed to load', src, error);
          }
          onAssetEvent?.({ src, status: 'error', duration, priority, bytes: null, startedAt });
        });
    });

    // Abort any in-flight loads that are no longer needed
    loadingMap.current.forEach((task, src) => {
      if (!activeSources.has(src) && task.state === 'loading') {
        task.controller.abort();
      }
    });
  }, [windowPlan, loaded, failed, buildOptimizedUrl, onAssetEvent]);

  const waitFor = (src: string | any, timeoutMs = 5000): Promise<'loaded' | 'error' | 'timeout'> => {
    const normalizedSrc = extractImageSrc(src);
    if (!normalizedSrc) return Promise.resolve('error');
    if (loaded.has(normalizedSrc)) return Promise.resolve('loaded');
    if (failed.has(normalizedSrc)) return Promise.resolve('error');

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        // Give up waiting; do not clear listeners so it can still resolve later for others
        resolve('timeout');
      }, timeoutMs);
      const arr = listenersRef.current.get(normalizedSrc) || [];
      arr.push((status) => {
        clearTimeout(timer);
        if (status === 'loaded') setLoadingStates((prev) => new Map(prev).set(normalizedSrc, 'loaded'));
        if (status === 'error') setLoadingStates((prev) => new Map(prev).set(normalizedSrc, 'error'));
        resolve(status);
      });
      listenersRef.current.set(normalizedSrc, arr);
    });
  };

  useEffect(() => {
    const activeLoadingMap = loadingMap.current;
    const activeListenersMap = listenersRef.current;
    return () => {
      activeLoadingMap.forEach((task) => {
        if (task.state === 'loading') {
          task.controller.abort();
        }
      });
      activeLoadingMap.clear();
      activeListenersMap.clear();
    };
  }, []);

  return { loaded, loadingStates, waitFor };
}
