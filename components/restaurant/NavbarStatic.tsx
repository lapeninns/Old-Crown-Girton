"use client";

import { useState, useEffect, useRef } from 'react';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import { useParsedData } from '@/hooks/useParsedData';
import { useContent } from '@/hooks/useContent';
import { NavDataSchema, NavDataParsed } from '@/lib/schemas';

export default function NavbarStatic() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const { data, loading, error } = useParsedData<NavDataParsed>('nav.json', NavDataSchema);
  const { data: content } = useContent();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    const navbar = navbarRef.current;
    if (navbar) {
      navbar.style.position = 'fixed';
      navbar.style.top = '0';
      navbar.style.left = '0';
      navbar.style.right = '0';
      navbar.style.zIndex = '50';
      navbar.style.width = '100%';
      // Remove will-change and transforms to avoid motion hints
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = data?.links || content?.global?.navigation?.header?.links || [];
  const uiLabels = content?.global?.ui?.labels;
  const ariaLabels = content?.global?.accessibility?.ariaLabels;
  const contactLabel = content?.global?.ui?.buttons?.contact || 'Contact';

  const filteredLinks = navLinks.filter((link: any) => {
    const href = String(link.href);
    if (typeof link.href === 'object') {
      console.error('Object href detected in navbar static:', link.href, link);
    }
    return href !== '/' && href !== '/contact';
  });

  return (
    <nav
      ref={navbarRef}
      className={`bg-neutral-50 ${isScrolled ? 'shadow-lg bg-opacity-95 backdrop-blur-md' : 'shadow-md bg-opacity-100'}`}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, width: '100%' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/brand/OldCrownLogo.png"
                alt={content?.global?.accessibility?.altTexts?.logo || 'Old Crown Girton Logo'}
                width={60}
                height={45}
                className="h-8 w-auto"
                priority
              />
              <span className="text-xl font-semibold text-brand-800">OLD CROWN</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {loading && <span className="text-xs text-brand-600">{uiLabels?.loading || 'Loading...'}</span>}
            {error && <span className="text-xs text-error-500">{uiLabels?.error || 'Nav failed'}</span>}
            {filteredLinks.map((link: any) => (
              <Link key={String(link.href)} href={String(link.href)} className="text-brand-600 hover:text-brand-800">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex">
            <Link href="/contact" className="px-5 py-2 text-center text-neutral-50 bg-brand-700 rounded-lg hover:bg-brand-800">
              {contactLabel}
            </Link>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-brand-700 focus:outline-none p-2" 
              aria-expanded={isOpen}
              aria-controls="nav-mobile-menu"
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

      {isOpen && (
        <div className="md:hidden bg-neutral-50 border-b border-neutral-200 relative z-50" id="nav-mobile-menu" role="dialog" aria-modal="true">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {loading && <div className="px-3 py-2 text-xs text-brand-600">{uiLabels?.loading || 'Loading...'}</div>}
            {error && <div className="px-3 py-2 text-xs text-error-500">{uiLabels?.error || 'Nav failed'}</div>}
            <div className="flex flex-col space-y-4">
              {filteredLinks.map((link: any) => (
                <Link
                  key={String(link.href)}
                  href={String(link.href)}
                  className="text-brand-600 hover:text-brand-800 py-2 px-3"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="w-full px-5 py-2 text-center text-neutral-50 bg-brand-700 rounded-lg hover:bg-brand-800"
                onClick={() => setIsOpen(false)}
              >
                {contactLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
