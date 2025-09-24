"use client";

import { useState, useEffect, useRef } from 'react';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { v } from '@/components/variants';
import { navMotion } from '@/lib/motion/variants';
import { useParsedData } from '@/hooks/useParsedData';
import { useContent } from '@/hooks/useContent';
import { NavDataSchema, NavDataParsed } from '@/lib/schemas';
import { sanitizeHref, createHrefKey, isValidHref, logHrefIssue } from '@/utils/href';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const { data, loading, error } = useParsedData<NavDataParsed>('nav.json', NavDataSchema);
  const { data: content } = useContent();
  const prefersReduced = useReducedMotion();
  
  // Force fixed positioning - this ensures navbar stays at top
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    // Immediately apply fixed positioning
    const navbar = navbarRef.current;
    if (navbar) {
      navbar.style.position = 'fixed';
      navbar.style.top = '0';
      navbar.style.left = '0';
      navbar.style.right = '0';
      navbar.style.zIndex = '50';
      navbar.style.width = '100%';
      navbar.style.transform = 'translateZ(0)';
      navbar.style.willChange = 'transform';
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = data?.links || content?.global?.navigation?.header?.links || [];
  const uiLabels = content?.global?.ui?.labels;
  const ariaLabels = content?.global?.accessibility?.ariaLabels;
  const contactLabel = content?.global?.ui?.buttons?.contact || 'Contact';
  
  // Filter out Home and Contact links since logo functions as home and we have Contact CTA button
  const filteredLinks = navLinks.filter((link: any) => {
    if (!isValidHref(link.href)) {
      logHrefIssue('Invalid href detected in navbar link', link.href, 'Navbar.filteredLinks');
      return false;
    }

    const safeHref = sanitizeHref(link.href);
    return safeHref !== '/' && safeHref !== '/contact';
  });

  const baseDesktopClasses = 'transition-colors duration-300 focus-visible:outline-none';
  const baseMobileClasses = baseDesktopClasses;

  return (
    <nav 
      ref={navbarRef}
      className={`bg-neutral-50 shadow-md transition-all duration-300 ${
        isScrolled ? 'shadow-lg bg-opacity-95 backdrop-blur-md' : 'shadow-md bg-opacity-100'
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        width: '100%',
        transform: 'translateZ(0)', // Hardware acceleration
        willChange: 'transform'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/brand/OldCrownLogo.png"
                alt={content?.global?.accessibility?.altTexts?.logo || "Old Crown Girton Logo"}
                width={60}
                height={45}
                className="h-8 w-auto"
                priority
              />
              <span className="text-xl font-semibold text-brand-800">OLD CROWN</span>
            </Link>
          </div>

          {/* Desktop Navigation - Center-Right */}
          <div className="hidden md:flex items-center space-x-8">
            {error && <span className="text-xs text-error-500">{uiLabels?.error || 'Nav failed'}</span>}
            {filteredLinks.map((link: any, index: number) => {
              const sanitizedHref = sanitizeHref(link.href);
              const isChristmasLink = sanitizedHref === '/christmas-menu';
              const desktopClassName = isChristmasLink
                ? `group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-crimson-500 via-brand-600 to-cardamom-600 px-4 py-1.5 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:shadow-xl hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700 ${baseDesktopClasses}`
                : `text-brand-600 hover:text-brand-800 focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 ${baseDesktopClasses}`;

              return (
                <Link
                  key={createHrefKey(link.href, index)}
                  href={sanitizedHref}
                  className={desktopClassName}
                >
                  {isChristmasLink && (
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-lg"
                      aria-hidden="true"
                    >
                      🎄
                    </span>
                  )}
                  <span className={isChristmasLink ? 'relative' : undefined}>
                    {link.label}
                    {isChristmasLink && (
                      <span
                        className="pointer-events-none absolute inset-x-0 -bottom-1 h-px bg-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Contact Button - Right */}
          <div className="hidden md:flex">
            <Link
              href="/contact"
              className="px-5 py-2 text-center text-neutral-50 bg-brand-700 rounded-lg hover:bg-brand-800 transition-colors duration-300"
            >
              {contactLabel}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-700 focus:outline-none p-2"
            >
              <span className="sr-only">{ariaLabels?.openMenu || 'Open main menu'}</span>
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
          <>
            {/* Scrim */}
            <motion.div {...(prefersReduced ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } } : navMotion.mobileDrawer.backdrop)} className="fixed inset-0 bg-black/20 md:hidden" onClick={() => setIsOpen(false)} />
            <motion.div {...(prefersReduced ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } } : navMotion.mobileDrawer.panel)} className="md:hidden bg-neutral-50 border-b border-neutral-200 relative z-50">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {error && <div className="px-3 py-2 text-xs text-error-500">{uiLabels?.error || 'Nav failed'}</div>}
                <div className="flex flex-col space-y-4">
                  {filteredLinks.map((link: any, index: number) => {
                    const sanitizedHref = sanitizeHref(link.href);
                    const isChristmasLink = sanitizedHref === '/christmas-menu';
                    const mobileClassName = isChristmasLink
                      ? `group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-crimson-500 via-brand-600 to-cardamom-600 px-4 py-2 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700 ${baseMobileClasses}`
                      : `text-brand-600 hover:text-brand-800 py-2 px-3 focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 ${baseMobileClasses}`;

                    return (
                      <Link
                        key={createHrefKey(link.href, index)}
                        href={sanitizedHref}
                        className={mobileClassName}
                        onClick={() => setIsOpen(false)}
                      >
                        {isChristmasLink && (
                          <span
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-lg"
                            aria-hidden="true"
                          >
                            🎄
                          </span>
                        )}
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                  <Link
                    href="/contact"
                    className="w-full px-5 py-2 text-center text-neutral-50 bg-brand-700 rounded-lg hover:bg-brand-800 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {contactLabel}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
