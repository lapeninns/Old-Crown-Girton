"use client";

import React, { ReactNode } from 'react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { variants } from './variants';

interface DynamicMotionProps {
  children: (props: {
    motion: typeof m;
    AnimatePresence: typeof AnimatePresence;
    variants: typeof variants;
  }) => ReactNode;
}

/**
 * DynamicMotion component following the project's motion optimization strategy
 * Provides lazy-loaded motion components with static fallbacks
 */
export default function DynamicMotion({ children }: DynamicMotionProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children({
        motion: m,
        AnimatePresence,
        variants
      })}
    </LazyMotion>
  );
}

// Static fallback components for SSR and JS-disabled environments
export const StaticMotionDiv = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const StaticAnimatePresence = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

// Provide static variants for fallback scenarios
export const staticVariants = {
  fade: {},
  scaleIn: {
    initial: {},
    animate: {},
    exit: {}
  },
  fadeUp: {
    hidden: {},
    visible: {}
  },
  slideIn: {
    hidden: {},
    visible: {}
  }
};