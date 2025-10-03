'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/hooks/useContent';
import Button from './Button';
import { accessibility } from '@/lib/motion/accessibility';
import { variants } from '@/lib/motion/variants';

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
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, this will just show an alert
    // In production, integrate with booking system
    const successMessage = formMessages?.success || 'Thank you! We will call you within 1 hour to confirm your booking.';
    alert(successMessage);
    onClose();
  };

  useEffect(() => {
    const el = containerRef.current as HTMLDivElement | null;
    if (isOpen && el) {
      accessibility.focusManagement.trapFocus(el);
    }
    return () => {
      if (el) accessibility.focusManagement.restoreFocus(el);
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brand-700 mb-1">
                    {formLabels?.name || 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-colors"
                    placeholder={formLabels?.name || 'Your name'}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-brand-700 mb-1">
                    {formLabels?.phone || 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-colors"
                    placeholder="+44 1223 277217"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-700 mb-1">
                  {formLabels?.email || 'Email Address'}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-colors"
                  placeholder={formLabels?.email || 'your@email.com'}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-brand-700 mb-1">
                    {formLabels?.date || 'Date'} *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-brand-700 mb-1">
                    {formLabels?.time || 'Time'} *
                  </label>
                  <select
                    id="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                  >
                    <option value="">{uiLabels?.selectTime || 'Select time'}</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="13:30">1:30 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="20:30">8:30 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-brand-700 mb-1">
                    {formLabels?.partySize || 'Guests'} *
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    required
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? (uiLabels?.guest || 'guest') : (uiLabels?.guests || 'guests')}</option>
                    ))}
                    <option value="10+">{uiLabels?.guestsPlus || '10+ guests'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brand-700 mb-1">
                  {formLabels?.specialRequests || 'Special Requests'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-colors resize-none"
                  placeholder={uiLabels?.specialRequestsPlaceholder || 'Dietary requirements, celebrations, etc.'}
                />
              </div>

              {/* Call Option */}
              <div className="bg-brand-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📞</span>
                  <span className="font-medium text-brand-800">{uiLabels?.preferToCall || 'Prefer to call?'}</span>
                </div>
                <p className="text-sm text-brand-600 mb-2">
                  {uiLabels?.callDirectly || 'Call us directly for immediate booking confirmation'}
                </p>
                <a
                  href="tel:01223 277217"
                  className="text-accent font-semibold hover:underline"
                  aria-label="Open booking dialog"
                >
                  01223277217
                </a>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {}}
                >
                  {buttons?.submit || 'Request Booking'}
                </Button>
                <p className="text-xs text-neutral-500 mt-2 text-center">
                  * {uiLabels?.requiredFields || 'Required fields'}. {uiLabels?.confirmationMessage || "We'll call you within 1 hour to confirm availability."}.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
