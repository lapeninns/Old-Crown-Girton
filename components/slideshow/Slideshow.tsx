"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useId
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Slide from './Slide';
import { slides as defaultSlides } from './slides';
import { useImagePreloader, PreloaderAssetEvent } from './useImagePreloader';
import SlideshowDebugger from './SlideshowDebugger';
import SlideshowSkeleton from './SlideshowSkeleton';
import { useLiveAnnouncements } from './hooks/useLiveAnnouncements';
import { useSlideNavigation } from './hooks/useSlideNavigation';
import { useGestureHandling } from './hooks/useGestureHandling';

const toSrcString = (src: any): string => {
  if (!src) return '';
  if (typeof src === 'string') return src;
  if (typeof src === 'object' && typeof src.src === 'string') return src.src;
  return '';
};

const getPrimaryImageSrc = (image: any): string => {
  if (typeof image === 'object' && image !== null && 'primary' in image) {
    return toSrcString(image.primary);
  }

  if (typeof image === 'string') {
    return image.replace(/\.(png|jpe?g|webp)$/i, '.avif');
  }

  return toSrcString(image);
};

const TRANSITION_MS = 400;

type ConnectionInfo = {
  effectiveType: string | null;
  saveData: boolean;
  downlink: number | null;
  rtt: number | null;
};

type PriorityWeights = Record<'current' | 'next' | 'previous' | 'ahead' | 'background', number>;

interface SlideshowRuntimeConfig {
  preloadCount: number;
  behindCount: number;
  autoplayInterval: number;
  enableTouchOptimization: boolean;
  reduceAnimations: boolean;
  priorityWeights: PriorityWeights;
  cacheSize: number;
  connectionInfo: ConnectionInfo;
}

const DEFAULT_PRIORITY_WEIGHTS: PriorityWeights = {
  current: 0,
  next: 1,
  previous: 2,
  ahead: 3,
  background: 4
};

const SLOW_NETWORK_PRIORITY_WEIGHTS: PriorityWeights = {
  current: 0,
  next: 1,
  previous: 2,
  ahead: 5,
  background: 6
};

const SAVE_DATA_PRIORITY_WEIGHTS: PriorityWeights = {
  current: 0,
  next: 3,
  previous: 4,
  ahead: 6,
  background: 7
};

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768
  );
};

const readConnectionInfo = (): ConnectionInfo => {
  if (typeof navigator === 'undefined') {
    return { effectiveType: null, saveData: false, downlink: null, rtt: null };
  }
  const connection = (navigator as any)?.connection;
  if (!connection) {
    return { effectiveType: null, saveData: false, downlink: null, rtt: null };
  }
  return {
    effectiveType: connection.effectiveType ?? null,
    saveData: Boolean(connection.saveData),
    downlink: typeof connection.downlink === 'number' ? connection.downlink : null,
    rtt: typeof connection.rtt === 'number' ? connection.rtt : null
  };
};

const deriveRuntimeConfig = (connectionInfo: ConnectionInfo, mobile: boolean): SlideshowRuntimeConfig => {
  const slowNetwork = Boolean(connectionInfo.effectiveType && ['slow-2g', '2g', '3g'].includes(connectionInfo.effectiveType));
  const saveData = connectionInfo.saveData;

  const preloadCount = saveData ? 0 : slowNetwork || mobile ? 1 : 2;
  const behindCount = preloadCount > 1 ? 1 : 0;
  const autoplayInterval = mobile ? 6000 : slowNetwork ? 6500 : 5000;
  const reduceAnimations = saveData || slowNetwork;
  const priorityWeights = saveData
    ? SAVE_DATA_PRIORITY_WEIGHTS
    : slowNetwork
      ? SLOW_NETWORK_PRIORITY_WEIGHTS
      : DEFAULT_PRIORITY_WEIGHTS;
  const cacheSize = saveData ? 4 : slowNetwork ? 8 : 16;

  return {
    preloadCount,
    behindCount,
    autoplayInterval,
    enableTouchOptimization: mobile,
    reduceAnimations,
    priorityWeights,
    cacheSize,
    connectionInfo
  };
};

const REQUIRED_SLIDE_IDS = new Set(['slide-ev-charging', 'slide-11']);

