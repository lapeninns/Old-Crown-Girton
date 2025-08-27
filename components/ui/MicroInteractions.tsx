// Micro-interactions and smooth animations for enhanced UX
'use client';

import { useState, useEffect, memo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Button with micro-interactions
interface AnimatedButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  success?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const AnimatedButton = memo<AnimatedButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  success = false,
  children,
  className = '',
  disabled,
  onClick,
  type = 'button'
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = 'relative font-medium rounded-full transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden';
  
  const variants = {
    primary: 'bg-accent hover:bg-accent-700 text-white focus:ring-accent/50 disabled:bg-neutral-400',
    secondary: 'bg-stout-700 hover:bg-stout-800 text-white focus:ring-stout-700/50 disabled:bg-neutral-400',
    ghost: 'bg-transparent hover:bg-neutral-100 text-stout-700 focus:ring-gray-200 disabled:text-neutral-400',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white focus:ring-accent/50 disabled:border-neutral-300 disabled:text-neutral-400'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={isPressed ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Content */}
      <div className="relative flex items-center justify-center space-x-2">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-2"
            >
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Loading...</span>
            </motion.div>
          ) : success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Success!</span>
            </motion.div>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

// Card with hover animations
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  clickScale?: number;
  onClick?: () => void;
}

const AnimatedCard = memo<AnimatedCardProps>(({
  children,
  className = '',
  hoverScale = 1.02,
  clickScale = 0.98,
  onClick
}) => {
  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: clickScale }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
});

AnimatedCard.displayName = 'AnimatedCard';

// Input with focus animations
interface AnimatedInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

const AnimatedInput = memo<AnimatedInputProps>(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <motion.label
        className={`absolute left-3 transition-all duration-200 pointer-events-none ${
          isFocused || hasValue
  ? 'text-sm text-accent -top-2 bg-white px-2'
            : 'text-neutral-500 top-3'
        }`}
        animate={{
          scale: isFocused || hasValue ? 0.9 : 1,
          y: isFocused || hasValue ? -10 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
      
      <motion.input
        type={type}
        placeholder={isFocused ? placeholder : ''}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-3 py-3 border rounded-lg transition-all duration-200
          focus:ring-2 focus:ring-accent/50 focus:border-accent
          ${error ? 'border-crimson-500' : 'border-neutral-300'}
        `}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      />
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-error-500 mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

AnimatedInput.displayName = 'AnimatedInput';

// Loading dots animation
const LoadingDots = memo(() => {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-accent rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );
});

LoadingDots.displayName = 'LoadingDots';

// Notification toast with animations
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

const Toast = memo<ToastProps>(({ message, type, isVisible, onClose }) => {
  const variants = {
    success: 'bg-cardamom-500 text-white',
    error: 'bg-crimson-500 text-white',
    warning: 'bg-accent-500 text-black',
    info: 'bg-secondary-500 text-white'
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`
            fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg
            flex items-center space-x-3 max-w-md
            ${variants[type]}
          `}
        >
          <span className="flex-1">{message}</span>
          <button
            onClick={onClose}
            className="text-current hover:opacity-70 transition-opacity"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Toast.displayName = 'Toast';

// Counter animation
interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
}

const AnimatedCounter = memo<AnimatedCounterProps>(({
  from,
  to,
  duration = 1,
  className = ''
}) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const increment = (to - from) / (duration * 60); // 60fps
    let current = from;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= to) || (increment < 0 && current <= to)) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [from, to, duration]);

  return <span className={className}>{count}</span>;
});

AnimatedCounter.displayName = 'AnimatedCounter';

export {
  AnimatedButton,
  AnimatedCard,
  AnimatedInput,
  LoadingDots,
  Toast,
  AnimatedCounter
};
