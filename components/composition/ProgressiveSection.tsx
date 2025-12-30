"use client";

/**
 * Progressive Section Component
 * 
 * A reusable wrapper for progressively loading sections.
 * Uses the useProgressiveLoading hook for state management.
 * 
 * @module components/composition/ProgressiveSection
 */

import React, { type ReactNode } from 'react';
import { useProgressiveLoading, type ProgressiveLoadingOptions } from '@/hooks/ui/useProgressiveLoading';

/**
 * Props for the ProgressiveSection component.
 */
export interface ProgressiveSectionProps extends ProgressiveLoadingOptions {
    /** Content to render when loaded */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Placeholder content to show while loading */
    placeholder?: ReactNode;
    /** Whether to render a semantic section element */
    as?: 'section' | 'div' | 'article' | 'aside';
    /** Aria label for the section */
    ariaLabel?: string;
    /** ID of element that labels this section */
    ariaLabelledBy?: string;
    /** Data attribute for section identification */
    'data-section-id'?: string;
}

/**
 * Default placeholder component.
 */
function DefaultPlaceholder(): JSX.Element {
    return (
        <div
            className="bg-neutral-50 animate-pulse rounded"
            style={{ minHeight: '100px' }}
            aria-hidden="true"
        />
    );
}

/**
 * Progressive Section Component
 * 
 * Wraps content in a progressively-revealing container.
 * Content is delayed based on the delay prop, with smooth transitions.
 * 
 * @example
 * ```tsx
 * // Priority content - shows immediately
 * <ProgressiveSection priority>
 *   <Navbar />
 * </ProgressiveSection>
 * 
 * // Delayed content with placeholder
 * <ProgressiveSection 
 *   delay={500}
 *   placeholder={<MySkeleton />}
 *   ariaLabelledBy="testimonials-heading"
 * >
 *   <TestimonialsSection />
 * </ProgressiveSection>
 * ```
 */
export function ProgressiveSection({
    children,
    className = '',
    placeholder,
    delay = 0,
    priority = false,
    transitionDelay,
    as: Element = 'div',
    ariaLabel,
    ariaLabelledBy,
    'data-section-id': sectionId,
}: ProgressiveSectionProps): JSX.Element {
    const { shouldShow, isVisible } = useProgressiveLoading({
        delay,
        priority,
        transitionDelay,
    });

    const stateClass = isVisible
        ? 'progressive-section-loaded'
        : 'progressive-section-loading';

    return (
        <Element
            className={`${className} progressive-section ${stateClass}`.trim()}
            data-priority={priority ? 'true' : 'false'}
            data-section-id={sectionId}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
        >
            {shouldShow ? children : (placeholder || <DefaultPlaceholder />)}
        </Element>
    );
}

/**
 * Props for withProgressiveLoading HOC.
 */
export interface WithProgressiveLoadingOptions extends ProgressiveLoadingOptions {
    placeholder?: ReactNode;
    className?: string;
}

/**
 * Higher-order component for adding progressive loading to any component.
 * 
 * @example
 * ```tsx
 * const LazyTestimonials = withProgressiveLoading(TestimonialsSection, {
 *   delay: 1000,
 *   placeholder: <TestimonialsSkeleton />
 * });
 * 
 * <LazyTestimonials />
 * ```
 */
export function withProgressiveLoading<P extends object>(
    Component: React.ComponentType<P>,
    options: WithProgressiveLoadingOptions = {}
): React.ComponentType<P> {
    const { placeholder, className, ...loadingOptions } = options;

    function WithProgressiveLoading(props: P): JSX.Element {
        return (
            <ProgressiveSection
                {...loadingOptions}
                placeholder={placeholder}
                className={className}
            >
                <Component {...props} />
            </ProgressiveSection>
        );
    }

    WithProgressiveLoading.displayName = `withProgressiveLoading(${Component.displayName || Component.name
        })`;

    return WithProgressiveLoading;
}

export default ProgressiveSection;
