"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";
import { v } from "./variants";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const prefersReduced = useReducedMotion();

  const variants = prefersReduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : v.fade;

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => {
      try {
        const el = document.getElementById('main-content');
        if (el && 'focus' in el) (el as HTMLElement).focus();
      } catch {}
    }}>
      <motion.main
        key={pathname}
        variants={variants as any}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

export default PageTransition;
