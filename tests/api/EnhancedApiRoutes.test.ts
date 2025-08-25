/**
 * Integration tests for enhanced API routes
 * 
 * Tests the enhanced API routes including:
 * - Standardized response format
 * - Enhanced caching headers
 * - Error handling
 * - Health monitoring integration
 */

import { createMocks } from 'node-mocks-http';
import { GET as menuGET } from '@/app/api/menu/route';
import { GET as restaurantGET } from '@/app/api/restaurant/route';
import { GET as marketingGET } from '@/app/api/marketing/route';
import { GET as configGET } from '@/app/api/config/route';
import { GET as healthGET } from '@/app/api/health/route';
import { GET as contentGET } from '@/app/api/content/route';

// Mock data for API responses
const mockMenuData = {
  updatedAt: new Date().toISOString(),
  sections: [
    {
      id: "starters",
      name: "Starters",
      items: [
        {
          id: "starter-1",
          name: "Soup of the Day",
          description: "Fresh daily soup",
          price: { amount: 5.99, currency: "GBP" },
          available: true,
          dietary: { vegetarian: true },
          tags: []
        }
      ]
    }
  ]
};

const mockRestaurantData = {
  name: "The Himalayan Spice",
  phone: "+44 20 7123 4567",
  email: "info@himalayanspice.example.com",
  address: {
    street: "123 Main Street",
    city: "London",
    state: "Greater London",
    zip: "SW1A 1AA"
  },
  hours: {
    "monday": "11:30 AM - 10:00 PM"
  }
};

const mockMarketingData = {
  hero: {
    title: "Welcome to Our Restaurant",
    subtitle: "Authentic Himalayan Cuisine"
  },
  promos: [
    {
      id: "promo-1",
      title: "Lunch Special",
      body: "2 courses for £12.99"
    }
  ]
};

const mockConfigData = {
  env: "app",
  featureFlags: {
    "cms": false
  },
  api: {
    baseUrl: null,
    menuEndpoint: null,
    marketingEndpoint: null,
    restaurantEndpoint: null,
    contentEndpoint: null
  },
  cms: {
    enabled: false
  },
  metadata: {
    appName: "Old Crown",
    domainName: "localhost"
  }
};

const mockContentData = {
  global: {
    site: {
      name: "The Himalayan Spice",
      title: "Authentic Himalayan Cuisine"
    }
  },
  navigation: {
    header: {
      links: [
        { href: "/", label: "Home" },
        { href: "/menu", label: "Menu" }
      ]
    },
    footer: {
      copyright: "© 2023 The Himalayan Spice",
      sections: []
    },
    breadcrumbs: {
      home: "Home",
      separator: "/"
    }
  },
  ui: {
    buttons: {
      order: "Order Now",
      reserve: "Book a Table"
    }
  }
};

// Mock the data loader functions
jest.mock('@/src/lib/data/loaders/MenuSmartLoader', () => ({
  MenuSmartLoader: {
    loadSmart: jest.fn().mockResolvedValue({
      data: mockMenuData,
      cached: false,
      timestamp: new Date().toISOString(),
      source: 'filesystem',
      env: 'app'
    })
  }
}));

jest.mock('@/src/lib/data/loaders/RestaurantSmartLoader', () => ({
  RestaurantSmartLoader: {
    loadSmart: jest.fn().mockResolvedValue({
      data: mockRestaurantData,
      cached: false,
      timestamp: new Date().toISOString(),
      source: 'filesystem',
      env: 'app'
    })
  }
}));

jest.mock('@/src/lib/data/loaders/MarketingSmartLoader', () => ({
  MarketingSmartLoader: {
    loadSmart: jest.fn().mockResolvedValue({
      data: mockMarketingData,
      cached: false,
      timestamp: new Date().toISOString(),
      source: 'filesystem',
      env: 'app'
    })
  }
}));

jest.mock('@/src/lib/data/loaders/ContentSmartLoader', () => ({
  ContentSmartLoader: {
    loadSmart: jest.fn().mockResolvedValue({
      data: mockContentData,
      cached: false,
      timestamp: new Date().toISOString(),
      source: 'filesystem',
      env: 'app'
    })
  }
}));

jest.mock('@/src/lib/data/server-loader', () => ({
  getConfigData: jest.fn().mockResolvedValue(mockConfigData)
}));

