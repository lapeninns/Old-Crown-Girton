"use client";

import React from "react";
import { motion } from "framer-motion";
import { cardRecipe, type CardTone } from "@/src/design-system/recipes";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  tone?: CardTone;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function Card({
  children,
  className = "",
  hover = true,
  tone = "default",
  onClick,
}: CardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={hover ? { y: -2 } : undefined}
      className={cardRecipe({
        tone,
        interactive: hover || Boolean(onClick),
        className: onClick ? `cursor-pointer ${className}`.trim() : className,
      })}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
