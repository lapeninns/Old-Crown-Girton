"use client";

import React from "react";

type EmojiIconProps = {
  emoji: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string; // Optional accessible label for meaningful emoji
};

const sizeClasses = {
  sm: "text-sm",
  md: "text-base", 
  lg: "text-xl",
  xl: "text-2xl"
};

/**
 * Consistent emoji icon component that handles accessibility properly.
 * - Decorative emoji (no label): automatically aria-hidden
 * - Meaningful emoji (with label): includes sr-only text for screen readers
 */
export function EmojiIcon({ emoji, className = "", size = "md", label }: EmojiIconProps) {
  const sizeClass = sizeClasses[size];
  
  if (label) {
    // Meaningful emoji with accessible label
    return (
      <span className={`${sizeClass} ${className}`}>
        <span aria-hidden="true">{emoji}</span>
        <span className="sr-only">{label}</span>
      </span>
    );
  }
  
  // Decorative emoji - hidden from screen readers
  return (
    <span 
      className={`${sizeClass} ${className}`}
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
}

export default EmojiIcon;