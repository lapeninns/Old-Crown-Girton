'use client';

import { motion } from 'framer-motion';
import { v } from '@/components/variants';
import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  // Use semantic Tailwind mappings present in tailwind.config.js
  primary: 'bg-primary hover:bg-accent text-white shadow-lg',
  secondary: 'bg-secondary hover:bg-secondary-700 text-white shadow-lg',
  accent: 'bg-crimson hover:bg-crimson-700 text-white shadow-lg',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'bg-transparent hover:bg-primary/10 text-primary',
  link: 'bg-transparent underline text-primary hover:text-foreground-strong',
  destructive: 'bg-crimson-600 hover:bg-crimson-700 text-white shadow-sm',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className = '',
  disabled = false,
  fullWidth = false,
  type = 'button',
  ariaLabel,
  loading = false,
}: ButtonProps) {
  const baseStyles = 'touch-target font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50';
  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`;

  const ButtonContent = () => (
    <motion.span
      {...(!disabled ? v.button : {})}
      className="block"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          {/* spinner: respect user preference for reduced motion using tailwind's motion-reduce utilities */}
          <svg
            aria-hidden="true"
            role="img"
            focusable="false"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="animate-spin motion-reduce:animate-none"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25"></circle>
            <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" fill="none"></path>
          </svg>
          <span className="sr-only">Loading</span>
        </span>
      ) : (
        children
      )}
    </motion.span>
  );

  if (href) {
    // If disabled, render a non-interactive element that communicates disabled state
    if (disabled) {
      return (
        <a
          aria-disabled="true"
          tabIndex={-1}
          className={`${combinedStyles} pointer-events-none`}
        >
          <ButtonContent />
        </a>
      );
    }

    return (
      <a href={href} className={combinedStyles} aria-label={ariaLabel}>
        <ButtonContent />
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading ? 'true' : undefined}
      className={combinedStyles}
    >
      <ButtonContent />
    </button>
  );
}
