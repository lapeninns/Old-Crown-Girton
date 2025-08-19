import { readFileSync } from 'fs';
import { join } from 'path';
import { MenuSchema } from '@/src/lib/data/schemas';

describe('Menu Validation Tests', () => {
  describe('Production Menu Data', () => {
    it('should have a valid prod/menu.json file', () => {
      const menuPath = join(process.cwd(), 'data', 'prod', 'menu.json');
      
      expect(() => {
        const menuContent = readFileSync(menuPath, 'utf-8');
        JSON.parse(menuContent);
      }).not.toThrow();
    });

    it('should have valid menu structure according to schema', () => {
      const menuPath = join(process.cwd(), 'data', 'prod', 'menu.json');
      const menuContent = readFileSync(menuPath, 'utf-8');
      const menuData = JSON.parse(menuContent);
      
      // Validate against Zod schema
      const result = MenuSchema.safeParse(menuData);
      
      if (!result.success) {
        console.error('Menu validation errors:', result.error.issues);
      }
      
      expect(result.success).toBe(true);
    });

    it('should have all required menu sections', () => {
      const menuPath = join(process.cwd(), 'data', 'prod', 'menu.json');
      const menuContent = readFileSync(menuPath, 'utf-8');
      const menuData = JSON.parse(menuContent);
      
      expect(menuData).toHaveProperty('sections');
      expect(Array.isArray(menuData.sections)).toBe(true);
      expect(menuData.sections.length).toBeGreaterThan(0);
    });

    it('should have valid pricing for all menu items', () => {
      const menuPath = join(process.cwd(), 'data', 'prod', 'menu.json');
      const menuContent = readFileSync(menuPath, 'utf-8');
      const menuData = JSON.parse(menuContent);
      
      for (const section of menuData.sections) {
        for (const item of section.items) {
          expect(item.price).toHaveProperty('amount');
          expect(item.price).toHaveProperty('currency');
          expect(typeof item.price.amount).toBe('number');
          expect(item.price.amount).toBeGreaterThan(0);
          expect(typeof item.price.currency).toBe('string');
        }
      }
    });

    it('should have proper menu structure with valid item properties', () => {
      const menuPath = join(process.cwd(), 'data', 'prod', 'menu.json');
      const menuContent = readFileSync(menuPath, 'utf-8');
      const menuData = JSON.parse(menuContent);
      
      for (const section of menuData.sections) {
        expect(section).toHaveProperty('id');
        expect(section).toHaveProperty('name');
        expect(section).toHaveProperty('items');
        
        for (const item of section.items) {
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('name');
          expect(item).toHaveProperty('description');
          expect(item).toHaveProperty('price');
          expect(item).toHaveProperty('available');
          expect(typeof item.available).toBe('boolean');
        }
      }
    });
  });

  describe('Development Menu Data', () => {
    it('should have a valid dev/menu.json file', () => {
      const menuPath = join(process.cwd(), 'data', 'dev', 'menu.json');
      
      expect(() => {
        const menuContent = readFileSync(menuPath, 'utf-8');
        JSON.parse(menuContent);
      }).not.toThrow();
    });

    it('should match schema validation', () => {
      const menuPath = join(process.cwd(), 'data', 'dev', 'menu.json');
      const menuContent = readFileSync(menuPath, 'utf-8');
      const menuData = JSON.parse(menuContent);
      
      const result = MenuSchema.safeParse(menuData);
      expect(result.success).toBe(true);
    });
  });

  describe('Staging Menu Data', () => {
    it('should have a valid staging/menu.json file', () => {
      const menuPath = join(process.cwd(), 'data', 'staging', 'menu.json');
      
      expect(() => {
        const menuContent = readFileSync(menuPath, 'utf-8');
        JSON.parse(menuContent);
      }).not.toThrow();
    });

    it('should match schema validation', () => {
      const menuPath = join(process.cwd(), 'data', 'staging', 'menu.json');
      const menuContent = readFileSync(menuPath, 'utf-8');
      const menuData = JSON.parse(menuContent);
      
      const result = MenuSchema.safeParse(menuData);
      expect(result.success).toBe(true);
    });
  });
});
