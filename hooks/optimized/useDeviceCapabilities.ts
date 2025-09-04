/**
 * Comprehensive Device Capability Detection
 * Ultra-rigorous device tier classification for progressive loading
 */

import { useState, useEffect, useMemo, useCallback } from 'react';

export type DeviceTier = 'low-end' | 'mid-range' | 'high-end' | 'premium';
export type NetworkSpeed = 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'unknown';
export type MemoryPressure = 'low' | 'medium' | 'high' | 'critical';

export interface DeviceCapabilities {
  // Hardware metrics
  memory: number; // GB
  cores: number;
  deviceTier: DeviceTier;
  
  // Network capabilities
  networkSpeed: NetworkSpeed;
  downlink: number; // Mbps
  rtt: number; // ms
  saveData: boolean;
  
  // Memory management
  memoryPressure: MemoryPressure;
  availableMemory: number; // MB
  usedMemory: number; // MB
  
  // Performance characteristics
  estimatedLoadCapacity: number; // 1-10 scale
  maxConcurrentLoads: number;
  recommendedImageQuality: number; // 0.1-1.0
  shouldUseWebP: boolean;
  supportsServiceWorker: boolean;
  
  // Adaptive loading flags
  enablePreloading: boolean;
  enableBackgroundLoading: boolean;
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableComponentSplitting: boolean;
  
  // Fallback configurations
  fallbackTimeout: number; // ms
  retryAttempts: number;
  cacheTTL: number; // ms
}

interface NetworkConnection {
  effectiveType?: NetworkSpeed;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener?: (event: string, handler: () => void) => void;
  removeEventListener?: (event: string, handler: () => void) => void;
}

interface ExtendedNavigator extends Navigator {
  connection?: NetworkConnection;
  mozConnection?: NetworkConnection;
  webkitConnection?: NetworkConnection;
  deviceMemory?: number;
}

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

/**
 * Comprehensive device capability detection hook
 * Integrates multiple detection methods with fallbacks
 */
