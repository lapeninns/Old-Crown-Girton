"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useParsedData } from '@/hooks/useParsedData';
import { NavDataSchema, NavDataParsed, MarketingDataSchema, MarketingDataParsed } from '@/lib/schemas';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, loading, error } = useParsedData<NavDataParsed>('nav.json', NavDataSchema);
  const { data: marketing } = useParsedData<MarketingDataParsed>('marketing.json', MarketingDataSchema);
  const navLinks = data?.links || [];
  const callLabel = marketing?.buttons?.callUs || 'Call Us';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-display font-bold text-accent">
                Old Crown
              </span>
              <span className="ml-2 text-sm text-stout-700 hidden sm:block">
                Girton
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {loading && <span className="text-xs text-gray-600 animate-pulse">Loading...</span>}
              {error && <span className="text-xs text-red-500">Nav failed</span>}
              {navLinks.map((link: NavDataParsed['links'][number]) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="touch-target text-stout-700 hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="tel:01223276027"
              className="touch-target bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-700 transition-colors duration-200"
              aria-label={`Call ${callLabel}`}
            >
              📞 {callLabel}
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="touch-target inline-flex items-center justify-center p-2 rounded-md text-stout-700 hover:text-accent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {loading && <div className="px-3 py-2 text-xs text-gray-600">Loading...</div>}
              {error && <div className="px-3 py-2 text-xs text-red-500">Nav failed</div>}
              {navLinks.map((link: NavDataParsed['links'][number]) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="touch-target text-stout-700 hover:text-accent block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="px-3">
                  <a
                    href="tel:01223276027"
                    className="touch-target block bg-accent text-white px-4 py-3 rounded-lg font-medium hover:bg-accent-700 transition-colors duration-200 text-center"
                  >
                    📞 {callLabel}: 01223 276027
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
