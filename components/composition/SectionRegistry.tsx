"use client";

/**
 * Section Registry
 * 
 * Implements the Open/Closed Principle (OCP) for page sections.
 * Components can be extended with new sections without modifying 
 * the rendering component.
 * 
 * @module components/composition/SectionRegistry
 */

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';

/**
 * Configuration for a registered section.
 */
export interface SectionConfig {
    /** Unique identifier for the section */
    id: string;
    /** Display order (lower numbers appear first) */
    order: number;
    /** The component to render */
    component: React.ComponentType<any>;
    /** Props to pass to the component */
    props?: Record<string, unknown>;
    /** Whether this section requires wrapping in a semantic section element */
    wrapInSection?: boolean;
    /** Aria label for the section wrapper */
    ariaLabel?: string;
    /** Aria labelledby ID for the section wrapper */
    ariaLabelledBy?: string;
    /** Whether the section is conditionally rendered */
    condition?: boolean;
    /** Loading delay in ms (for progressive loading) */
    delay?: number;
    /** Whether this is a priority section (loads immediately) */
    priority?: boolean;
    /** Fallback content while loading */
    fallback?: ReactNode;
    /** Custom placeholder for progressive loading */
    placeholder?: ReactNode;
    /** Whether to use Suspense for this section */
    useSuspense?: boolean;
}

/**
 * Simplified section definition for common cases.
 */
export interface SimpleSectionDef {
    id: string;
    order: number;
    component: React.ComponentType<any>;
    props?: Record<string, unknown>;
}

/**
 * Section registry state and actions.
 */
export interface SectionRegistry {
    /** All registered sections */
    sections: SectionConfig[];
    /** Get sections sorted by order */
    getSortedSections: () => SectionConfig[];
    /** Get a section by ID */
    getSection: (id: string) => SectionConfig | undefined;
    /** Get sections for a specific region */
    getSectionsByRegion: (region: string) => SectionConfig[];
}

/**
 * Props for the SectionRegistryProvider.
 */
export interface SectionRegistryProviderProps {
    /** Initial sections to register */
    sections?: SectionConfig[];
    /** Child components */
    children: ReactNode;
}

const SectionRegistryContext = createContext<SectionRegistry | null>(null);
SectionRegistryContext.displayName = 'SectionRegistryContext';

/**
 * Hook to access the section registry.
 * 
 * @throws Error if used outside of SectionRegistryProvider
 */
export function useSectionRegistry(): SectionRegistry {
    const context = useContext(SectionRegistryContext);

    if (!context) {
        throw new Error(
            'useSectionRegistry must be used within a SectionRegistryProvider.'
        );
    }

    return context;
}

/**
 * Provider for the section registry.
 * 
 * @example
 * ```tsx
 * const homeSections: SectionConfig[] = [
 *   { id: 'hero', order: 0, component: HeroSection, priority: true },
 *   { id: 'about', order: 10, component: AboutSection },
 *   { id: 'testimonials', order: 20, component: TestimonialsSection, delay: 500 },
 * ];
 * 
 * <SectionRegistryProvider sections={homeSections}>
 *   <SectionRenderer />
 * </SectionRegistryProvider>
 * ```
 */
export function SectionRegistryProvider({
    sections = [],
    children,
}: SectionRegistryProviderProps): JSX.Element {
    const registry = useMemo<SectionRegistry>(() => {
        const getSortedSections = () => {
            return [...sections]
                .filter(s => s.condition !== false)
                .sort((a, b) => a.order - b.order);
        };

        const getSection = (id: string) => {
            return sections.find(s => s.id === id);
        };

        const getSectionsByRegion = (region: string) => {
            return sections
                .filter(s => s.id.startsWith(`${region}:`) || s.id.startsWith(`${region}/`))
                .sort((a, b) => a.order - b.order);
        };

        return {
            sections,
            getSortedSections,
            getSection,
            getSectionsByRegion,
        };
    }, [sections]);

    return (
        <SectionRegistryContext.Provider value={registry}>
            {children}
        </SectionRegistryContext.Provider>
    );
}

