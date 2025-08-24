import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { MenuSchema } from '@/src/lib/data/schemas';
import { getMenuData } from '@/src/lib/data/server-loader';

describe('Menu Data Validation', () => {
  describe('Menu Directory Structure', () => {
    it('should have valid menu files in /menu directory', () => {
      const menuDir = join(process.cwd(), 'menu');
      const menuFiles = readdirSync(menuDir).filter(file => file.endsWith('.json'));
      
      expect(menuFiles.length).toBeGreaterThan(0);
      
      for (const file of menuFiles) {
        const filePath = join(menuDir, file);
        expect(() => {
          const content = readFileSync(filePath, 'utf-8');
          JSON.parse(content);
        }).not.toThrow();
      }
    });

    it('should have proper menu structure with valid item properties', () => {
      const menuFiles = [
        'starters.json', 'mixed_grills.json', 'speciality.json', 
        'authentic_dishes.json', 'naans.json', 'fries.json',
        'pub_grub.json', 'rice.json', 'pub_classics.json', 
        'salads.json', 'sides.json', 'kids_menu.json', 'desserts.json'
      ];
      
      for (const fileName of menuFiles) {
        const filePath = join(process.cwd(), 'menu', fileName);
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf-8');
          const items = JSON.parse(content);
          
          expect(Array.isArray(items)).toBe(true);
          
          for (const item of items) {
            expect(item).toHaveProperty('name');
            expect(item).toHaveProperty('price');
            expect(item.price).toHaveProperty('amount');
            expect(item.price).toHaveProperty('currency');
            expect(typeof item.price.amount).toBe('number');
            expect(item.price.amount).toBeGreaterThan(0);
            expect(typeof item.price.currency).toBe('string');
          }
        }
      }
    });

    it('should validate against MenuSchema when loaded through getMenuData', async () => {
      const menuData = await getMenuData('dev');
      const result = MenuSchema.safeParse(menuData);
      
      if (!result.success) {
        console.error('Menu validation errors:', result.error.issues);
      }
      
      expect(result.success).toBe(true);
    });
  });
});
