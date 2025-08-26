'use client';

import { motion, MotionProps } from 'framer-motion';
import { usePerformantMountAnimation } from '@/hooks/utils';
import { HTMLMotionProps } from 'framer-motion';
import { forwardRef, useCallback, useRef } from 'react';

/**
 * Performance-optimized motion components that prevent scroll jank
 * 
 * These components automatically:
 * - Defer animations until after initial render
 * - Apply proper will-change management
 * - Use GPU acceleration optimizations
 * - Handle viewport intersection efficiently
 */

interface PerformantMotionProps extends HTMLMotionProps<"div"> {
  /** Whether to defer the initial animation to prevent scroll jank */
  deferAnimation?: boolean;
  /** Custom animation delay in seconds */
  animationDelay?: number;
}

/**
 * Performance-optimized motion.div component
 */
export const PerformantMotionDiv = forwardRef<HTMLDivElement, PerformantMotionProps>(
  ({ deferAnimation = true, animationDelay = 0, className = '', ...props }, ref) => {
    const isMounted = usePerformantMountAnimation();
    const animationRef = useRef<HTMLDivElement>(null);

    // Optimization: Remove will-change after animation completes
    const handleAnimationComplete = useCallback(() => {
      if (animationRef.current) {
        animationRef.current.style.willChange = 'auto';
      }
    }, []);

    // Apply performance optimizations
    const optimizedClassName = `${className} motion-safe`.trim();
    
    // If deferring animation, wait for mount
    const shouldAnimate = !deferAnimation || isMounted;

    return (
      <motion.div
        ref={ref || animationRef}
        className={optimizedClassName}
        data-framer-component="true"
        onAnimationComplete={handleAnimationComplete}
        style={{
          willChange: shouldAnimate ? 'opacity, transform' : 'auto',
          ...props.style
        }}
        transition={{
          duration: 0.6,
          delay: animationDelay,
          ease: 'easeOut',
          ...props.transition
        }}
        {...props}
      />
    );
  }
);

PerformantMotionDiv.displayName = 'PerformantMotionDiv';

/**
 * Performance-optimized motion.section component for page sections
 */
export const PerformantMotionSection = forwardRef<HTMLElement, PerformantMotionProps>(
  ({ deferAnimation = true, animationDelay = 0, className = '', ...props }, ref) => {
    const isMounted = usePerformantMountAnimation();
    const animationRef = useRef<HTMLElement>(null);

    const handleAnimationComplete = useCallback(() => {
      if (animationRef.current) {
        animationRef.current.style.willChange = 'auto';
      }
    }, []);

    const optimizedClassName = `${className} motion-safe scroll-optimized`.trim();
    const shouldAnimate = !deferAnimation || isMounted;

    return (
      <motion.section
        ref={ref || animationRef}
        className={optimizedClassName}
        data-framer-component="true"
        data-whileinview={shouldAnimate}
        onAnimationComplete={handleAnimationComplete}
        style={{
          willChange: shouldAnimate ? 'opacity, transform' : 'auto',
          ...props.style
        }}
        transition={{
          duration: 0.8,
          delay: animationDelay,
          ease: 'easeOut',
          ...props.transition
        }}
        viewport={{ 
          once: true, 
          margin: '-10% 0px -10% 0px', // Trigger animation slightly before coming into view
          ...props.viewport 
        }}
        {...props}
      />
    );
  }
);

PerformantMotionSection.displayName = 'PerformantMotionSection';

/**
 * Default animation variants optimized for performance
 */
export const performantVariants = {
  hidden: { 
    opacity: 0, 
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0
  }
};

/**
 * Stagger animation variants for lists
 */
export const performantStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export default PerformantMotionDiv;