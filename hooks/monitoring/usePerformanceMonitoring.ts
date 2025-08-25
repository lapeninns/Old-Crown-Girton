/**
 * Real-time Performance Monitoring Hook
 * 
 * Provides real-time monitoring of API response times and system performance with:
 * - Live response time tracking
 * - Performance anomaly detection
 * - Historical data visualization
 * - Alerting capabilities
 */

"use client";
import { useState, useEffect, useCallback } from 'react';

interface ApiResponseTime {
  endpoint: string;
  time: number;
  timestamp: Date;
  status: number;
}

interface PerformanceAlert {
  id: string;
  type: 'slow_response' | 'high_error_rate' | 'memory_usage';
  severity: 'warning' | 'error';
  message: string;
  timestamp: Date;
  endpoint?: string;
  value?: number;
}

interface SystemPerformance {
  memoryUsage: number;
  cpuUsage: number;
  uptime: number;
  responseTimes: ApiResponseTime[];
  alerts: PerformanceAlert[];
}

interface UsePerformanceMonitoringOptions {
  enabled?: boolean;
  pollingInterval?: number; // milliseconds
  alertThresholds?: {
    slowResponseTime?: number; // milliseconds
    errorRate?: number; // percentage
    memoryUsage?: number; // percentage
  };
  maxHistory?: number; // maximum number of data points to keep
}

const DEFAULT_OPTIONS: Required<UsePerformanceMonitoringOptions> = {
  enabled: true,
  pollingInterval: 5000, // 5 seconds
  alertThresholds: {
    slowResponseTime: 2000, // 2 seconds
    errorRate: 5, // 5%
    memoryUsage: 80 // 80%
  },
  maxHistory: 100
};

