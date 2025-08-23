"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useParsedData } from '@/hooks/useParsedData';
import { NavDataSchema, NavDataParsed } from '@/lib/schemas';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, loading, error } = useParsedData<NavDataParsed>('nav.json', NavDataSchema);
  const navLinks = data?.links || [];
  
  // Filter out Home and Contact links since logo functions as home and we have Contact CTA button
  const filteredLinks = navLinks.filter(link => link.href !== '/' && link.href !== '/contact');

  return (
    <nav className="bg-neutral-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logos/OldCrownLogo.png"
                alt="Old Crown Girton Logo"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
              <span className="text-xl font-semibold text-brand-800">OLD CROWN</span>
            </Link>
          </div>

          {/* Desktop Navigation - Center-Right */}
          <div className="hidden md:flex items-center space-x-8">
            {loading && <span className="text-xs text-gray-600 animate-pulse">Loading...</span>}
            {error && <span className="text-xs text-red-500">Nav failed</span>}
            {filteredLinks.map((link: NavDataParsed['links'][number]) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-brand-600 hover:text-brand-800 transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact Button - Right */}
          <div className="hidden md:flex">
            <Link
              href="/contact"
              className="px-5 py-2 text-center text-neutral-50 bg-brand-700 rounded-lg hover:bg-brand-800 transition-colors duration-300"
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-700 focus:outline-none p-2"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="md:hidden bg-neutral-50 border-b border-neutral-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {loading && <div className="px-3 py-2 text-xs text-gray-600">Loading...</div>}
              {error && <div className="px-3 py-2 text-xs text-red-500">Nav failed</div>}
              <div className="flex flex-col space-y-4">
                {filteredLinks.map((link: NavDataParsed['links'][number]) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-brand-600 hover:text-brand-800 py-2 px-3"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="w-full px-5 py-2 text-center text-neutral-50 bg-brand-700 rounded-lg hover:bg-brand-800 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
