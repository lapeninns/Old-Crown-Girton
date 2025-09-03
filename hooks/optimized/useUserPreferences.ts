/**
 * Production-safe user preferences with persistent storage
 * Provides fallback loading modes for unreliable network detection
 */

import { useState, useEffect, useCallback } from 'react';

interface UserPreferences {
  liteMode: boolean;
  dataSaver: boolean;
  reducedAnimations: boolean;
  autoOptimizations: boolean;
  imageQuality: 'low' | 'medium' | 'high' | 'auto';
  prefetchStrategy: 'none' | 'aggressive' | 'smart';
}

interface NetworkCapabilities {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  isReliable: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  liteMode: false,
  dataSaver: false,
  reducedAnimations: false,
  autoOptimizations: true,
  imageQuality: 'auto',
  prefetchStrategy: 'smart'
};

const STORAGE_KEY = 'restaurant-user-preferences';
const NETWORK_TEST_KEY = 'network-capabilities-cache';

/**
 * Hook for managing user preferences with network-aware defaults
 */
export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [networkCapabilities, setNetworkCapabilities] = useState<NetworkCapabilities | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from storage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Load saved preferences
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<UserPreferences>;
          setPreferences(prev => ({ ...prev, ...parsed }));
        }

        // Load network capabilities with fallback testing
        const networkCaps = await detectNetworkCapabilities();
        setNetworkCapabilities(networkCaps);

        // Auto-enable lite mode for detected slow networks (if user hasn't explicitly set it)
        const hasUserLitePreference = stored && JSON.parse(stored).liteMode !== undefined;
        if (!hasUserLitePreference && networkCaps && shouldDefaultToLiteMode(networkCaps)) {
          setPreferences(prev => ({ ...prev, liteMode: true }));
        }

        setIsLoaded(true);
      } catch (error) {
        console.warn('Failed to load user preferences:', error);
        setIsLoaded(true);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to storage whenever they change
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, ...updates };
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
      } catch (error) {
        console.warn('Failed to save preferences:', error);
      }
      
      return newPrefs;
    });
  }, []);

  // Toggle lite mode specifically
  const toggleLiteMode = useCallback(() => {
    updatePreferences({ liteMode: !preferences.liteMode });
  }, [preferences.liteMode, updatePreferences]);

  // Get effective loading strategy based on preferences + network
  const getLoadingStrategy = useCallback(() => {
    // User explicitly enabled lite mode - always respect it
    if (preferences.liteMode) {
      return {
        maxConcurrentRequests: 2,
        imageQuality: 'low' as const,
        prefetchEnabled: false,
        progressiveLoading: true,
        cacheAggressive: true,
        compressRequests: true
      };
    }

    // Auto mode - make decisions based on network + device capabilities
    if (preferences.autoOptimizations && networkCapabilities) {
      const shouldUseLiteStrategy = 
        networkCapabilities.effectiveType === 'slow-2g' ||
        networkCapabilities.effectiveType === '2g' ||
        (networkCapabilities.effectiveType === '3g' && networkCapabilities.rtt > 200) ||
        networkCapabilities.saveData ||
        !networkCapabilities.isReliable;

      if (shouldUseLiteStrategy) {
        return {
          maxConcurrentRequests: 3,
          imageQuality: preferences.imageQuality === 'auto' ? 'medium' : preferences.imageQuality,
          prefetchEnabled: preferences.prefetchStrategy !== 'none',
          progressiveLoading: true,
          cacheAggressive: true,
          compressRequests: true
        };
      }
    }

    // Default/fast strategy
    return {
      maxConcurrentRequests: 6,
      imageQuality: preferences.imageQuality === 'auto' ? 'high' : preferences.imageQuality,
      prefetchEnabled: preferences.prefetchStrategy === 'aggressive',
      progressiveLoading: false,
      cacheAggressive: false,
      compressRequests: false
    };
  }, [preferences, networkCapabilities]);

  return {
    preferences,
    networkCapabilities,
    isLoaded,
    updatePreferences,
    toggleLiteMode,
    getLoadingStrategy,
    // Convenient getters
    isLiteMode: preferences.liteMode,
    isDataSaver: preferences.dataSaver || networkCapabilities?.saveData || false,
    shouldReduceAnimations: preferences.reducedAnimations || 
      (preferences.autoOptimizations && networkCapabilities?.effectiveType === 'slow-2g')
  };
}

