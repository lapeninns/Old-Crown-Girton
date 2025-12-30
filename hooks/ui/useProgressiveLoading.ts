"use client";

/**
 * Progressive Loading Hook
 * 
 * Extracted from ClientHomeContent.tsx to follow SRP.
 * Handles the logic for progressively revealing content.
 * 
 * @module hooks/ui/useProgressiveLoading
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Options for progressive loading behavior.
 */
export interface ProgressiveLoadingOptions {
    /** Delay in ms before showing the content */
    delay?: number;
    /** Whether this is a priority item that shows immediately */
    priority?: boolean;
    /** Transition delay after content is ready */
    transitionDelay?: number;
}

/**
 * Result of the progressive loading hook.
 */
export interface ProgressiveLoadingResult {
    /** Whether the content should be rendered */
    shouldShow: boolean;
    /** Whether the content has completed its entrance transition */
    isVisible: boolean;
    /** Whether the content is currently transitioning */
    isTransitioning: boolean;
    /** Manually trigger the show animation */
    show: () => void;
    /** Manually hide the content */
    hide: () => void;
    /** Reset to initial state */
    reset: () => void;
}

const DEFAULT_TRANSITION_DELAY = 50;

/**
 * Hook for managing progressive/lazy reveal of content.
 * 
 * @param options - Configuration options
 * @returns State and controls for progressive loading
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { shouldShow, isVisible } = useProgressiveLoading({ delay: 500 });
 *   
 *   return (
 *     <div className={isVisible ? 'loaded' : 'loading'}>
 *       {shouldShow && <ExpensiveContent />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useProgressiveLoading(
    options: ProgressiveLoadingOptions = {}
): ProgressiveLoadingResult {
    const {
        delay = 0,
        priority = false,
        transitionDelay = DEFAULT_TRANSITION_DELAY,
    } = options;

    const initialState = priority || delay === 0;

    const [shouldShow, setShouldShow] = useState(initialState);
    const [isVisible, setIsVisible] = useState(initialState);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        // Priority items or zero-delay items show immediately
        if (priority || delay === 0) {
            setShouldShow(true);
            setIsVisible(true);
            return;
        }

        // Set up delayed show
        const showTimer = setTimeout(() => {
            setShouldShow(true);
            setIsTransitioning(true);

            // Small delay for smooth entrance transition
            const transitionTimer = setTimeout(() => {
                setIsVisible(true);
                setIsTransitioning(false);
            }, transitionDelay);

            return () => clearTimeout(transitionTimer);
        }, delay);

        return () => clearTimeout(showTimer);
    }, [delay, priority, transitionDelay]);

    const show = useCallback(() => {
        setShouldShow(true);
        setIsTransitioning(true);
        setTimeout(() => {
            setIsVisible(true);
            setIsTransitioning(false);
        }, transitionDelay);
    }, [transitionDelay]);

    const hide = useCallback(() => {
        setIsVisible(false);
        setIsTransitioning(true);
        setTimeout(() => {
            setShouldShow(false);
            setIsTransitioning(false);
        }, transitionDelay);
    }, [transitionDelay]);

    const reset = useCallback(() => {
        setShouldShow(initialState);
        setIsVisible(initialState);
        setIsTransitioning(false);
    }, [initialState]);

    return {
        shouldShow,
        isVisible,
        isTransitioning,
        show,
        hide,
        reset,
    };
}

/**
 * Hook for managing multiple progressive sections.
 * Useful for orchestrating a sequence of reveals.
 * 
 * @param count - Number of sections to manage
 * @param baseDelay - Base delay between sections
 * @param options - Additional options
 * @returns Array of loading states for each section
 */
export function useProgressiveSequence(
    count: number,
    baseDelay: number = 400,
    options: { priority?: number[] } = {}
): ProgressiveLoadingResult[] {
    const { priority = [] } = options;

    return Array.from({ length: count }, (_, index) => {
        const isPriority = priority.includes(index);
        const delay = isPriority ? 0 : baseDelay * (index + 1);

        // Note: This hook must be called unconditionally, 
        // so we can't use a dynamic hook count
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useProgressiveLoading({ delay, priority: isPriority });
    });
}

export default useProgressiveLoading;
