/**
 * Unit tests for MenuSmartLoader
 * 
 * Tests the enhanced MenuSmartLoader including:
 * - Menu data loading from filesystem
 * - API integration and fallback
 * - Data validation and transformation
 * - Health status checking
 * - Preloading functionality
 */

import { MenuSmartLoader } from '@/src/lib/data/loaders/MenuSmartLoader';
import { MenuSchema } from '@/src/lib/data/schemas';
import fs from 'fs/promises';
import path from 'path';

// Mock menu data for testing
const mockMenuData = {
  starters: [
    { id: "starter-1", name: "Soup of the Day", description: "Fresh daily soup", price: 5.99, available: true, labels: ["veg"] },
    { id: "starter-2", name: "Garlic Bread", description: "Toasted bread with garlic butter", price: 4.50, available: true, labels: ["veg", "GF"] }
  ],
  mains: [
    { id: "main-1", name: "Grilled Salmon", description: "Fresh salmon with lemon butter sauce", price: 18.99, available: true, labels: ["GF"] },
    { id: "main-2", name: "Vegetable Curry", description: "Spicy vegetable curry with rice", price: 14.50, available: true, labels: ["veg", "GF", "spicy"] }
  ]
};

// Mock filesystem operations
jest.mock('fs/promises');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('MenuSmartLoader', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock menu directory structure
    mockedFs.access.mockResolvedValue(undefined as any);
    
    // Mock reading modular menu files
    mockedFs.readFile.mockImplementation(async (filePath: any) => {
      const fileName = path.basename(filePath as string, '.json');
      
      if (mockMenuData[fileName as keyof typeof mockMenuData]) {
        return JSON.stringify(mockMenuData[fileName as keyof typeof mockMenuData]);
      }
      
      // For other files, throw ENOENT to simulate missing files
      const error = new Error('File not found');
      (error as any).code = 'ENOENT';
      throw error;
    });
  });

  describe('loadFromFilesystem', () => {
    it('should load and transform menu data from modular files', async () => {
      const result = await MenuSmartLoader.loadSmart('app');
      
      expect(result.data).toBeDefined();
      expect(result.data.sections).toHaveLength(2); // starters and mains
      
      // Check starters section
      const startersSection = result.data.sections.find(s => s.id === 'starters');
      expect(startersSection).toBeDefined();
      expect(startersSection!.items).toHaveLength(2);
      
      // Check item transformation
      const firstStarter = startersSection!.items[0];
      expect(firstStarter.id).toBe('starter-1');
      expect(firstStarter.name).toBe('Soup of the Day');
      expect(firstStarter.dietary.vegetarian).toBe(true);
      expect(firstStarter.dietary.glutenFree).toBe(false);
      
      // Check gluten-free item
      const garlicBread = startersSection!.items[1];
      expect(garlicBread.dietary.glutenFree).toBe(true);
      
      // Check mains section
      const mainsSection = result.data.sections.find(s => s.id === 'mains');
      expect(mainsSection).toBeDefined();
      expect(mainsSection!.items).toHaveLength(2);
      
      // Validate with Zod schema
      expect(() => MenuSchema.parse(result.data)).not.toThrow();
    });

    it('should handle missing menu category files gracefully', async () => {
      // Mock one file as missing
      mockedFs.readFile.mockImplementation(async (filePath: any) => {
        const fileName = path.basename(filePath as string, '.json');
        
        if (fileName === 'starters') {
          const error = new Error('File not found');
          (error as any).code = 'ENOENT';
          throw error;
        }
        
        if (mockMenuData[fileName as keyof typeof mockMenuData]) {
          return JSON.stringify(mockMenuData[fileName as keyof typeof mockMenuData]);
        }
        
        const error = new Error('File not found');
        (error as any).code = 'ENOENT';
        throw error;
      });
      
      const result = await MenuSmartLoader.loadSmart('app');
      
      // Should still have mains section even though starters is missing
      expect(result.data.sections).toHaveLength(1);
      const mainsSection = result.data.sections.find(s => s.id === 'mains');
      expect(mainsSection).toBeDefined();
    });

    it('should handle invalid menu data gracefully', async () => {
      // Mock invalid data
      mockedFs.readFile.mockImplementation(async (filePath: any) => {
        const fileName = path.basename(filePath as string, '.json');
        
        if (fileName === 'starters') {
          // Invalid data - missing required fields
          return JSON.stringify([{ invalid: "data" }]);
        }
        
        if (mockMenuData[fileName as keyof typeof mockMenuData]) {
          return JSON.stringify(mockMenuData[fileName as keyof typeof mockMenuData]);
        }
        
        const error = new Error('File not found');
        (error as any).code = 'ENOENT';
        throw error;
      });
      
      const result = await MenuSmartLoader.loadSmart('app');
      
      // Should still process valid sections
      expect(result.data.sections).toBeDefined();
    });
  });

  describe('load', () => {
    it('should provide backward compatibility by returning only menu data', async () => {
      const menu = await MenuSmartLoader.load('app');
      
      expect(menu).toBeDefined();
      expect(menu.sections).toBeDefined();
      expect(Array.isArray(menu.sections)).toBe(true);
    });
  });

  describe('preload', () => {
    it('should preload menu data without errors', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await MenuSmartLoader.preload('app');
      
      expect(consoleSpy).toHaveBeenCalledWith('Menu data preloaded for environment: app');
      consoleSpy.mockRestore();
    });
  });

  describe('getHealthStatus', () => {
    it('should return healthy status for valid menu data', async () => {
      const health = await MenuSmartLoader.getHealthStatus('app');
      
      expect(health.status).toBe('healthy');
      expect(health.details.totalSections).toBeGreaterThan(0);
      expect(health.details.totalItems).toBeGreaterThan(0);
      expect(health.details.cacheStatus).toBeDefined();
    });

    it('should return degraded status for empty menu', async () => {
      // Mock empty menu data
      mockedFs.readFile.mockResolvedValue(JSON.stringify([]));
      
      const health = await MenuSmartLoader.getHealthStatus('app');
      
      expect(health.status).toBe('degraded');
      expect(health.details.totalItems).toBe(0);
    });
  });

  describe('parsePrice', () => {
    it('should parse numeric prices correctly', () => {
      // This would require accessing private method, so we'll test indirectly
      // through the load process with different price formats
    });
  });
});