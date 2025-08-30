"use client";

// Enhanced dynamic motion components for maximum bundle optimization
import dynamic from 'next/dynamic';
import React, { memo, forwardRef } from 'react';

// Create fallback components that match the motion API
const StaticDiv = memo(forwardRef<HTMLDivElement, any>((props, ref) => (
  <div ref={ref} {...props} />
)));
StaticDiv.displayName = 'StaticDiv';

const StaticSpan = memo(forwardRef<HTMLSpanElement, any>((props, ref) => (
  <span ref={ref} {...props} />
)));
StaticSpan.displayName = 'StaticSpan';

const StaticButton = memo(forwardRef<HTMLButtonElement, any>((props, ref) => (
  <button ref={ref} {...props} />
)));
StaticButton.displayName = 'StaticButton';

const StaticAnimatePresence = memo(({ children }: { children?: React.ReactNode }) => (
  <>{children}</>
));
StaticAnimatePresence.displayName = 'StaticAnimatePresence';

// Dynamic imports with proper fallbacks
export const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => ({ default: mod.motion.div })),
  {
    ssr: false,
    loading: () => <StaticDiv />
  }
);

export const MotionSpan = dynamic(
  () => import('framer-motion').then((mod) => ({ default: mod.motion.span })),
  {
    ssr: false, 
    loading: () => <StaticSpan />
  }
);

export const MotionButton = dynamic(
  () => import('framer-motion').then((mod) => ({ default: mod.motion.button })),
  {
    ssr: false,
    loading: () => <StaticButton />
  }
);

export const AnimatePresence = dynamic(
  () => import('framer-motion').then((mod) => ({ default: mod.AnimatePresence })),
  {
    ssr: false,
    loading: () => <StaticAnimatePresence />
  }
);

// Memoized versions for better performance
export const MemoizedMotionDiv = memo(MotionDiv);
export const MemoizedMotionSpan = memo(MotionSpan);
export const MemoizedMotionButton = memo(MotionButton);

MemoizedMotionDiv.displayName = 'MemoizedMotionDiv';
MemoizedMotionSpan.displayName = 'MemoizedMotionSpan'; 
MemoizedMotionButton.displayName = 'MemoizedMotionButton';

// Performance-optimized motion components
export { 
  PerformantMotionDiv, 
  PerformantMotionSection, 
  performantVariants, 
  performantStagger 
} from './PerformantMotion';
