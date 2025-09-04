/**
 * Progressive Loading States Hook - Production Safe
 * Optimized for low-end devices with leak-proof retry logic
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

export interface ProgressiveLoadingState {
  status: 'idle' | 'loading' | 'success' | 'error' | 'retrying' | 'stale';
  progress?: number;
  error?: string;
  retryCount?: number;
  networkSpeed?: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  estimatedTime?: number;
  isBackground?: boolean;
}

export interface ProgressiveLoadingOptions {
  maxRetries?: number;
  retryDelay?: number;
  enableNetworkAwareness?: boolean;
  enableProgressTracking?: boolean;
  staleWhileRevalidate?: boolean;
  backgroundRefresh?: boolean;
}

/**
 * Production-safe progressive loading hook with leak prevention
 */
export function useProgressiveLoading<T>(
  fetcher: () => Promise<T>,
  options: ProgressiveLoadingOptions = {}
) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    enableNetworkAwareness = true,
    enableProgressTracking = true,
    staleWhileRevalidate = true,
    backgroundRefresh = true
  } = options;

  const [state, setState] = useState<ProgressiveLoadingState>({
    status: 'idle',
    retryCount: 0
  });

  const [data, setData] = useState<T | null>(null);
  const [lastValidData, setLastValidData] = useState<T | null>(null);

  // Refs for cleanup tracking
  const mounted = useRef(true);
  const timers = useRef<number[]>([]);
  const controllers = useRef<AbortController[]>([]);

  // Cleanup on unmount - CRITICAL for leak prevention
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      // Clear all timers
      timers.current.forEach(timer => clearTimeout(timer));
      timers.current = [];
      // Abort all pending requests
      controllers.current.forEach(controller => controller.abort());
      controllers.current = [];
    };
  }, []);

  // Safe setState wrapper - only update if still mounted
  const safeSetState = useCallback((updater: (prev: ProgressiveLoadingState) => ProgressiveLoadingState) => {
    if (mounted.current) {
      setState(updater);
    }
  }, []);

  // Safe setData wrapper
  const safeSetData = useCallback((newData: T | null) => {
    if (mounted.current) {
      setData(newData);
    }
  }, []);

  // Safe setLastValidData wrapper  
  const safeSetLastValidData = useCallback((newData: T | null) => {
    if (mounted.current) {
      setLastValidData(newData);
    }
  }, []);

  // Network detection with fallbacks
  const networkInfo = useMemo(() => {
    if (!enableNetworkAwareness || typeof navigator === 'undefined') {
      return { effectiveType: '4g', downlink: 10, rtt: 50 };
    }
    
    const connection = (navigator as any)?.connection;
    if (!connection) {
      // Fallback: estimate based on user agent and device memory
      const deviceMemory = (navigator as any)?.deviceMemory || 4;
      const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
      
      return {
        effectiveType: (deviceMemory <= 2 || isMobile) ? '3g' : '4g',
        downlink: deviceMemory <= 2 ? 5 : 10,
        rtt: deviceMemory <= 2 ? 100 : 50
      };
    }
    
    return {
      effectiveType: connection.effectiveType || '4g',
      downlink: connection.downlink || 10,
      rtt: connection.rtt || 50
    };
  }, [enableNetworkAwareness]);

  const isSlowNetwork = useMemo(() => {
    return ['slow-2g', '2g', '3g'].includes(networkInfo.effectiveType);
  }, [networkInfo.effectiveType]);

  // Adaptive retry delay with jitter and cap
  const getAdaptiveRetryDelay = useCallback((attempt: number) => {
    const baseDelay = retryDelay;
    const networkMultiplier = isSlowNetwork ? 2 : 1;
    const exponentialBackoff = Math.pow(2, attempt - 1);
    const jitter = Math.random() * 0.3 + 0.85; // 85-115% of calculated delay
    
    return Math.min(baseDelay * networkMultiplier * exponentialBackoff * jitter, 8000);
  }, [retryDelay, isSlowNetwork]);

  // Single fetch attempt with timeout and cleanup
  const fetchOnce = useCallback(async (retryCount: number): Promise<T> => {
    if (!mounted.current) throw new Error('Component unmounted');

    const controller = new AbortController();
    controllers.current.push(controller);

    // Network-aware timeout
    const timeout = isSlowNetwork ? 15000 : 8000;
    const timeoutId = window.setTimeout(() => {
      if (mounted.current) controller.abort();
    }, timeout);
    timers.current.push(timeoutId);

    try {
      const result = await fetcher();
      return result;
    } finally {
      // Cleanup
      clearTimeout(timeoutId);
      const timerIndex = timers.current.indexOf(timeoutId);
      if (timerIndex > -1) timers.current.splice(timerIndex, 1);
      
      const controllerIndex = controllers.current.indexOf(controller);
      if (controllerIndex > -1) controllers.current.splice(controllerIndex, 1);
    }
  }, [fetcher, isSlowNetwork]);

  const executeLoad = useCallback(async (isBackground = false) => {
    if (!mounted.current) return;

    const startTime = Date.now();
    let progressInterval: number | null = null;

    safeSetState(prev => ({
      ...prev,
      status: isBackground ? 'stale' : 'loading',
      isBackground,
      networkSpeed: networkInfo.effectiveType as any,
      progress: enableProgressTracking && !isBackground ? 0 : undefined
    }));

    // Progress simulation for slow networks (with cleanup tracking)
    if (enableProgressTracking && !isBackground) {
      progressInterval = window.setInterval(() => {
        if (!mounted.current) return;
        
        safeSetState(prev => {
          if (prev.status !== 'loading') return prev;
          
          const elapsed = Date.now() - startTime;
          const estimatedTime = isSlowNetwork ? 8000 : 3000;
          const progress = Math.min((elapsed / estimatedTime) * 0.8, 0.95);
          
          return { ...prev, progress };
        });
      }, 200);
      timers.current.push(progressInterval);
    }

    let currentAttempt = 0;

    const attemptLoad = async (): Promise<T> => {
      if (!mounted.current) throw new Error('Component unmounted');
      
      currentAttempt++;
      
      try {
        const result = await fetchOnce(currentAttempt);
        return result;
      } catch (error) {
        if (!mounted.current) throw error;
        
        if (currentAttempt <= maxRetries) {
          safeSetState(prev => ({
            ...prev,
            status: 'retrying',
            retryCount: currentAttempt,
            error: (error as Error).message
          }));

          const delay = getAdaptiveRetryDelay(currentAttempt);
          
          // Schedule retry with cleanup tracking
          return new Promise<T>((resolve, reject) => {
            const retryTimer = window.setTimeout(async () => {
              if (mounted.current) {
                try {
                  const result = await attemptLoad();
                  resolve(result);
                } catch (retryError) {
                  reject(retryError);
                }
              } else {
                reject(new Error('Component unmounted during retry'));
              }
            }, delay);
            timers.current.push(retryTimer);
          });
        }
        
        throw error;
      }
    };

    try {
      const result = await attemptLoad();
      
      if (progressInterval) {
        clearInterval(progressInterval);
        const index = timers.current.indexOf(progressInterval);
        if (index > -1) timers.current.splice(index, 1);
      }
      
      if (!mounted.current) return result;
      
      safeSetState(prev => ({
        ...prev,
        status: 'success',
        progress: 1,
        retryCount: 0,
        error: undefined,
        isBackground: false
      }));

      safeSetData(result);
      safeSetLastValidData(result);
      
      return result;

    } catch (error) {
      if (progressInterval) {
        clearInterval(progressInterval);
        const index = timers.current.indexOf(progressInterval);
        if (index > -1) timers.current.splice(index, 1);
      }
      
      if (!mounted.current) return null as any;
      
      const errorMessage = (error as Error).message;
      
      // On slow networks, use stale data if available
      if (isSlowNetwork && staleWhileRevalidate && lastValidData) {
        safeSetState(prev => ({
          ...prev,
          status: 'stale',
          error: errorMessage,
          progress: 0,
          isBackground: false
        }));
        
        safeSetData(lastValidData);
        return lastValidData;
      }

      safeSetState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage,
        progress: 0,
        retryCount: currentAttempt,
        isBackground: false
      }));

      throw error;
    }
  }, [
    fetcher,
    maxRetries,
    getAdaptiveRetryDelay,
    enableProgressTracking,
    networkInfo.effectiveType,
    isSlowNetwork,
    staleWhileRevalidate,
    lastValidData,
    safeSetState,
    safeSetData,
    safeSetLastValidData,
    fetchOnce
  ]);

  const load = useCallback(() => executeLoad(false), [executeLoad]);
  const backgroundRefreshData = useCallback(() => executeLoad(true), [executeLoad]);
  
  const retry = useCallback(() => {
    if (!mounted.current) return Promise.resolve(null);
    safeSetState(prev => ({ ...prev, retryCount: 0 }));
    return load();
  }, [load, safeSetState]);

  return {
    ...state,
    data,
    lastValidData,
    isSlowNetwork,
    networkInfo,
    load,
    retry,
    backgroundRefresh: backgroundRefresh ? backgroundRefreshData : undefined
  };
}

export default useProgressiveLoading;