/**
 * Props for the SectionRenderer component.
 */
export interface SectionRendererProps {
    /** CSS class to apply to each section wrapper */
    sectionClassName?: string;
    /** Component to use for loading state */
    LoadingComponent?: React.ComponentType<{ sectionId: string }>;
    /** Whether to wrap each section in a ProgressiveSection */
    progressiveLoading?: boolean;
    /** Custom wrapper component for progressive loading */
    ProgressiveWrapper?: React.ComponentType<{
        delay: number;
        priority: boolean;
        placeholder: ReactNode;
        children: ReactNode;
    }>;
}

/**
 * Default loading placeholder.
 */
function DefaultPlaceholder(): JSX.Element {
    return (
        <div className="bg-neutral-50 animate-pulse rounded" style={{ minHeight: '100px' }} />
    );
}

/**
 * Renders all registered sections in order.
 * This component reads from the registry and handles the orchestration.
 * 
 * @example
 * ```tsx
 * <SectionRegistryProvider sections={sections}>
 *   <main>
 *     <SectionRenderer progressiveLoading />
 *   </main>
 * </SectionRegistryProvider>
 * ```
 */
export function SectionRenderer({
    sectionClassName = '',
    LoadingComponent,
    progressiveLoading = false,
    ProgressiveWrapper,
}: SectionRendererProps): JSX.Element {
    const registry = useSectionRegistry();
    const sortedSections = registry.getSortedSections();

    return (
        <>
            {sortedSections.map((section) => {
                const {
                    id,
                    component: Component,
                    props = {},
                    wrapInSection = true,
                    ariaLabel,
                    ariaLabelledBy,
                    placeholder,
                    priority = false,
                    delay = 0,
                    useSuspense = false,
                } = section;

                // Render the component with its props
                const renderedComponent = <Component {...props} />;

                // Optionally wrap in Suspense
                const suspenseWrapped = useSuspense ? (
                    <React.Suspense
                        fallback={placeholder || (LoadingComponent ? <LoadingComponent sectionId={id} /> : <DefaultPlaceholder />)}
                    >
                        {renderedComponent}
                    </React.Suspense>
                ) : renderedComponent;

                // Create section wrapper if needed
                const sectionElement = wrapInSection ? (
                    <section
                        key={id}
                        className={sectionClassName}
                        aria-label={ariaLabel}
                        aria-labelledby={ariaLabelledBy}
                        data-section-id={id}
                    >
                        {suspenseWrapped}
                    </section>
                ) : (
                    <div key={id} data-section-id={id} className={sectionClassName}>
                        {suspenseWrapped}
                    </div>
                );

                // Apply progressive loading wrapper if enabled
                if (progressiveLoading && ProgressiveWrapper) {
                    return (
                        <ProgressiveWrapper
                            key={id}
                            delay={delay}
                            priority={priority}
                            placeholder={placeholder || <DefaultPlaceholder />}
                        >
                            {sectionElement}
                        </ProgressiveWrapper>
                    );
                }

                return sectionElement;
            })}
        </>
    );
}

/**
 * Helper to create a section configuration.
 */
export function defineSection(
    id: string,
    component: React.ComponentType<any>,
    options: Partial<Omit<SectionConfig, 'id' | 'component'>> = {}
): SectionConfig {
    return {
        id,
        component,
        order: 0,
        ...options,
    };
}

/**
 * Helper to create an ordered list of sections.
 */
export function defineSections(
    defs: Array<SimpleSectionDef | SectionConfig>
): SectionConfig[] {
    return defs.map((def, index) => ({
        order: index * 10, // Default ordering by position
        wrapInSection: true,
        ...def,
    }));
}

export default SectionRegistryProvider;
