'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/hooks/useContent';
import { accessibility } from '@/lib/motion/accessibility';
import { variants } from '@/lib/motion/variants';
import BookingForm from './BookingForm';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { data: content } = useContent();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Get form labels and messages from content management
  const formLabels = content?.forms?.labels;
  const formMessages = content?.forms?.messages;
  const uiLabels = content?.global?.ui?.labels;
  const buttons = content?.global?.ui?.buttons;

  useEffect(() => {
    const el = containerRef.current as HTMLDivElement | null;
    if (isOpen && el) {
      accessibility.focusManagement.trapFocus(el);
    }
    return () => {
      if (el) accessibility.focusManagement.restoreFocus(el);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Booking modal"
          data-testid="booking-modal"
          ref={containerRef}
        >
          {/* Backdrop */}
          <motion.div
            variants={variants.fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-stout-900/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={variants.scaleIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative bg-neutral-50 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <h2 id="booking-modal-title" className="text-2xl font-display font-bold text-brand-800">
                  {buttons?.bookOnline || 'Book a Table'}
                </h2>
                <button
                  onClick={onClose}
                  className="touch-target text-neutral-500 hover:text-brand-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-brand-600 mt-2">
                Reserve your table at Old Crown. We&apos;ll call you within 1 hour to confirm.
              </p>
            </div>

            {/* Form */}
            <BookingForm
              onSuccess={onClose}
              formLabels={formLabels}
              formMessages={formMessages}
              uiLabels={uiLabels}
              buttons={buttons}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
