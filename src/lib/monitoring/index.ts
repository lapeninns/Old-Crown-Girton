/**
 * Production Monitoring and Alerting System
 * 
 * Comprehensive monitoring, logging, and alerting for the modular content system
 * including performance metrics, error tracking, and operational insights.
 */

import { getProductionConfig, getMonitoringConfig } from '../config/production';

export interface MetricData {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
  unit?: string;
}

export interface ErrorData {
  id: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  user?: {
    id?: string;
    userAgent?: string;
    ip?: string;
  };
}

export interface LogData {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
  timestamp: number;
  module?: string;
  function?: string;
}

export interface PerformanceData {
  metric: string;
  value: number;
  timestamp: number;
  context: {
    environment: string;
    moduleId?: string;
    operation?: string;
    userId?: string;
  };
}

/**
 * Central monitoring service
 */
export class MonitoringService {
  private config = getProductionConfig();
  private monitoringConfig = getMonitoringConfig();
  private metricsBuffer: MetricData[] = [];
  private errorsBuffer: ErrorData[] = [];
  private logsBuffer: LogData[] = [];
  private performanceBuffer: PerformanceData[] = [];
  private batchSize = 50;
  private flushInterval = 10000; // 10 seconds

  constructor() {
    if (typeof window !== 'undefined') {
      // Client-side initialization
      this.setupClientMonitoring();
    } else {
      // Server-side initialization
      this.setupServerMonitoring();
    }

    // Start periodic flushing
    this.startPeriodicFlush();
  }

  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, tags?: Record<string, string>, unit?: string): void {
    if (!this.config.monitoring.performance) return;

    const metric: MetricData = {
      name,
      value,
      timestamp: Date.now(),
      tags: {
        environment: this.config.environment,
        version: this.config.contentVersion,
        ...tags,
      },
      unit,
    };

    this.metricsBuffer.push(metric);
    this.flushIfNeeded();
  }

  /**
   * Record an error
   */
  recordError(error: Error | string, context?: Record<string, any>, severity: ErrorData['severity'] = 'medium'): void {
    if (!this.config.monitoring.errorTracking) return;

    const errorData: ErrorData = {
      id: this.generateErrorId(),
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        environment: this.config.environment,
        version: this.config.contentVersion,
        buildId: this.config.buildId,
        ...context,
      },
      severity,
      timestamp: Date.now(),
      user: this.getUserContext(),
    };

    this.errorsBuffer.push(errorData);
    
    // Immediate flush for critical errors
    if (severity === 'critical') {
      this.flushErrors();
    } else {
      this.flushIfNeeded();
    }
  }

  /**
   * Log a message
   */
  log(level: LogData['level'], message: string, context?: Record<string, any>, module?: string): void {
    // Only log in development or when explicitly enabled
    if (this.config.environment === 'prod' && level === 'debug') return;

    const logData: LogData = {
      level,
      message,
      context: {
        environment: this.config.environment,
        ...context,
      },
      timestamp: Date.now(),
      module,
    };

    this.logsBuffer.push(logData);
    
    // Console logging for development
    if (this.config.environment !== 'prod') {
      const logMethod = level === 'error' ? console.error : 
                      level === 'warn' ? console.warn : 
                      level === 'debug' ? console.debug : console.log;
      
      logMethod(`[${level.toUpperCase()}] ${message}`, context);
    }

    this.flushIfNeeded();
  }

  /**
   * Record performance data
   */
  recordPerformance(metric: string, value: number, context: Partial<PerformanceData['context']> = {}): void {
    if (!this.config.monitoring.performance) return;

    const performanceData: PerformanceData = {
      metric,
      value,
      timestamp: Date.now(),
      context: {
        environment: this.config.environment,
        ...context,
      },
    };

    this.performanceBuffer.push(performanceData);
    this.flushIfNeeded();
  }

  /**
   * Record content-specific metrics
   */
  recordContentMetric(operation: string, moduleId: string, duration: number, success: boolean): void {
    this.recordMetric(`content.${operation}.duration`, duration, {
      moduleId,
      status: success ? 'success' : 'failure',
    }, 'ms');

    this.recordMetric(`content.${operation}.count`, 1, {
      moduleId,
      status: success ? 'success' : 'failure',
    });
  }

  /**
   * Record cache metrics
   */
  recordCacheMetric(operation: 'hit' | 'miss' | 'set' | 'delete', moduleId?: string): void {
    this.recordMetric(`cache.${operation}`, 1, {
      moduleId: moduleId || 'unknown',
    });
  }

  /**
   * Set up client-side monitoring
   */
  private setupClientMonitoring(): void {
    // Performance observer for web vitals
    if ('PerformanceObserver' in window) {
      this.setupWebVitalsMonitoring();
    }

    // Error handling
    window.addEventListener('error', (event) => {
      this.recordError(event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }, 'high');
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.recordError(event.reason, {
        type: 'unhandledrejection',
      }, 'high');
    });

    // Network monitoring
    if ('navigator' in window && 'connection' in navigator) {
      this.setupNetworkMonitoring();
    }
  }

  /**
   * Set up server-side monitoring
   */
  private setupServerMonitoring(): void {
    // Process monitoring
    process.on('uncaughtException', (error) => {
      this.recordError(error, { type: 'uncaughtException' }, 'critical');
    });

    process.on('unhandledRejection', (reason) => {
      this.recordError(reason as Error, { type: 'unhandledRejection' }, 'critical');
    });

    // Memory monitoring
    setInterval(() => {
      const memUsage = process.memoryUsage();
      this.recordMetric('system.memory.used', memUsage.heapUsed, {}, 'bytes');
      this.recordMetric('system.memory.total', memUsage.heapTotal, {}, 'bytes');
    }, 30000); // Every 30 seconds
  }

  /**
   * Set up Web Vitals monitoring
   */
  private setupWebVitalsMonitoring(): void {
    // Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            this.recordMetric('webvitals.lcp', entry.startTime, {}, 'ms');
            break;
          case 'first-input':
            this.recordMetric('webvitals.fid', (entry as any).processingStart - entry.startTime, {}, 'ms');
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              this.recordMetric('webvitals.cls', (entry as any).value);
            }
            break;
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  }

  /**
   * Set up network monitoring
   */
  private setupNetworkMonitoring(): void {
    const connection = (navigator as any).connection;
    
    this.recordMetric('network.effectiveType', this.getConnectionTypeValue(connection.effectiveType));
    this.recordMetric('network.downlink', connection.downlink, {}, 'mbps');
    this.recordMetric('network.rtt', connection.rtt, {}, 'ms');

    connection.addEventListener('change', () => {
      this.recordMetric('network.effectiveType', this.getConnectionTypeValue(connection.effectiveType));
      this.recordMetric('network.downlink', connection.downlink, {}, 'mbps');
      this.recordMetric('network.rtt', connection.rtt, {}, 'ms');
    });
  }

  /**
   * Convert connection type to numeric value for metrics
   */
  private getConnectionTypeValue(type: string): number {
    const types: Record<string, number> = {
      'slow-2g': 1,
      '2g': 2,
      '3g': 3,
      '4g': 4,
    };
    return types[type] || 0;
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get user context for error tracking
   */
  private getUserContext() {
    if (typeof window === 'undefined') return undefined;

    return {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
    };
  }

  /**
   * Flush buffers if they reach batch size
   */
  private flushIfNeeded(): void {
    if (this.metricsBuffer.length >= this.batchSize) {
      this.flushMetrics();
    }
    if (this.errorsBuffer.length >= this.batchSize) {
      this.flushErrors();
    }
    if (this.logsBuffer.length >= this.batchSize) {
      this.flushLogs();
    }
    if (this.performanceBuffer.length >= this.batchSize) {
      this.flushPerformance();
    }
  }

  /**
   * Start periodic flushing
   */
  private startPeriodicFlush(): void {
    setInterval(() => {
      this.flushAll();
    }, this.flushInterval);
  }

  /**
   * Flush all buffers
   */
  private flushAll(): void {
    this.flushMetrics();
    this.flushErrors();
    this.flushLogs();
    this.flushPerformance();
  }

  /**
   * Flush metrics to endpoint
   */
  private async flushMetrics(): Promise<void> {
    if (this.metricsBuffer.length === 0) return;

    const metrics = [...this.metricsBuffer];
    this.metricsBuffer = [];

    try {
      await this.sendToEndpoint('/api/monitoring/metrics', { metrics });
    } catch (error) {
      console.error('Failed to flush metrics:', error);
      // Re-add to buffer for retry (keep only recent ones)
      this.metricsBuffer.unshift(...metrics.slice(-10));
    }
  }

  /**
   * Flush errors to endpoint
   */
  private async flushErrors(): Promise<void> {
    if (this.errorsBuffer.length === 0) return;

    const errors = [...this.errorsBuffer];
    this.errorsBuffer = [];

    try {
      if (this.monitoringConfig.errorTrackingEndpoint) {
        await this.sendToEndpoint(this.monitoringConfig.errorTrackingEndpoint, { errors });
      } else {
        await this.sendToEndpoint('/api/monitoring/errors', { errors });
      }
    } catch (error) {
      console.error('Failed to flush errors:', error);
      this.errorsBuffer.unshift(...errors.slice(-5)); // Keep critical errors
    }
  }

  /**
   * Flush logs to endpoint
   */
  private async flushLogs(): Promise<void> {
    if (this.logsBuffer.length === 0) return;

    const logs = [...this.logsBuffer];
    this.logsBuffer = [];

    try {
      await this.sendToEndpoint('/api/monitoring/logs', { logs });
    } catch (error) {
      console.error('Failed to flush logs:', error);
      // Don't re-add logs to avoid infinite loops
    }
  }

  /**
   * Flush performance data to endpoint
   */
  private async flushPerformance(): Promise<void> {
    if (this.performanceBuffer.length === 0) return;

    const performance = [...this.performanceBuffer];
    this.performanceBuffer = [];

    try {
      if (this.monitoringConfig.performanceEndpoint) {
        await this.sendToEndpoint(this.monitoringConfig.performanceEndpoint, { performance });
      } else {
        await this.sendToEndpoint('/api/monitoring/performance', { performance });
      }
    } catch (error) {
      console.error('Failed to flush performance data:', error);
    }
  }

  /**
   * Send data to monitoring endpoint
   */
  private async sendToEndpoint(endpoint: string, data: any): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add API key if available
    const apiKey = process.env.MONITORING_API_KEY;
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const { fetchWithResilience } = await import('../data/fetchWithResilience');
    const response = await fetchWithResilience(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...data,
        environment: this.config.environment,
        version: this.config.contentVersion,
        timestamp: Date.now(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Monitoring endpoint error: ${response.status} ${response.statusText}`);
    }
  }
}

/**
 * Content-specific monitoring utilities
 */
export class ContentMonitoring {
  private monitoring: MonitoringService;

  constructor(monitoring: MonitoringService) {
    this.monitoring = monitoring;
  }

  /**
   * Monitor content loading operation
   */
  async monitorContentLoading<T>(
    operation: string,
    moduleId: string,
    asyncOperation: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    let success = false;

    try {
      const result = await asyncOperation();
      success = true;
      return result;
    } catch (error) {
      this.monitoring.recordError(error as Error, {
        operation,
        moduleId,
      }, 'medium');
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      this.monitoring.recordContentMetric(operation, moduleId, duration, success);
    }
  }

  /**
   * Monitor cache operations
   */
  monitorCacheOperation(operation: 'hit' | 'miss' | 'set' | 'delete', moduleId: string): void {
    this.monitoring.recordCacheMetric(operation, moduleId);
  }

  /**
   * Monitor composition performance
   */
  monitorComposition(moduleCount: number, duration: number, conflicts: number): void {
    this.monitoring.recordMetric('content.composition.duration', duration, {}, 'ms');
    this.monitoring.recordMetric('content.composition.modules', moduleCount);
    this.monitoring.recordMetric('content.composition.conflicts', conflicts);
  }

  /**
   * Monitor environment overrides
   */
  monitorEnvironmentOverrides(environment: string, overrideCount: number): void {
    this.monitoring.recordMetric('content.overrides.count', overrideCount, {
      environment,
    });
  }
}

/**
 * Alerting system
 */
export class AlertingService {
  private monitoring: MonitoringService;
  private thresholds: Record<string, { warning: number; critical: number }>;

  constructor(monitoring: MonitoringService) {
    this.monitoring = monitoring;
    this.thresholds = {
      'content.load.duration': { warning: 500, critical: 1000 },
      'content.error.rate': { warning: 1, critical: 5 },
      'cache.hit.rate': { warning: 80, critical: 70 },
      'api.response.time': { warning: 200, critical: 500 },
    };
  }

  /**
   * Check metric against thresholds and send alerts
   */
  checkMetricThresholds(metricName: string, value: number): void {
    const threshold = this.thresholds[metricName];
    if (!threshold) return;

    if (value >= threshold.critical) {
      this.sendAlert('critical', metricName, value, threshold.critical);
    } else if (value >= threshold.warning) {
      this.sendAlert('warning', metricName, value, threshold.warning);
    }
  }

  /**
   * Send alert
   */
  private async sendAlert(
    level: 'warning' | 'critical',
    metric: string,
    value: number,
    threshold: number
  ): Promise<void> {
    const alert = {
      level,
      metric,
      value,
      threshold,
      timestamp: Date.now(),
      environment: getProductionConfig().environment,
    };

    // Send to alerting service (Slack, PagerDuty, etc.)
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert),
      });
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }
}

// Global monitoring instance
let monitoringService: MonitoringService | null = null;
let contentMonitoring: ContentMonitoring | null = null;
let alertingService: AlertingService | null = null;

/**
 * Get global monitoring service
 */
export function getMonitoring(): MonitoringService {
  if (!monitoringService) {
    monitoringService = new MonitoringService();
  }
  return monitoringService;
}

/**
 * Get content monitoring utilities
 */
export function getContentMonitoring(): ContentMonitoring {
  if (!contentMonitoring) {
    contentMonitoring = new ContentMonitoring(getMonitoring());
  }
  return contentMonitoring;
}

/**
 * Get alerting service
 */
export function getAlerting(): AlertingService {
  if (!alertingService) {
    alertingService = new AlertingService(getMonitoring());
  }
  return alertingService;
}

/**
 * Initialize monitoring system
 */
export function initializeMonitoring(): void {
  const monitoring = getMonitoring();
  const alerting = getAlerting();

  // Log initialization
  monitoring.log('info', 'Monitoring system initialized', {
    environment: getProductionConfig().environment,
    features: getProductionConfig().monitoring,
  });

  // Set up health check endpoint monitoring
  if (typeof window === 'undefined') {
    setInterval(async () => {
      try {
        const startTime = Date.now();
  const { fetchWithResilience } = await import('../data/fetchWithResilience');
  const response = await fetchWithResilience('/health');
        const duration = Date.now() - startTime;
        
        monitoring.recordMetric('health.check.duration', duration, {}, 'ms');
        monitoring.recordMetric('health.check.status', response.ok ? 1 : 0);
        
        alerting.checkMetricThresholds('api.response.time', duration);
      } catch (error) {
        monitoring.recordError(error as Error, {
          operation: 'health-check',
        }, 'medium');
      }
    }, 60000); // Every minute
  }
}