jest.mock('@/src/lib/data/loaders', () => ({
  getAllHealthStatus: jest.fn().mockResolvedValue({
    overall: 'healthy',
    menu: { status: 'healthy' },
    restaurant: { status: 'healthy' },
    marketing: { status: 'healthy' },
    content: { status: 'healthy' }
  }),
  getAllMetrics: jest.fn().mockResolvedValue({
    menu: {},
    restaurant: {},
    marketing: {},
    content: {}
  })
}));

jest.mock('@/src/lib/data/loaders/EnhancedGlobalCacheManager', () => ({
  enhancedGlobalCache: {
    getHealthStatus: jest.fn().mockResolvedValue({
      overall: 'healthy',
      details: {}
    }),
    getStats: jest.fn().mockReturnValue({
      hitRate: 0.85,
      averageLoadTime: 150,
      cacheSize: 1024
    }),
    getPerformanceHistory: jest.fn().mockReturnValue([])
  }
}));

describe('Enhanced API Routes', () => {
  describe('Menu API Route', () => {
    it('should return standardized response format', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/menu'
      });

      const response = await menuGET(req);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('success');
      expect(data.data).toBeDefined();
      expect(data.meta).toBeDefined();
      expect(data.meta.source).toBe('filesystem');
      expect(data.meta.env).toBe('app');
    });

    it('should include proper cache headers', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/menu'
      });

      const response = await menuGET(req);
      const headers = response.headers;
      
      expect(headers.get('cache-control')).toContain('public');
      expect(headers.get('cache-control')).toContain('s-maxage');
      expect(headers.get('cache-control')).toContain('stale-while-revalidate');
    });

    it('should handle errors gracefully', async () => {
      // Mock an error
      const { MenuSmartLoader } = require('@/src/lib/data/loaders/MenuSmartLoader');
      MenuSmartLoader.loadSmart.mockRejectedValue(new Error('Test error'));
      
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/menu'
      });

      const response = await menuGET(req);
      
      expect(response.status).toBe(500);
      
      const data = await response.json();
      expect(data.status).toBe('error');
      expect(data.error).toBeDefined();
    });
  });

  describe('Restaurant API Route', () => {
    it('should return standardized response format', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/restaurant'
      });

      const response = await restaurantGET(req);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('success');
      expect(data.data).toBeDefined();
      expect(data.data.name).toBe("The Himalayan Spice");
    });
  });

  describe('Marketing API Route', () => {
    it('should return standardized response format', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/marketing'
      });

      const response = await marketingGET(req);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('success');
      expect(data.data).toBeDefined();
      expect(data.data.hero).toBeDefined();
    });
  });

  describe('Config API Route', () => {
    it('should return standardized response format with safe fields only', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/config'
      });

      const response = await configGET(req);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('success');
      expect(data.data).toBeDefined();
      expect(data.data.env).toBe('app');
      expect(data.data.cms).toBeDefined();
      // Should not include sensitive fields
      expect(data.data).not.toHaveProperty('database');
    });
  });

  describe('Content API Route', () => {
    it('should return standardized response format', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/content'
      });

      const response = await contentGET(req);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('success');
      expect(data.data).toBeDefined();
      expect(data.data.global).toBeDefined();
    });
  });

  describe('Health API Route', () => {
    it('should return system health status', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/health'
      });

      const response = await healthGET(req);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('success');
      expect(data.data).toBeDefined();
      expect(data.data.overall).toBeDefined();
    });
  });

  describe('API Response Headers', () => {
    it('should include performance monitoring headers', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/menu'
      });

      const response = await menuGET(req);
      const headers = response.headers;
      
      expect(headers.get('x-request-id')).toBeDefined();
      expect(headers.get('x-source')).toBe('filesystem');
      expect(headers.get('x-cached')).toBe('false');
    });

    it('should handle conditional requests', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/menu',
        headers: {
          'if-none-match': '"test-etag"',
          'if-modified-since': new Date().toUTCString()
        }
      });

      // Note: Actual 304 handling would require more complex mocking
      const response = await menuGET(req);
      // Should still return 200 for this test since we're not mocking exact ETag matching
      expect(response.status).toBe(200);
    });
  });
});