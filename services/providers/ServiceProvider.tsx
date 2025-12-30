"use client";

/**
 * Services Provider
 * 
 * Following Dependency Inversion Principle (DIP):
 * Provides service instances via React Context for dependency injection.
 * Components depend on abstractions (interfaces), not concretions.
 * 
 * @module services/providers/ServiceProvider
 */

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { IRestaurantService } from '../interfaces/IRestaurantService';
import type { IContentService } from '../interfaces/IContentService';
import { createRestaurantService } from '../implementations/RestaurantService';

/**
 * All available services.
 * Extend this interface as new services are added.
 */
export interface Services {
    restaurant: IRestaurantService;
    // content: IContentService; // Uncomment when implemented
}

/**
 * Factory functions for creating service instances.
 * Override these in tests to inject mocks.
 */
export interface ServiceFactories {
    restaurant?: () => IRestaurantService;
    // content?: () => IContentService;
}

/**
 * Service Provider props.
 */
export interface ServiceProviderProps {
    /** Override default service factories for testing */
    factories?: ServiceFactories;
    /** Child components */
    children: ReactNode;
}

/**
 * Context for services.
 * Null by default - must be provided at app root.
 */
const ServicesContext = createContext<Services | null>(null);
ServicesContext.displayName = 'ServicesContext';

/**
 * Hook to access services.
 * Throws if used outside of ServiceProvider.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { restaurant } = useServices();
 *   const data = await restaurant.fetch();
 * }
 * ```
 */
export function useServices(): Services {
    const context = useContext(ServicesContext);

    if (!context) {
        throw new Error(
            'useServices must be used within a ServiceProvider. ' +
            'Wrap your app with <ServiceProvider>.'
        );
    }

    return context;
}

/**
 * Hook to access a specific service.
 * Type-safe way to inject a single service.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const restaurantService = useService('restaurant');
 *   const data = await restaurantService.fetch();
 * }
 * ```
 */
export function useService<K extends keyof Services>(key: K): Services[K] {
    const services = useServices();
    return services[key];
}

/**
 * Default service factories.
 * These create the production implementations.
 */
const defaultFactories: Required<ServiceFactories> = {
    restaurant: createRestaurantService,
    // content: createContentService,
};

/**
 * Service Provider Component
 * 
 * Provides service instances to the component tree.
 * Use the `factories` prop to inject custom implementations for testing.
 * 
 * @example
 * ```tsx
 * // Production usage
 * <ServiceProvider>
 *   <App />
 * </ServiceProvider>
 * 
 * // Testing with mocks
 * <ServiceProvider factories={{ restaurant: () => mockRestaurantService }}>
 *   <ComponentUnderTest />
 * </ServiceProvider>
 * ```
 */
export function ServiceProvider({
    factories,
    children,
}: ServiceProviderProps): JSX.Element {
    // Merge custom factories with defaults
    const mergedFactories = useMemo(
        () => ({ ...defaultFactories, ...factories }),
        [factories]
    );

    // Create service instances
    const services = useMemo<Services>(
        () => ({
            restaurant: mergedFactories.restaurant(),
            // content: mergedFactories.content(),
        }),
        [mergedFactories]
    );

    return (
        <ServicesContext.Provider value={services}>
            {children}
        </ServicesContext.Provider>
    );
}

/**
 * Higher-order component to inject services as props.
 * Useful for class components or when you need services in props.
 * 
 * @example
 * ```tsx
 * function MyComponent({ services }: { services: Services }) {
 *   // Use services
 * }
 * 
 * export default withServices(MyComponent);
 * ```
 */
export function withServices<P extends { services: Services }>(
    Component: React.ComponentType<P>
): React.ComponentType<Omit<P, 'services'>> {
    function WithServicesWrapper(props: Omit<P, 'services'>) {
        const services = useServices();
        return <Component {...(props as P)} services={services} />;
    }

    WithServicesWrapper.displayName = `withServices(${Component.displayName || Component.name})`;

    return WithServicesWrapper;
}

export default ServiceProvider;