/**
 * Detect network capabilities with fallback mechanisms
 */
async function detectNetworkCapabilities(): Promise<NetworkCapabilities> {
  const defaultCaps: NetworkCapabilities = {
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
    saveData: false,
    isReliable: false
  };

  try {
    // Try cached network test first
    const cached = sessionStorage.getItem(NETWORK_TEST_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 5 * 60 * 1000) { // 5 min cache
        return parsed.capabilities;
      }
    }

    // Use navigator.connection if available
    const connection = (navigator as any)?.connection;
    let capabilities: NetworkCapabilities = {
      effectiveType: connection?.effectiveType || defaultCaps.effectiveType,
      downlink: connection?.downlink || defaultCaps.downlink,
      rtt: connection?.rtt || defaultCaps.rtt,
      saveData: connection?.saveData || navigator?.userAgent?.includes('Opera Mini') || false,
      isReliable: !!connection
    };

    // Perform simple network speed test as fallback
    if (!connection || !capabilities.isReliable) {
      try {
        const speedTest = await performSimpleSpeedTest();
        capabilities = {
          ...capabilities,
          ...speedTest,
          isReliable: true
        };
      } catch (error) {
        console.warn('Speed test failed, using defaults:', error);
      }
    }

    // Cache the results
    try {
      sessionStorage.setItem(NETWORK_TEST_KEY, JSON.stringify({
        capabilities,
        timestamp: Date.now()
      }));
    } catch (error) {
      // Ignore storage errors
    }

    return capabilities;
  } catch (error) {
    console.warn('Network detection failed:', error);
    return defaultCaps;
  }
}

/**
 * Simple speed test using a small image download
 */
async function performSimpleSpeedTest(): Promise<Partial<NetworkCapabilities>> {
  const startTime = Date.now();
  
  try {
    // Use a small test image (1KB) from a reliable CDN
    const testUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const response = await fetch(testUrl, { cache: 'no-cache' });
    
    if (!response.ok) throw new Error('Test request failed');
    
    const endTime = Date.now();
    const latency = endTime - startTime;
    
    // Rough classification based on latency
    let effectiveType: string;
    if (latency > 2000) {
      effectiveType = 'slow-2g';
    } else if (latency > 1000) {
      effectiveType = '2g';
    } else if (latency > 500) {
      effectiveType = '3g';
    } else {
      effectiveType = '4g';
    }
    
    return {
      effectiveType,
      rtt: latency,
      downlink: latency > 1000 ? 1 : latency > 500 ? 5 : 10
    };
  } catch (error) {
    // If test fails, assume slow network
    return {
      effectiveType: '3g',
      rtt: 300,
      downlink: 2
    };
  }
}

/**
 * Determine if lite mode should be default based on network capabilities
 */
function shouldDefaultToLiteMode(capabilities: NetworkCapabilities): boolean {
  return (
    capabilities.effectiveType === 'slow-2g' ||
    capabilities.effectiveType === '2g' ||
    capabilities.saveData ||
    capabilities.rtt > 400 ||
    capabilities.downlink < 1.5
  );
}

/**
 * Get device-specific optimizations
 */
export function getDeviceOptimizations() {
  if (typeof navigator === 'undefined') {
    return { isLowEndDevice: false, memoryPressure: false };
  }

  // Estimate if device is low-end based on available indicators
  const deviceMemory = (navigator as any)?.deviceMemory || 4;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const isLowEndDevice = deviceMemory <= 2 || hardwareConcurrency <= 2;
  
  // Check for memory pressure indicators
  const memoryPressure = deviceMemory <= 1 || 
    (typeof (window as any).performance?.memory !== 'undefined' && 
     (window as any).performance.memory.usedJSHeapSize > 50 * 1024 * 1024); // 50MB

  return {
    isLowEndDevice,
    memoryPressure,
    deviceMemory,
    hardwareConcurrency
  };
}