const shuffleSlides = (slides: any[]) => {
  const shuffled = [...slides];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const collectSlides = (allSlides: any[]): { required: any[]; optional: any[] } => {
  if (!Array.isArray(allSlides) || allSlides.length === 0) {
    return { required: [], optional: [] };
  }
  const seen = new Set<string>();
  const required: any[] = [];
  const optional: any[] = [];

  allSlides.forEach((slide) => {
    if (!slide || !slide.id || seen.has(slide.id)) return;
    seen.add(slide.id);
    if (REQUIRED_SLIDE_IDS.has(slide.id)) {
      required.push(slide);
    } else {
      optional.push(slide);
    }
  });

  return { required, optional };
};

const selectSessionSlides = (allSlides: any[], targetCount = 5) => {
  const { required, optional } = collectSlides(allSlides);
  if (!required.length && !optional.length) return [];

  const needed = Math.max(0, targetCount - required.length);
  const randomizedOptional = shuffleSlides(optional);
  const selectedOptional = randomizedOptional.slice(0, needed);

  const combined = [...required, ...selectedOptional];

  if (combined.length < targetCount) {
    for (const slide of randomizedOptional) {
      if (combined.length >= targetCount) break;
      if (!combined.includes(slide)) combined.push(slide);
    }
  }

  return shuffleSlides(combined).slice(0, targetCount);
};

const getDefaultSessionSlides = (allSlides: any[], targetCount = 5) => {
  const { required, optional } = collectSlides(allSlides);
  if (!required.length && !optional.length) return [];

  const combined = [...required];
  for (const slide of optional) {
    if (combined.length >= targetCount) break;
    combined.push(slide);
  }

  return combined.slice(0, targetCount);
};

interface SlideshowProps {
  slides?: any[];
  interval?: number;
  autoplay?: boolean;
}

const LOCAL_REDUCED_MOTION_KEY = 'slideshow:reduce-motion';

const Slideshow: React.FC<SlideshowProps> = ({ slides = defaultSlides, interval = 5000, autoplay = true }) => {
  const [sessionSlides, setSessionSlides] = useState(() => getDefaultSessionSlides(slides, 5));
  const slideCount = sessionSlides.length;
  const prefersReduced = useReducedMotion();
  const mobileDevice = useMemo(() => isMobileDevice(), []);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>(() => readConnectionInfo());
  const config = useMemo(() => deriveRuntimeConfig(connectionInfo, mobileDevice), [connectionInfo, mobileDevice]);
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [showPrev, setShowPrev] = useState(false);
  const transitioningRef = useRef(false);
  const [isAutoplaying, setIsAutoplaying] = useState(() => autoplay && slideCount > 1);
  const [hasInitialImageLoaded, setHasInitialImageLoaded] = useState(false);
  const instructionsId = useId();
  const announcedInitialRef = useRef(false);
  const lastAnnouncedIndexRef = useRef(-1);
  const pendingActionsRef = useRef<Array<{ type: 'advance'; direction: 1 | -1 } | { type: 'goto'; index: number }>>([]);
  const processQueueRef = useRef<() => void>(() => {});
  const performanceBufferRef = useRef<PreloaderAssetEvent[]>([]);
  const performanceFlushTimerRef = useRef<number | null>(null);

  const [userReducedMotion] = useState<boolean | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = window.localStorage.getItem(LOCAL_REDUCED_MOTION_KEY);
      if (stored === null) return null;
      return stored === 'true';
    } catch (err) {
      console.warn('Unable to read slideshow motion preference', err);
      return null;
    }
  });

  const effectiveReduceMotion = useMemo(() => {
    if (userReducedMotion !== null) return userReducedMotion;
    return prefersReduced || config.reduceAnimations;
  }, [config.reduceAnimations, prefersReduced, userReducedMotion]);

  useEffect(() => {
    if (userReducedMotion === null) return;
    try {
      window.localStorage.setItem(LOCAL_REDUCED_MOTION_KEY, String(userReducedMotion));
    } catch (err) {
      console.warn('Unable to persist slideshow motion preference', err);
    }
  }, [userReducedMotion]);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const connection = (navigator as any)?.connection;
    if (!connection || typeof connection.addEventListener !== 'function') return;
    const handleChange = () => setConnectionInfo(readConnectionInfo());
    try {
      connection.addEventListener('change', handleChange);
    } catch (error) {
      return;
    }
    return () => {
      try {
        connection.removeEventListener('change', handleChange);
      } catch (error) {
        // no-op
      }
    };
  }, []);

  const flushPerformanceMetrics = useCallback(() => {
    if (!performanceBufferRef.current.length) return;
    const events = performanceBufferRef.current.splice(0, performanceBufferRef.current.length);

    if (process.env.NODE_ENV !== 'production') {
      if (typeof console !== 'undefined' && typeof console.table === 'function') {
        console.table(events.map((event) => ({
          src: event.src,
          status: event.status,
          duration: Math.round(event.duration),
          priority: event.priority,
          bytes: event.bytes ?? 'unknown'
        })));
      }
      return;
    }

    if (typeof navigator === 'undefined') return;
    const payload = {
      type: 'slideshow_asset_metrics',
      events,
      connection: config.connectionInfo,
      url: typeof window !== 'undefined' ? window.location.pathname : undefined,
      timestamp: Date.now()
    };
    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', body);
    } else {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
        keepalive: true
      }).catch(() => {});
    }
  }, [config.connectionInfo]);

  const handleAssetEvent = useCallback((event: PreloaderAssetEvent) => {
    if (event.status === 'loading') return;

    performanceBufferRef.current.push(event);

    if (performanceBufferRef.current.length >= 4) {
      flushPerformanceMetrics();
      if (performanceFlushTimerRef.current && typeof window !== 'undefined') {
        window.clearTimeout(performanceFlushTimerRef.current);
        performanceFlushTimerRef.current = null;
      }
      return;
    }

    if (performanceFlushTimerRef.current || typeof window === 'undefined') return;

    performanceFlushTimerRef.current = window.setTimeout(() => {
      flushPerformanceMetrics();
      if (performanceFlushTimerRef.current) {
        window.clearTimeout(performanceFlushTimerRef.current);
        performanceFlushTimerRef.current = null;
      }
    }, 4000);
  }, [flushPerformanceMetrics]);

  useEffect(() => {
    return () => {
      if (performanceFlushTimerRef.current && typeof window !== 'undefined') {
        window.clearTimeout(performanceFlushTimerRef.current);
        performanceFlushTimerRef.current = null;
      }
      flushPerformanceMetrics();
    };
  }, [flushPerformanceMetrics]);

  useEffect(() => {
    const randomized = selectSessionSlides(slides, 5);
    const newSlides = randomized.length ? randomized : getDefaultSessionSlides(slides, 5);
    setSessionSlides((current) => {
      if (current.length === newSlides.length && current.every((slide, idx) => slide?.id === newSlides[idx]?.id)) {
        return current;
      }
      return newSlides;
    });
    setIndex(0);
    setPrevIndex(null);
    setHasInitialImageLoaded(false);
    announcedInitialRef.current = false;
    lastAnnouncedIndexRef.current = -1;
  }, [slides]);

  useEffect(() => {
    setIsAutoplaying(autoplay && slideCount > 1);
  }, [autoplay, slideCount]);

  const primarySources = useMemo(() => sessionSlides.map((s) => getPrimaryImageSrc(s?.image)), [sessionSlides]);

  const preloaderOptions = useMemo(
    () => ({
      ahead: config.preloadCount,
      behind: config.behindCount,
      background: config.preloadCount > 1 ? 1 : 0,
      priorityWeights: config.priorityWeights,
      maxCache: config.cacheSize,
      onAssetEvent: handleAssetEvent
    }),
    [config.preloadCount, config.behindCount, config.priorityWeights, config.cacheSize, handleAssetEvent]
  );

  const { loaded, waitFor } = useImagePreloader(primarySources, index, preloaderOptions);

  const { announce, liveRegionProps, currentMessage } = useLiveAnnouncements({ politeness: 'polite' });

  const describeSlide = useCallback(
    (idx: number) => {
      const slide = sessionSlides[idx];
      return slide?.headline ?? slide?.alt ?? '';
    },
    [sessionSlides]
  );

  const enqueueAction = useCallback(
    (action: { type: 'advance'; direction: 1 | -1 } | { type: 'goto'; index: number }) => {
      const queue = pendingActionsRef.current;
      const last = queue[queue.length - 1];
      if (last && last.type === action.type) {
        if (last.type === 'advance' && action.type === 'advance' && last.direction === action.direction) {
          return;
        }
        if (last.type === 'goto' && action.type === 'goto' && last.index === action.index) {
          return;
        }
      }
      let dropped = false;
      if (queue.length >= 2) {
        queue.shift();
        dropped = true;
      }
      queue.push(action);
      if (dropped) {
        announce('Skipping oldest slideshow request to stay responsive.');
      }
    },
    [announce]
  );

  const ensureImageReady = useCallback(
    (target: number) => {
      const nextImage = sessionSlides[target]?.image;
      const nextSrc = getPrimaryImageSrc(nextImage);
      if (nextSrc && !loaded.has(nextSrc)) {
        waitFor(nextSrc, Math.max(1000, Math.min(6000, interval)))
          .then((status) => {
            if (status === 'error') {
              console.warn('[slideshow] image failed to preload', nextSrc);
            }
          })
          .catch((error) => {
            console.warn('[slideshow] preload wait failed', error);
          });
      }
    },
    [interval, loaded, sessionSlides, waitFor]
  );

  const startTransitionTo = useCallback(
    (next: number) => {
      if (transitioningRef.current) return;
      transitioningRef.current = true;
      setPrevIndex(index);
      setShowPrev(true);
      setIndex(next);
      if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
        requestAnimationFrame(() => setShowPrev(false));
      } else {
        setTimeout(() => setShowPrev(false), 0);
      }
      window.setTimeout(() => {
        setPrevIndex(null);
        transitioningRef.current = false;
        processQueueRef.current();
      }, TRANSITION_MS + 30);
    },
    [index]
  );

  const goToIndex = useCallback(
    (target: number, options?: { immediate?: boolean }) => {
      if (!slideCount) return false;
      const normalized = ((target % slideCount) + slideCount) % slideCount;
      if (normalized === index && !options?.immediate) return false;
      if (transitioningRef.current && !options?.immediate) {
        enqueueAction({ type: 'goto', index: normalized });
        return false;
      }
      ensureImageReady(normalized);
      startTransitionTo(normalized);
      return true;
    },
    [enqueueAction, ensureImageReady, index, slideCount, startTransitionTo]
  );

  const requestAdvance = useCallback(
    (direction: 1 | -1, options?: { immediate?: boolean }) => {
      if (slideCount <= 1) return false;
      if (transitioningRef.current && !options?.immediate) {
        enqueueAction({ type: 'advance', direction });
        return false;
      }
      const next = (index + direction + slideCount) % slideCount;
      ensureImageReady(next);
      startTransitionTo(next);
      return true;
    },
    [enqueueAction, ensureImageReady, index, slideCount, startTransitionTo]
  );

  const processQueue = useCallback(() => {
    while (pendingActionsRef.current.length) {
      const action = pendingActionsRef.current.shift();
      if (!action) break;
      const executed = action.type === 'advance'
        ? requestAdvance(action.direction, { immediate: true })
        : goToIndex(action.index, { immediate: true });
      if (executed) {
        break;
      }
    }
  }, [goToIndex, requestAdvance]);

  useEffect(() => {
    processQueueRef.current = processQueue;
  }, [processQueue]);

  useEffect(() => {
    if (!slideCount) return;
    const firstSrc = primarySources[0];
    if (firstSrc && loaded.has(firstSrc)) {
      setHasInitialImageLoaded(true);
    }
  }, [loaded, primarySources, slideCount]);

  useEffect(() => {
    if (!hasInitialImageLoaded || announcedInitialRef.current) return;
    if (!slideCount) return;
    announce(`Slide 1 of ${slideCount}: ${describeSlide(0)}`);
    lastAnnouncedIndexRef.current = 0;
    announcedInitialRef.current = true;
  }, [announce, describeSlide, hasInitialImageLoaded, slideCount]);

  useEffect(() => {
    if (!hasInitialImageLoaded) return;
    if (!slideCount) return;
    if (index === lastAnnouncedIndexRef.current) return;
    const message = `Slide ${index + 1} of ${slideCount}: ${describeSlide(index)}`;
    announce(message);
    lastAnnouncedIndexRef.current = index;
  }, [announce, describeSlide, hasInitialImageLoaded, index, slideCount]);

  useEffect(() => {
    if (!isAutoplaying || slideCount <= 1) return;
    if (effectiveReduceMotion) return;
    const intervalMs = config.reduceAnimations ? Math.max(config.autoplayInterval, interval * 1.5) : config.autoplayInterval;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      requestAdvance(1);
    }, intervalMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [config.autoplayInterval, config.reduceAnimations, effectiveReduceMotion, interval, isAutoplaying, requestAdvance, slideCount]);

  const navigation = useSlideNavigation({
    slideCount,
    currentIndex: index,
    isAutoplaying,
    onRequestAdvance: (direction) => {
      requestAdvance(direction);
    },
    onRequestIndex: (targetIndex) => {
      goToIndex(targetIndex);
    },
    onAutoplayChange: (nextValue) => setIsAutoplaying(nextValue && slideCount > 1),
    announce
  });

  const minSwipeDistance = config.enableTouchOptimization ? 30 : 50;
  const gesture = useGestureHandling({
    minSwipeDistance,
    onSwipeLeft: () => {
      void requestAdvance(1);
    },
    onSwipeRight: () => {
      void requestAdvance(-1);
    }
  });

  const incomingInitial = effectiveReduceMotion ? { opacity: 0 } : { opacity: 0, x: 18 };
  const incomingAnimate = effectiveReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 };
  const incomingTransition = effectiveReduceMotion
    ? { duration: 0.2, ease: 'linear' as const }
    : { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const };

  const outgoingTransition = effectiveReduceMotion
    ? { duration: 0.2, ease: 'linear' as const }
    : { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const };

  if (!slideCount) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-neutral-200 text-brand-600 rounded-2xl">
        <span>No slides available.</span>
      </div>
    );
  }

  const containerLabel = 'Featured experiences carousel';

  return (
    <div className="relative">
      {!hasInitialImageLoaded && <SlideshowSkeleton />}
      <motion.div
        className={`relative w-full cursor-grab active:cursor-grabbing select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 rounded-3xl touch-pan-y ${
          hasInitialImageLoaded ? '' : 'pointer-events-none opacity-0'
        }`}
        role="group"
        aria-roledescription="carousel"
        aria-label={containerLabel}
        aria-describedby={instructionsId}
        tabIndex={hasInitialImageLoaded ? 0 : -1}
        style={{ touchAction: 'manipulation' }}
        onKeyDown={navigation.handleKeyDown}
        {...gesture.bindings}
        drag={effectiveReduceMotion ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(event, info) => {
          const { offset, velocity } = info;
          const swipe = Math.abs(offset.x) > 80 || Math.abs(velocity.x) > 300;
          if (!swipe) return;
          if (offset.x < 0) {
            void requestAdvance(1);
          } else {
            void requestAdvance(-1);
          }
        }}
      >
        <p id={instructionsId} className="sr-only">
          Use Left and Right arrow keys to navigate slides, Home or End to jump to first or last slide, Space to pause or resume autoplay, and Escape to stop autoplay.
        </p>
        <div {...liveRegionProps}>{currentMessage}</div>
        {process.env.NODE_ENV !== 'production' && <SlideshowDebugger />}
        <div className="slides-wrapper relative">
          {sessionSlides[index] && (
            <motion.div
              key={`curr-${sessionSlides[index].id}`}
              className="relative z-0"
              initial={incomingInitial}
              animate={incomingAnimate}
              transition={incomingTransition}
            >
              <Slide
                slide={sessionSlides[index]}
                slideIndex={index}
                active
                preloaded={loaded.has(getPrimaryImageSrc(sessionSlides[index].image))}
                announce={announce}
              />
            </motion.div>
          )}
          <AnimatePresence>
            {prevIndex !== null && sessionSlides[prevIndex] && (
              <motion.div
                key={`prev-${sessionSlides[prevIndex].id}`}
                className="absolute inset-0 z-10 pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: showPrev ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={outgoingTransition}
              >
                <Slide
                  slide={sessionSlides[prevIndex]}
                  slideIndex={prevIndex}
                  active={false}
                  visualOnly
                  preloaded
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Slideshow;
