"use client";

import React, { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
};

export function FadeIn({ children, className = "", style }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({ children, className = "", style }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function BouncyEmoji({ children, className = "", style }: Props) {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ y: 0 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      className={className}
      style={style}
    >
      {children}
    </motion.span>
  );
}

type LinkButtonProps = Props & {
  href: string;
  onClick?: () => void;
  download?: string;
  target?: string;
  rel?: string;
};

export function MotionLinkButton({ children, className = "", href, onClick, ariaLabel, download, target, rel }: LinkButtonProps) {
  return (
    <motion.a
      href={href}
      role="button"
      onClick={onClick}
      download={download}
      target={target}
      rel={rel}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </motion.a>
  );
}

// No default export — module provides named motion helpers
