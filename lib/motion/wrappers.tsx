"use client";

import dynamic from 'next/dynamic';
import React, { forwardRef, memo, useMemo } from 'react';
import type { MotionProps } from 'framer-motion';
import { useReducedMotion } from './accessibility';

export interface MotionWrapperProps<T = {}> {
  children?: React.ReactNode;
  reducedMotionFallback?: MotionProps;
  customVariants?: any;
  disabled?: boolean;
  className?: string;
  [key: string]: unknown;
}

// Dynamic motion component factory
function createDynamic(tag: keyof JSX.IntrinsicElements) {
  return dynamic(async () => {
    const mod = await import('framer-motion');
    // @ts-expect-error - index access for motion element
    return { default: mod.motion[tag] };
  }, { ssr: false, loading: () => React.createElement(tag) });
}

export function createMotionWrapper<T extends keyof JSX.IntrinsicElements>(
  tag: T,
  defaultVariants?: any
) {
  const MotionEl: any = createDynamic(tag);
  const StaticEl: any = tag;

  const Comp = memo(
    forwardRef<any, MotionWrapperProps & React.ComponentPropsWithoutRef<T>>(
      ({ children, reducedMotionFallback, customVariants, disabled, className, ...rest }, ref) => {
        const prefersReduced = useReducedMotion();
        const variants = useMemo(() => customVariants || defaultVariants || {}, [customVariants, defaultVariants]);
        const resolved = useMemo(() => {
          if (prefersReduced) {
            // Strip transforms when reduced motion
            return { ...variants, transition: { duration: 0 } };
          }
          return variants;
        }, [prefersReduced, variants]);

        if (disabled) {
          return (
            <StaticEl ref={ref} className={className} {...rest}>
              {children}
            </StaticEl>
          );
        }

        // Map interactive states if present
        const interactive: Record<string, any> = {};
        if ('hover' in resolved || 'tap' in resolved) {
          if (resolved.hover) interactive.whileHover = resolved.hover;
          if (resolved.tap) interactive.whileTap = resolved.tap;
        }
        return (
          <MotionEl
            ref={ref}
            className={className}
            variants={resolved}
            initial={resolved.initial ? 'initial' : undefined}
            animate={resolved.animate ? 'animate' : undefined}
            exit={resolved.exit ? 'exit' : undefined}
            {...interactive}
            {...rest}
          >
            {children}
          </MotionEl>
        );
      }
    )
  );
  Comp.displayName = `MotionWrapper(${String(tag)})`;
  return Comp;
}

export default createMotionWrapper;
