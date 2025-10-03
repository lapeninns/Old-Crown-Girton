/**
 * Unit tests for RestaurantSmartLoader
 * 
 * Tests the enhanced RestaurantSmartLoader including:
 * - Restaurant data loading from filesystem
 * - API integration and fallback
 * - Data validation
 * - Health status checking
 * - Contact information validation
 */

import { RestaurantSmartLoader } from '@/src/lib/data/loaders/RestaurantSmartLoader';
import { RestaurantSchema } from '@/src/lib/data/schemas';
import fs from 'fs/promises';

// Mock restaurant data for testing
const mockRestaurantData = {
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
    "monday": "11:30 AM - 10:00 PM",
    "tuesday": "11:30 AM - 10:00 PM",
    "wednesday": "11:30 AM - 10:00 PM",
    "thursday": "11:30 AM - 10:00 PM",
    "friday": "11:30 AM - 11:00 PM",
    "saturday": "12:00 PM - 11:00 PM",
    "sunday": "12:00 PM - 9:00 PM"
  }
};

// Mock filesystem operations
jest.mock('fs/promises');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('RestaurantSmartLoader', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock reading restaurant.json file
    mockedFs.readFile.mockResolvedValue(JSON.stringify(mockRestaurantData));
  });

  describe('loadFromFilesystem', () => {
    it('should load restaurant data from filesystem', async () => {
      const result = await RestaurantSmartLoader.loadSmart('app');
      
      expect(result.data).toBeDefined();
      expect(result.data.name).toBe("The Himalayan Spice");
      expect(result.data.phone).toBe("+44 1223 277217");
      expect(result.data.email).toBe("info@himalayanspice.example.com");
      expect(result.data.address).toEqual({
        street: "123 Main Street",
        city: "London",
        state: "Greater London",
        zip: "SW1A 1AA"
      });
      expect(Object.keys(result.data.hours)).toHaveLength(7);
    });

    it('should validate restaurant data with Zod schema', async () => {
      const result = await RestaurantSmartLoader.loadSmart('app');
      
      expect(() => RestaurantSchema.parse(result.data)).not.toThrow();
    });

    it('should handle missing restaurant file', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('File not found'));
      
      await expect(RestaurantSmartLoader.loadSmart('app')).rejects.toThrow();
    });

    it('should handle invalid restaurant data', async () => {
      // Mock invalid data
      mockedFs.readFile.mockResolvedValue(JSON.stringify({
        name: "Test Restaurant"
        // Missing required fields
      }));
      
      await expect(RestaurantSmartLoader.loadSmart('app')).rejects.toThrow();
    });
  });

  describe('load', () => {
    it('should provide backward compatibility by returning only restaurant data', async () => {
      const restaurant = await RestaurantSmartLoader.load('app');
      
      expect(restaurant).toBeDefined();
      expect(restaurant.name).toBe("The Himalayan Spice");
      expect(restaurant.phone).toBe("+44 1223 277217");
    });
  });

  describe('preload', () => {
    it('should preload restaurant data without errors', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await RestaurantSmartLoader.preload('app');
      
      expect(consoleSpy).toHaveBeenCalledWith('Restaurant data preloaded for environment: app');
      consoleSpy.mockRestore();
    });
  });

  describe('getHealthStatus', () => {
    it('should return healthy status for valid restaurant data', async () => {
      const health = await RestaurantSmartLoader.getHealthStatus('app');
      
      expect(health.status).toBe('healthy');
      expect(health.details.hasRequiredFields).toBe(true);
      expect(health.details.cacheStatus).toBeDefined();
    });

    it('should return degraded status for incomplete restaurant data', async () => {
      // Mock incomplete data
      mockedFs.readFile.mockResolvedValue(JSON.stringify({
        name: "Test Restaurant"
        // Missing phone, email, address
      }));
      
      const health = await RestaurantSmartLoader.getHealthStatus('app');
      
      expect(health.status).toBe('degraded');
      expect(health.details.hasRequiredFields).toBe(false);
    });
  });

  describe('validateContactInfo', () => {
    it('should validate correct contact information', async () => {
      const validation = await RestaurantSmartLoader.validateContactInfo('app');
      
      expect(validation.valid).toBe(true);
      expect(validation.issues).toHaveLength(0);
    });

    it('should detect invalid phone number format', async () => {
      mockedFs.readFile.mockResolvedValue(JSON.stringify({
        ...mockRestaurantData,
        phone: "invalid-phone"
      }));
      
      const validation = await RestaurantSmartLoader.validateContactInfo('app');
      
      expect(validation.valid).toBe(false);
      expect(validation.issues).toContain('Invalid phone number format');
    });

    it('should detect invalid email format', async () => {
      mockedFs.readFile.mockResolvedValue(JSON.stringify({
        ...mockRestaurantData,
        email: "invalid-email"
      }));
      
      const validation = await RestaurantSmartLoader.validateContactInfo('app');
      
      expect(validation.valid).toBe(false);
      expect(validation.issues).toContain('Invalid email format');
    });

    it('should detect incomplete address', async () => {
      mockedFs.readFile.mockResolvedValue(JSON.stringify({
        ...mockRestaurantData,
        address: {
          street: "", // Empty street
          city: "London"
          // Missing state and zip
        }
      }));
      
      const validation = await RestaurantSmartLoader.validateContactInfo('app');
      
      expect(validation.valid).toBe(false);
      expect(validation.issues).toContain('Incomplete address information');
    });

    it('should detect missing opening hours', async () => {
      mockedFs.readFile.mockResolvedValue(JSON.stringify({
        ...mockRestaurantData,
        hours: {} // Empty hours
      }));
      
      const validation = await RestaurantSmartLoader.validateContactInfo('app');
      
      expect(validation.valid).toBe(false);
      expect(validation.issues).toContain('Missing opening hours');
    });
  });
});