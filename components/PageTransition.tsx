"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";
import { variants as v } from "@/lib/motion/variants";

interface PageTransitionProps {
  children: React.ReactNode;
  routeKey?: string;
  disableMotion?: boolean; // route-level flag to fully disable motion
}

export function PageTransition({ children, routeKey, disableMotion }: PageTransitionProps) {
  const pathname = usePathname() || "";
  const key = routeKey ?? pathname;
  const prefersReduced = useReducedMotion();

  const pageVariants = prefersReduced || disableMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : v.pageTransition;

  return (
    <AnimatePresence
      mode="sync"
      initial={false}
      onExitComplete={() => {
        try {
          const el = document.getElementById('main-content') || document.querySelector('main');
          if (el && 'focus' in el) (el as HTMLElement).focus();
        } catch {}
      }}
    >
      <LayoutGroup id="route-group">
        <motion.main
          key={key}
          className="bg-neutral-100 min-h-[100svh]"
          variants={pageVariants as any}
          initial="initial"
          animate="animate"
          exit="exit"
          layout
        >
          {children}
        </motion.main>
      </LayoutGroup>
    </AnimatePresence>
  );
}

export default PageTransition;
