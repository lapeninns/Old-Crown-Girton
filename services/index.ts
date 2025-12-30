/**
 * Services Module - Barrel Export
 * 
 * This module provides service abstractions following SOLID principles:
 * - Dependency Inversion: High-level modules depend on interfaces
 * - Interface Segregation: Focused interfaces for specific needs
 * - Single Responsibility: Each service handles one domain concern
 * 
 * @module services
 * 
 * @example
 * ```tsx
 * // In your app root
 * import { ServiceProvider } from '@/services';
 * 
 * function App() {
 *   return (
 *     <ServiceProvider>
 *       <YourApp />
 *     </ServiceProvider>
 *   );
 * }
 * 
 * // In components
 * import { useService } from '@/services';
 * 
 * function MyComponent() {
 *   const restaurant = useService('restaurant');
 *   const status = await restaurant.getStatus();
 * }
 * ```
 */

// Interfaces (abstractions)
export * from './interfaces';

// Implementations (concretions)
export * from './implementations';

// Providers (DI containers)
export * from './providers';
