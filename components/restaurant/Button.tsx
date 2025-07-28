'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: 'bg-primary hover:bg-crown-gold-dark text-white shadow-lg',
  secondary: 'bg-crown-slate hover:bg-crown-slate-dark text-white shadow-lg',
  accent: 'bg-crown-red hover:bg-crown-red-dark text-white shadow-lg',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
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
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50';
  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`;

  const ButtonContent = () => (
    <motion.span
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className="block"
    >
      {children}
    </motion.span>
  );

  if (href && !disabled) {
    return (
      <a href={href} className={combinedStyles}>
        <ButtonContent />
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles}
    >
      <ButtonContent />
    </button>
  );
}
