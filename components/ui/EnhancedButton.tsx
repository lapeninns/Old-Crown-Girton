import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  children,
  disabled,
  onClick,
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
  primary: 'bg-accent hover:bg-accent-700 text-white focus:ring-accent shadow-md hover:shadow-lg',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-brand-900 focus:ring-gray-500',
  outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white focus:ring-accent',
  ghost: 'text-accent hover:bg-accent/10 focus:ring-accent'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5'
  };
  
  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`touch-target ${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
    >
      {isLoading ? (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSize[size]}`} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={iconSize[size]} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className={iconSize[size]} />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