export function usePerformanceMonitoring(options: UsePerformanceMonitoringOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  const [performance, setPerformance] = useState<SystemPerformance>({
    memoryUsage: 0,
    cpuUsage: 0,
    uptime: 0,
    responseTimes: [],
    alerts: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add alert to the system
  const addAlert = useCallback((alert: Omit<PerformanceAlert, 'id' | 'timestamp'>) => {
    const newAlert: PerformanceAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    setPerformance(prev => ({
      ...prev,
      alerts: [...prev.alerts.slice(-config.maxHistory + 1), newAlert]
    }));
    
    // Trigger browser notification if supported
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Performance Alert', {
        body: alert.message,
        icon: alert.severity === 'error' ? '🔴' : '⚠️'
      });
    }
  }, [config.maxHistory]);
  
  // Monitor API response time
  const monitorApiResponse = useCallback(async (
    endpoint: string,
    requestFn: () => Promise<any>
  ): Promise<any> => {
    const startTime = Date.now();
    let status = 200;
    
    try {
      const result = await requestFn();
      const responseTime = Date.now() - startTime;
      
      // Add response time to history
      const newResponseTime: ApiResponseTime = {
        endpoint,
        time: responseTime,
        timestamp: new Date(),
        status
      };
      
      setPerformance(prev => ({
        ...prev,
        responseTimes: [...prev.responseTimes.slice(-config.maxHistory + 1), newResponseTime]
      }));
      
      // Check for slow response time alert
      if (responseTime > (config.alertThresholds.slowResponseTime || 2000)) {
        addAlert({
          type: 'slow_response',
          severity: responseTime > 5000 ? 'error' : 'warning',
          message: `Slow response from ${endpoint}: ${responseTime}ms`,
          endpoint,
          value: responseTime
        });
      }
      
      return result;
    } catch (err) {
      const responseTime = Date.now() - startTime;
      status = 500;
      
      // Add error response time to history
      const newResponseTime: ApiResponseTime = {
        endpoint,
        time: responseTime,
        timestamp: new Date(),
        status
      };
      
      setPerformance(prev => ({
        ...prev,
        responseTimes: [...prev.responseTimes.slice(-config.maxHistory + 1), newResponseTime]
      }));
      
      // Add error alert
      addAlert({
        type: 'slow_response',
        severity: 'error',
        message: `API Error from ${endpoint}: ${(err as Error).message}`,
        endpoint,
        value: responseTime
      });
      
      throw err;
    }
  }, [config.alertThresholds.slowResponseTime, config.maxHistory, addAlert]);
  
  // Fetch system performance metrics
  const fetchSystemMetrics = useCallback(async () => {
    if (!config.enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would fetch from a performance monitoring API
      // For now, we'll simulate with browser APIs where possible
      
      // Memory usage (Node.js only, will be 0 in browser)
      const memoryUsage = typeof process !== 'undefined' ? 
        Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100) : 0;
      
      // Simulate CPU usage (in a real implementation, this would come from system metrics)
      const cpuUsage = Math.floor(Math.random() * 30) + 20; // 20-50% simulated
      
      // Uptime
      const uptime = typeof process !== 'undefined' ? process.uptime() : 0;
      
      setPerformance(prev => ({
        ...prev,
        memoryUsage,
        cpuUsage,
        uptime
      }));
      
      // Check for high memory usage alert
      if (memoryUsage > (config.alertThresholds.memoryUsage || 80)) {
        addAlert({
          type: 'memory_usage',
          severity: memoryUsage > 90 ? 'error' : 'warning',
          message: `High memory usage: ${memoryUsage}%`,
          value: memoryUsage
        });
      }
      
    } catch (err) {
      setError('Failed to fetch system metrics');
      console.error('Performance monitoring error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [config.enabled, config.alertThresholds.memoryUsage, addAlert]);
  
  // Calculate error rate from response times
  const calculateErrorRate = useCallback(() => {
    if (performance.responseTimes.length === 0) return 0;
    
    const errorCount = performance.responseTimes.filter(rt => rt.status >= 400).length;
    const errorRate = (errorCount / performance.responseTimes.length) * 100;
    
    // Check for high error rate alert
    if (errorRate > (config.alertThresholds.errorRate || 5)) {
      addAlert({
        type: 'high_error_rate',
        severity: errorRate > 10 ? 'error' : 'warning',
        message: `High error rate: ${errorRate.toFixed(1)}%`,
        value: errorRate
      });
    }
    
    return errorRate;
  }, [performance.responseTimes, config.alertThresholds.errorRate, addAlert]);
  
  // Get average response time for an endpoint
  const getAverageResponseTime = useCallback((endpoint: string): number => {
    const times = performance.responseTimes
      .filter(rt => rt.endpoint === endpoint)
      .map(rt => rt.time);
    
    if (times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }, [performance.responseTimes]);
  
  // Get response time trend
  const getResponseTimeTrend = useCallback((endpoint: string, samples = 10): 'improving' | 'degrading' | 'stable' => {
    const recentTimes = performance.responseTimes
      .filter(rt => rt.endpoint === endpoint)
      .slice(-samples)
      .map(rt => rt.time);
    
    if (recentTimes.length < 2) return 'stable';
    
    const firstHalf = recentTimes.slice(0, Math.floor(recentTimes.length / 2));
    const secondHalf = recentTimes.slice(Math.floor(recentTimes.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, time) => sum + time, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, time) => sum + time, 0) / secondHalf.length;
    
    const change = secondAvg - firstAvg;
    const threshold = Math.max(firstAvg * 0.1, 100); // 10% or 100ms threshold
    
    if (change > threshold) return 'degrading';
    if (change < -threshold) return 'improving';
    return 'stable';
  }, [performance.responseTimes]);
  
  // Clear alerts
  const clearAlerts = useCallback(() => {
    setPerformance(prev => ({
      ...prev,
      alerts: []
    }));
  }, []);
  
  // Effect to periodically fetch system metrics
  useEffect(() => {
    if (!config.enabled) return;
    
    fetchSystemMetrics();
    const interval = setInterval(fetchSystemMetrics, config.pollingInterval);
    
    return () => clearInterval(interval);
  }, [config.enabled, config.pollingInterval, fetchSystemMetrics]);
  
  // Effect to calculate error rate when response times change
  useEffect(() => {
    calculateErrorRate();
  }, [performance.responseTimes, calculateErrorRate]);
  
  // Request notification permissions
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
  
  return {
    performance,
    isLoading,
    error,
    monitorApiResponse,
    getAverageResponseTime,
    getResponseTimeTrend,
    clearAlerts,
    addAlert
  };
}

// Helper hook for monitoring specific API endpoints
export function useApiPerformance(endpoint: string, options: UsePerformanceMonitoringOptions = {}) {
  const monitoring = usePerformanceMonitoring(options);
  
  const monitorRequest = useCallback(async (requestFn: () => Promise<any>) => {
    return monitoring.monitorApiResponse(endpoint, requestFn);
  }, [endpoint, monitoring]);
  
  const averageTime = monitoring.getAverageResponseTime(endpoint);
  const trend = monitoring.getResponseTimeTrend(endpoint);
  
  return {
    ...monitoring,
    monitorRequest,
    averageTime,
    trend
  };
}

// Types for external use
export type { 
  ApiResponseTime, 
  PerformanceAlert, 
  SystemPerformance, 
  UsePerformanceMonitoringOptions 
};