export function useDeviceCapabilities(): DeviceCapabilities {
  const [memoryState, setMemoryState] = useState<{
    pressure: MemoryPressure;
    available: number;
    used: number;
  }>({
    pressure: 'low',
    available: 1000,
    used: 0
  });

  const [networkState, setNetworkState] = useState<{
    speed: NetworkSpeed;
    downlink: number;
    rtt: number;
    saveData: boolean;
  }>({
    speed: '4g',
    downlink: 10,
    rtt: 50,
    saveData: false
  });

  // Memory monitoring effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const updateMemoryState = () => {
      if (typeof window === 'undefined') return;
      
      const performance = window.performance as ExtendedPerformance;
      const memory = performance.memory;
      
      if (memory) {
        const used = Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
        const available = Math.round(memory.jsHeapSizeLimit / 1024 / 1024); // MB
        const usage = used / available;
        
        let pressure: MemoryPressure;
        if (usage > 0.9) pressure = 'critical';
        else if (usage > 0.75) pressure = 'high';
        else if (usage > 0.5) pressure = 'medium';
        else pressure = 'low';
        
        setMemoryState({ pressure, available, used });
      } else {
        // Fallback estimation
        const navigator = window.navigator as ExtendedNavigator;
        const deviceMemory = navigator.deviceMemory || 4;
        const estimated = deviceMemory * 1024; // MB
        
        setMemoryState({
          pressure: deviceMemory <= 2 ? 'high' : deviceMemory <= 4 ? 'medium' : 'low',
          available: estimated,
          used: Math.round(estimated * 0.3) // Estimate 30% usage
        });
      }
    };

    updateMemoryState();
    interval = setInterval(updateMemoryState, 10000); // Update every 10s
    
    return () => clearInterval(interval);
  }, []);

  // Network monitoring effect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const navigator = window.navigator as ExtendedNavigator;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    const updateNetworkState = () => {
      if (connection) {
        setNetworkState({
          speed: connection.effectiveType || '4g',
          downlink: connection.downlink || 10,
          rtt: connection.rtt || 50,
          saveData: connection.saveData || false
        });
      } else {
        // Fallback network detection using user agent and timing
        const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
        const estimated = isMobile ? '3g' : '4g';
        
        setNetworkState({
          speed: estimated as NetworkSpeed,
          downlink: estimated === '3g' ? 5 : 10,
          rtt: estimated === '3g' ? 100 : 50,
          saveData: false
        });
      }
    };

    updateNetworkState();
    
    if (connection?.addEventListener) {
      connection.addEventListener('change', updateNetworkState);
      return () => connection.removeEventListener?.('change', updateNetworkState);
    }
  }, []);

  // Core device capabilities computation
  const capabilities = useMemo((): DeviceCapabilities => {
    if (typeof window === 'undefined') {
      // SSR fallback - assume mid-range device
      return {
        memory: 4,
        cores: 4,
        deviceTier: 'mid-range',
        networkSpeed: '4g',
        downlink: 10,
        rtt: 50,
        saveData: false,
        memoryPressure: 'low',
        availableMemory: 4000,
        usedMemory: 1000,
        estimatedLoadCapacity: 5,
        maxConcurrentLoads: 2,
        recommendedImageQuality: 0.8,
        shouldUseWebP: true,
        supportsServiceWorker: false,
        enablePreloading: true,
        enableBackgroundLoading: true,
        enableLazyLoading: true,
        enableImageOptimization: true,
        enableComponentSplitting: true,
        fallbackTimeout: 5000,
        retryAttempts: 2,
        cacheTTL: 300000
      };
    }

    const navigator = window.navigator as ExtendedNavigator;
    
    // Hardware detection
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    
    // Device tier classification using multiple heuristics
    let deviceTier: DeviceTier;
    const hardwareScore = memory + (cores / 2);
    const networkScore = networkState.downlink;
    const memoryScore = memoryState.pressure === 'low' ? 3 : 
                       memoryState.pressure === 'medium' ? 2 : 
                       memoryState.pressure === 'high' ? 1 : 0;
    
    const totalScore = hardwareScore + (networkScore / 5) + memoryScore;
    
    if (totalScore >= 8) deviceTier = 'premium';
    else if (totalScore >= 6) deviceTier = 'high-end';
    else if (totalScore >= 4) deviceTier = 'mid-range';
    else deviceTier = 'low-end';
    
    // Performance capacity estimation (1-10 scale)
    const estimatedLoadCapacity = Math.min(10, Math.max(1, Math.round(totalScore)));
    
    // Concurrent loading limits based on device tier
    const maxConcurrentLoads = deviceTier === 'premium' ? 6 :
                              deviceTier === 'high-end' ? 4 :
                              deviceTier === 'mid-range' ? 2 : 1;
    
    // Image quality recommendations
    const recommendedImageQuality = deviceTier === 'premium' ? 0.95 :
                                   deviceTier === 'high-end' ? 0.85 :
                                   deviceTier === 'mid-range' ? 0.75 : 0.6;
    
    // Feature support detection
    const shouldUseWebP = 'createImageBitmap' in window && 
                         CSS.supports('(background-image: url("data:image/webp;base64,"))');
    
    const supportsServiceWorker = 'serviceWorker' in navigator;
    
    // Adaptive loading flags based on capabilities
    const isSlowDevice = deviceTier === 'low-end';
    const isSlowNetwork = ['slow-2g', '2g', '3g'].includes(networkState.speed);
    const hasMemoryPressure = memoryState.pressure === 'high' || memoryState.pressure === 'critical';
    
    const enablePreloading = !isSlowDevice && !isSlowNetwork && !hasMemoryPressure;
    const enableBackgroundLoading = !isSlowDevice && !hasMemoryPressure;
    const enableLazyLoading = true; // Always beneficial
    const enableImageOptimization = true; // Always beneficial
    const enableComponentSplitting = !isSlowNetwork; // Avoid on slow networks due to roundtrips
    
    // Adaptive timeouts and retry logic
    const fallbackTimeout = isSlowNetwork ? 15000 : isSlowDevice ? 10000 : 5000;
    const retryAttempts = isSlowNetwork ? 4 : 2;
    const cacheTTL = isSlowNetwork ? 600000 : 300000; // Longer cache on slow networks
    
    return {
      memory,
      cores,
      deviceTier,
      networkSpeed: networkState.speed,
      downlink: networkState.downlink,
      rtt: networkState.rtt,
      saveData: networkState.saveData,
      memoryPressure: memoryState.pressure,
      availableMemory: memoryState.available,
      usedMemory: memoryState.used,
      estimatedLoadCapacity,
      maxConcurrentLoads,
      recommendedImageQuality,
      shouldUseWebP,
      supportsServiceWorker,
      enablePreloading,
      enableBackgroundLoading,
      enableLazyLoading,
      enableImageOptimization,
      enableComponentSplitting,
      fallbackTimeout,
      retryAttempts,
      cacheTTL
    };
  }, [memoryState, networkState]);

  return capabilities;
}

/**
 * Performance monitoring utility for development
 * Logs device capabilities and performance metrics
 */
export function useDeviceCapabilitiesDebug() {
  const capabilities = useDeviceCapabilities();
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔍 Device Capabilities Debug');
      console.log('Device Tier:', capabilities.deviceTier);
      console.log('Memory:', `${capabilities.memory}GB (${capabilities.memoryPressure} pressure)`);
      console.log('Network:', `${capabilities.networkSpeed} (${capabilities.downlink}Mbps, ${capabilities.rtt}ms)`);
      console.log('Load Capacity:', `${capabilities.estimatedLoadCapacity}/10`);
      console.log('Max Concurrent:', capabilities.maxConcurrentLoads);
      console.log('Image Quality:', `${Math.round(capabilities.recommendedImageQuality * 100)}%`);
      console.log('Features:', {
        preloading: capabilities.enablePreloading,
        backgroundLoading: capabilities.enableBackgroundLoading,
        componentSplitting: capabilities.enableComponentSplitting,
        webP: capabilities.shouldUseWebP,
        serviceWorker: capabilities.supportsServiceWorker
      });
      console.groupEnd();
    }
  }, [capabilities]);
  
  return capabilities;
}

export default useDeviceCapabilities;
