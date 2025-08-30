import React, { useEffect, useRef } from 'react';
import { MotionConfig, useReducedMotion as fmUseReducedMotion, type MotionProps } from 'framer-motion';

export interface AccessibilityConfig {
  useReducedMotion(): boolean;
  MotionConfigProvider: React.ComponentType<{ children: React.ReactNode; reducedMotion?: 'always' | 'never' | 'user' }>;
  resolveVariants(variants: MotionProps, reducedMotion: boolean): MotionProps;
  focusManagement: {
    trapFocus: (container: HTMLElement) => void;
    restoreFocus: (element: HTMLElement) => void;
    announceChange: (message: string) => void;
  };
}

export const useReducedMotion = fmUseReducedMotion;

export const MotionConfigProvider: AccessibilityConfig['MotionConfigProvider'] = ({ children, reducedMotion = 'user' }) => {
  // Framer's MotionConfig reducedMotion honors user preference when set to 'user'
  return (
    <MotionConfig reducedMotion={reducedMotion}>
      {children}
    </MotionConfig>
  );
};

export function resolveVariants(variants: MotionProps, reducedMotion: boolean): MotionProps {
  if (reducedMotion) {
    return {
      ...variants,
      transition: { duration: 0 },
      // Avoid heavy transforms when reduced motion is requested
      transform: undefined,
      scale: undefined,
      x: undefined,
      y: undefined,
    } as MotionProps;
  }
  return variants;
}

// Simple focus trap and restoration utilities
let lastFocusedElement: HTMLElement | null = null;

function trapFocus(container: HTMLElement) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input[type="text"]:not([disabled])',
    'input[type="radio"]:not([disabled])',
    'input[type="checkbox"]:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  const getFocusable = () => Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors.join(',')));

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const items = getFocusable();
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (active === first || active === container) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  lastFocusedElement = (document.activeElement as HTMLElement) || null;
  container.addEventListener('keydown', handleKeyDown);
  // Focus the first element when trapping begins
  setTimeout(() => {
    const first = getFocusable()[0];
    (first || container).focus();
  }, 0);

  // Store the handler on the element so we can remove it later
  (container as any).__trapHandler = handleKeyDown;
}

function restoreFocus(element: HTMLElement) {
  try {
    const handler = (element as any).__trapHandler as (e: KeyboardEvent) => void;
    if (handler) element.removeEventListener('keydown', handler);
  } catch {}
  const target = lastFocusedElement || element;
  try { target?.focus(); } catch {}
  lastFocusedElement = null;
}

function announceChange(message: string) {
  if (typeof document === 'undefined') return;
  let live = document.getElementById('sr-live-region') as HTMLElement | null;
  if (!live) {
    live = document.createElement('div');
    live.id = 'sr-live-region';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('aria-atomic', 'true');
    live.style.position = 'fixed';
    live.style.width = '1px';
    live.style.height = '1px';
    live.style.margin = '-1px';
    live.style.border = '0';
    live.style.padding = '0';
    live.style.overflow = 'hidden';
    live.style.clip = 'rect(0 0 0 0)';
    document.body.appendChild(live);
  }
  live.textContent = '';
  // slight delay to ensure SR announces updates
  setTimeout(() => { if (live) live!.textContent = message; }, 50);
}

export const accessibility: AccessibilityConfig = {
  useReducedMotion,
  MotionConfigProvider,
  resolveVariants,
  focusManagement: { trapFocus, restoreFocus, announceChange },
};

export default accessibility;
