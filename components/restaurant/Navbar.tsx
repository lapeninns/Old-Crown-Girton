"use client";

import { useLayoutEffect, useRef, useState } from 'react';
import { ContactCTA, NavLinks, NavbarLogo, useNavContent } from './NavbarParts';
import SeasonalPromoBanner from './SeasonalPromoBanner';

const MOBILE_NAV_ID = 'mobile-nav';
const SEASONAL_BANNER_SELECTOR = '[data-seasonal-banner]';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
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

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const element = navRef.current;
    if (!element) return undefined;

    const updateOffsets = () => {
      const navRect = element.getBoundingClientRect();
      const bannerEl = element.querySelector(SEASONAL_BANNER_SELECTOR) as HTMLElement | null;
      const bannerHeight = bannerEl ? bannerEl.getBoundingClientRect().height : 0;
      const baseHeight = Math.max(navRect.height - bannerHeight, 0);

      document.documentElement.style.setProperty('--navbar-offset', `${baseHeight}px`);
      document.documentElement.style.setProperty('--navbar-stack-offset', `${navRect.height}px`);
    };

    const rafUpdate = () => window.requestAnimationFrame(updateOffsets);

    updateOffsets();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            rafUpdate();
          })
        : null;

    if (resizeObserver) {
      resizeObserver.observe(element);
      const bannerEl = element.querySelector(SEASONAL_BANNER_SELECTOR) as HTMLElement | null;
      if (bannerEl) {
        resizeObserver.observe(bannerEl);
      }
    }

    window.addEventListener('resize', rafUpdate);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', rafUpdate);
      document.documentElement.style.removeProperty('--navbar-offset');
      document.documentElement.style.removeProperty('--navbar-stack-offset');
    };
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label={navLabel}
      className="fixed inset-x-0 top-0 z-50 border-b bg-white shadow-sm"
    >
      <SeasonalPromoBanner />
      <div className="mx-auto w-full max-w-7xl px-4 py-2 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <NavbarLogo altText={logoAlt} />

          <div className="hidden flex-1 md:flex md:justify-center">
            <NavLinks
              links={links}
              error={error}
              errorLabel={errorLabel}
              orientation="horizontal"
            />
          </div>

          <div className="hidden md:flex md:flex-none">
            <ContactCTA label={contactLabel} />
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="btn btn-ghost btn-square"
              aria-expanded={isMenuOpen}
              aria-controls={MOBILE_NAV_ID}
              aria-haspopup="menu"
            >
              <span className="sr-only">
                {isMenuOpen ? menuButtonCloseLabel : menuButtonOpenLabel}
              </span>
              {isMenuOpen ? (
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
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        id={MOBILE_NAV_ID}
        className={`md:hidden border-t border-base-200 bg-white ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-3 md:px-6">
          <NavLinks
            links={links}
            error={error}
            errorLabel={errorLabel}
            orientation="vertical"
            onNavigate={closeMenu}
          />
          <div className="mt-3">
            <ContactCTA
              label={contactLabel}
              onClick={closeMenu}
              fullWidth
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
