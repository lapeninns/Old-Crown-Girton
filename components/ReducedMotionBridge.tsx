"use client";

import React from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';

export function ReducedMotionBridge({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();
  const transition = prefersReduced ? { duration: 0.08, ease: 'linear' as const } : undefined;
  return <MotionConfig transition={transition}>{children}</MotionConfig>;
}

export default ReducedMotionBridge;

