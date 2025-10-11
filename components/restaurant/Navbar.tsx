"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ContactCTA,
  DesktopNavLinks,
  MobileNavLinks,
  NavbarLogo,
  useNavContent,
} from './NavbarParts';

const BACKDROP_ANIMATION = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
} as const;

const PANEL_ANIMATION = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } },
} as const;

const DEFAULT_THEME_COLOR = '#f9fafb';
const MENU_THEME_COLOR = '#f9fafb';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const themeColorCache = useRef<Map<HTMLMetaElement, string>>(new Map());
  const {
    links,
    error,
    errorLabel,
    contactLabel,
    navLabel,
    menuButtonOpenLabel,
    menuButtonCloseLabel,
    logoAlt,
  } = useNavContent();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const metas = Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'));
    if (metas.length === 0) return;

    if (themeColorCache.current.size === 0) {
      metas.forEach((meta) => {
        themeColorCache.current.set(meta, meta.getAttribute('content') || DEFAULT_THEME_COLOR);
      });
    }

    metas.forEach((meta) => {
      const fallback = themeColorCache.current.get(meta) ?? DEFAULT_THEME_COLOR;
      meta.setAttribute('content', isOpen ? MENU_THEME_COLOR : fallback);
    });
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;
      const metas = Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'));
      metas.forEach((meta) => {
        const fallback = themeColorCache.current.get(meta);
        if (fallback) {
          meta.setAttribute('content', fallback);
        }
      });
    };
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const backdropMotion = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      };
    }
    return BACKDROP_ANIMATION;
  }, [prefersReducedMotion]);

  const panelMotion = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 1, y: 0 },
      };
    }
    return PANEL_ANIMATION;
  }, [prefersReducedMotion]);

  const navClasses = `fixed inset-x-0 top-0 z-50 border-b border-neutral-200 transform-gpu will-change-transform transition-all duration-300 ${
    isScrolled
      ? 'bg-neutral-50/95 shadow-lg shadow-brand-900/10 backdrop-blur-lg'
      : 'bg-neutral-50 shadow-sm'
  }`;

  return (
    <nav aria-label={navLabel} className={navClasses}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="navbar px-0">
          <div className="navbar-start gap-2">
            <NavbarLogo altText={logoAlt} />
          </div>

          <div className="navbar-center">
            <DesktopNavLinks links={links} error={error} errorLabel={errorLabel} />
          </div>

          <div className="navbar-end hidden md:flex">
            <ContactCTA label={contactLabel} variant="desktop" />
          </div>

          <div className="navbar-end md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="btn btn-ghost btn-square btn-sm min-h-0 p-2 text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50"
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-haspopup="menu"
            >
              <span className="sr-only">
                {isOpen ? menuButtonCloseLabel : menuButtonOpenLabel}
              </span>
              {!isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-neutral-50/80 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
              aria-label={menuButtonCloseLabel}
              initial={backdropMotion.initial}
              animate={backdropMotion.animate}
              exit={backdropMotion.exit}
            />
            <motion.div
              className="md:hidden"
              initial={panelMotion.initial}
              animate={panelMotion.animate}
              exit={panelMotion.exit}
            >
              <div
                className="relative z-50 bg-neutral-50/95 shadow-xl shadow-brand-900/10"
                style={{ paddingTop: 'env(safe-area-inset-top)' }}
              >
                <div className="mx-auto max-w-7xl px-4 pb-6 pt-4 sm:px-6 lg:px-8">
                  <div
                    id="mobile-nav"
                    role="dialog"
                    aria-modal="true"
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                  >
                    <MobileNavLinks
                      links={links}
                      error={error}
                      errorLabel={errorLabel}
                      contactLabel={contactLabel}
                      onNavigate={closeMenu}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
