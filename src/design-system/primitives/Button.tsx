"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  buttonRecipe,
  type ButtonSize,
  type ButtonVariant,
  cx,
} from "@/src/design-system/recipes";

export type { ButtonSize, ButtonVariant } from "@/src/design-system/recipes";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  type?: "button" | "submit" | "reset";
  href?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
}

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const spinnerSizeClasses: Record<ButtonSize, string> = {
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",
};

export default function Button({
  children,
  variant = "brand",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  loading,
  className = "",
  disabled = false,
  onClick,
  type = "button",
  href,
  ariaLabel,
  fullWidth = false,
  target,
  rel,
}: ButtonProps) {
  const showLoading = Boolean(isLoading || loading);
  const isDisabled = disabled || showLoading;
  const sharedClasses = buttonRecipe({
    variant,
    size,
    fullWidth,
    className: cx("btn h-auto touch-target", className),
  });
  const motionProps = isDisabled
    ? {}
    : {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
      };

  const content = showLoading ? (
    <span className="inline-flex items-center gap-2" aria-live="polite">
      <span className={`loading loading-spinner ${spinnerSizeClasses[size]}`} aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </span>
  ) : (
    <>
      {Icon && iconPosition === "left" ? <Icon className={iconSizeClasses[size]} aria-hidden="true" /> : null}
      <span>{children}</span>
      {Icon && iconPosition === "right" ? <Icon className={iconSizeClasses[size]} aria-hidden="true" /> : null}
    </>
  );

  if (href) {
    if (isDisabled) {
      return (
        <motion.a
          aria-disabled="true"
          tabIndex={-1}
          className={cx(sharedClasses, "pointer-events-none")}
          onClick={onClick}
          {...motionProps}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={sharedClasses}
        onClick={onClick}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={showLoading ? "true" : undefined}
      className={sharedClasses}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
