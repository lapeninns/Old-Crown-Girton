/**
 * Backward Compatibility Tests
 * 
 * Tests to ensure that existing components continue to work with the enhanced architecture:
 * - Existing API route consumers
 * - Legacy data loading patterns
 * - Component integrations
 * - Hook usage patterns
 */

import { getMenuData, getMenuSmart } from '@/src/lib/data/loaders/MenuSmartLoader';
import { getRestaurantInfo } from '@/src/lib/data/loaders/RestaurantSmartLoader';
import { getMarketingContent } from '@/src/lib/data/loaders/MarketingSmartLoader';
import { getContentData } from '@/src/lib/data/loaders/ContentSmartLoader';
import { getConfigData } from '@/src/lib/data/server-loader';
import { useMenu } from '@/src/lib/data/hooks/useMenu';
import { MenuSchema } from '@/src/lib/data/schemas';

// Mock data that matches the existing structure
const legacyMenuData = {
  updatedAt: new Date().toISOString(),
  sections: [
    {
      id: "starters",
      name: "Starters",
      items: [
        {
          id: "1",
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

const legacyRestaurantData = {
  name: "The Himalayan Spice",
  phone: "+44 1223 277217",
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

// Mock filesystem operations
jest.mock('fs/promises', () => ({
  default: {
    readFile: jest.fn().mockImplementation((filePath: string) => {
      if (filePath.includes('menu')) {
        return Promise.resolve(JSON.stringify(legacyMenuData.sections[0].items));
      }
      if (filePath.includes('restaurant.json')) {
        return Promise.resolve(JSON.stringify(legacyRestaurantData));
      }
      if (filePath.includes('marketing.json')) {
        return Promise.resolve(JSON.stringify({ 
          hero: { title: "Test" },
          promos: []
        }));
      }
      if (filePath.includes('content.json')) {
        return Promise.resolve(JSON.stringify({
          global: { site: { name: "Test" } },
          navigation: { header: { links: [] } },
          ui: { buttons: {} }
        }));
      }
      return Promise.reject(new Error('File not found'));
    }),
    access: jest.fn().mockResolvedValue(undefined)
  }
}));

describe('Backward Compatibility', () => {
  describe('Legacy Data Loading Functions', () => {
    it('should maintain getMenuData interface', async () => {
      const menu = await getMenuData('app');
      
      expect(menu).toBeDefined();
      expect(menu.sections).toBeDefined();
      expect(Array.isArray(menu.sections)).toBe(true);
      
      // Validate with existing schema
      expect(() => MenuSchema.parse(menu)).not.toThrow();
    });

    it('should maintain getMenuSmart interface', async () => {
      const menu = await getMenuSmart('app');
      
      expect(menu).toBeDefined();
      expect(menu.sections).toBeDefined();
      expect(Array.isArray(menu.sections)).toBe(true);
    });

    it('should maintain getRestaurantInfo interface', async () => {
      const restaurant = await getRestaurantInfo('app');
      
      expect(restaurant).toBeDefined();
      expect(restaurant.name).toBe("The Himalayan Spice");
      expect(restaurant.phone).toBe("+44 1223 277217");
    });

    it('should maintain getMarketingContent interface', async () => {
      const marketing = await getMarketingContent('app');
      
      expect(marketing).toBeDefined();
      expect(marketing.hero).toBeDefined();
    });

    it('should maintain getContentData interface', async () => {
      const content = await getContentData('app');
      
      expect(content).toBeDefined();
      expect(content.global).toBeDefined();
    });

    it('should maintain getConfigData interface', async () => {
      const config = await getConfigData('app');
      
      expect(config).toBeDefined();
      expect(config.env).toBe("app");
    });
  });

  describe('Legacy Hook Usage', () => {
    it('should maintain useMenu hook interface', () => {
      // This is a bit tricky to test without a React testing environment,
      // but we can at least verify the function exists and has the right signature
      expect(typeof useMenu).toBe('function');
    });
  });

  describe('Data Structure Compatibility', () => {
    it('should return data structures compatible with existing components', async () => {
      const menu = await getMenuData('app');
      
      // Check that the structure matches what existing components expect
      expect(menu.updatedAt).toBeDefined();
      expect(Array.isArray(menu.sections)).toBe(true);
      
      if (menu.sections.length > 0) {
        const section = menu.sections[0];
        expect(section.id).toBeDefined();
        expect(section.name).toBeDefined();
        expect(Array.isArray(section.items)).toBe(true);
        
        if (section.items.length > 0) {
          const item = section.items[0];
          expect(item.id).toBeDefined();
          expect(item.name).toBeDefined();
          expect(item.price).toBeDefined();
          expect(item.price.amount).toBeDefined();
          expect(item.dietary).toBeDefined();
        }
      }
    });

    it('should maintain restaurant data structure compatibility', async () => {
      const restaurant = await getRestaurantInfo('app');
      
      // Check that the structure matches what existing components expect
      expect(restaurant.name).toBeDefined();
      expect(restaurant.phone).toBeDefined();
      expect(restaurant.email).toBeDefined();
      expect(restaurant.address).toBeDefined();
      expect(restaurant.address.street).toBeDefined();
      expect(restaurant.hours).toBeDefined();
    });
  });

  describe('Error Handling Compatibility', () => {
    it('should maintain existing error handling patterns', async () => {
      // Mock a failure scenario
      jest.mock('fs/promises', () => ({
        default: {
          readFile: jest.fn().mockRejectedValue(new Error('File not found')),
          access: jest.fn().mockRejectedValue(new Error('File not found'))
        }
      }));
      
      // Reset the module cache to use the new mock
      jest.resetModules();
      
      // Import the functions again to use the new mock
      const { getMenuData } = require('@/src/lib/data/loaders/MenuSmartLoader');
      
      await expect(getMenuData('app')).rejects.toThrow();
    });
  });

  describe('Performance Characteristics', () => {
    it('should not significantly degrade performance for existing usage patterns', async () => {
      const startTime = Date.now();
      
      // Perform multiple loads to measure performance
      for (let i = 0; i < 10; i++) {
        await getMenuData('app');
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Should complete within a reasonable time (this is a basic check)
      expect(totalTime).toBeLessThan(5000); // 5 seconds
    });
  });

  describe('Configuration Compatibility', () => {
    it('should work with existing environment configurations', async () => {
      // Test with different environment values that existing code might use
      const environments = ['app', 'dev', 'staging', 'prod'] as const;
      
      for (const env of environments) {
        const menu = await getMenuData(env);
        expect(menu).toBeDefined();
      }
    });
  });
});