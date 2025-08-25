/**
 * Unit tests for BaseSmartLoader
 * 
 * Tests the core functionality of the enhanced BaseSmartLoader including:
 * - Smart loading with caching
 * - API fallback mechanisms
 * - Error handling and retry logic
 * - Performance monitoring integration
 */

import { BaseSmartLoader, type SmartLoadConfig } from '@/src/lib/data/loaders/BaseSmartLoader';
import { z } from 'zod';

// Mock Zod schema for testing
const TestSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number()
});

type TestType = z.infer<typeof TestSchema>;

// Mock implementation of BaseSmartLoader for testing
class TestSmartLoader extends BaseSmartLoader<TestType> {
  protected schema = TestSchema;
  protected resourceName = 'test';

  protected async loadFromFilesystem(env: string): Promise<TestType> {
    // Mock filesystem loading
    return { id: '1', name: 'Test Item', value: 42 };
  }

  protected async tryLoadFromAPI(env: string, config: SmartLoadConfig): Promise<TestType | null> {
    // Mock API loading - in this case, simulate API failure to test fallback
    return null;
  }

  protected getTTL(env: string): number {
    return 300000; // 5 minutes
  }
}

describe('BaseSmartLoader', () => {
  let loader: TestSmartLoader;

  beforeEach(() => {
    loader = new TestSmartLoader();
  });

  afterEach(() => {
    loader.resetMetrics();
  });

  describe('loadSmart', () => {
    it('should load data successfully from filesystem when API fails', async () => {
      const result = await loader.loadSmart('app');
      
      expect(result.data).toEqual({ id: '1', name: 'Test Item', value: 42 });
      expect(result.source).toBe('filesystem');
      expect(result.cached).toBe(false);
      expect(result.env).toBe('app');
    });

    it('should handle caching when enabled', async () => {
      // First load
      const result1 = await loader.loadSmart('app', { enableCache: true });
      
      // Second load should be cached
      const result2 = await loader.loadSmart('app', { enableCache: true });
      
      expect(result2.cached).toBe(true);
      expect(result2.data).toEqual(result1.data);
    });

    it('should not cache when disabled', async () => {
      // First load
      const result1 = await loader.loadSmart('app', { enableCache: false });
      
      // Second load should not be cached
      const result2 = await loader.loadSmart('app', { enableCache: false });
      
      expect(result2.cached).toBe(false);
      expect(result2.data).toEqual(result1.data);
    });

    it('should include performance metrics', async () => {
      const result = await loader.loadSmart('app');
      
      expect(result.loadTime).toBeDefined();
      expect(result.loadTime).toBeGreaterThan(0);
      expect(result.timestamp).toBeDefined();
    });

    it('should handle custom TTL configuration', async () => {
      const result = await loader.loadSmart('app', { ttl: 60000 });
      
      expect(result).toBeDefined();
      expect(result.data).toEqual({ id: '1', name: 'Test Item', value: 42 });
    });
  });

  describe('load', () => {
    it('should provide backward compatibility by returning only data', async () => {
      const data = await loader.load('app');
      
      expect(data).toEqual({ id: '1', name: 'Test Item', value: 42 });
    });
  });

  describe('getMetrics', () => {
    it('should track loader metrics correctly', async () => {
      // Load data multiple times
      await loader.loadSmart('app');
      await loader.loadSmart('app', { enableCache: true }); // This should be cached
      await loader.load('app'); // Backward compatibility method
      
      const metrics = loader.getMetrics();
      
      expect(metrics.totalRequests).toBe(3);
      expect(metrics.cacheHits).toBe(1);
      expect(metrics.cacheMisses).toBe(1);
      expect(metrics.filesystemFallbacks).toBe(2); // First load + backward compatibility load
      expect(metrics.averageLoadTime).toBeGreaterThan(0);
    });
  });

  describe('resetMetrics', () => {
    it('should reset all metrics to initial state', async () => {
      // Load data to populate metrics
      await loader.loadSmart('app');
      
      const metricsBefore = loader.getMetrics();
      expect(metricsBefore.totalRequests).toBe(1);
      
      loader.resetMetrics();
      
      const metricsAfter = loader.getMetrics();
      expect(metricsAfter.totalRequests).toBe(0);
      expect(metricsAfter.cacheHits).toBe(0);
      expect(metricsAfter.errors).toBe(0);
    });
  });

  describe('error handling', () => {
    class FailingSmartLoader extends BaseSmartLoader<TestType> {
      protected schema = TestSchema;
      protected resourceName = 'failing-test';

      protected async loadFromFilesystem(env: string): Promise<TestType> {
        throw new Error('Filesystem loading failed');
      }

      protected async tryLoadFromAPI(env: string, config: SmartLoadConfig): Promise<TestType | null> {
        throw new Error('API loading failed');
      }

      protected getTTL(env: string): number {
        return 300000;
      }
    }

    it('should handle errors gracefully', async () => {
      const failingLoader = new FailingSmartLoader();
      
      await expect(failingLoader.loadSmart('app')).rejects.toThrow('Failed to load failing-test');
    });
  });
});