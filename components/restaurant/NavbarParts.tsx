"use client";

import { useMemo } from 'react';
import Image from 'next/image';
import Link from '@/lib/debugLink';
import { useParsedData } from '@/hooks/useParsedData';
import { useContent } from '@/hooks/useContent';
import { NavDataSchema, NavDataParsed } from '@/lib/schemas';
import { sanitizeHref, createHrefKey, isValidHref, logHrefIssue } from '@/utils/href';
import type { HrefType } from '@/utils/href';

export interface SanitizedNavLink {
  key: string;
  href: HrefType;
  label: string;
  isSeasonal: boolean;
}

interface NavContentResult {
  links: SanitizedNavLink[];
  error: Error | null;
  errorLabel: string;
  contactLabel: string;
  ariaLabels?: Record<string, string>;
  navLabel: string;
  menuButtonOpenLabel: string;
  menuButtonCloseLabel: string;
  logoAlt: string;
}

export function useNavContent(): NavContentResult {
  const { data, error } = useParsedData<NavDataParsed>('nav.json', NavDataSchema);
  const { data: content } = useContent();

  const navLinksRaw =
    data?.links ||
    content?.global?.navigation?.header?.links ||
    [];

  const sanitizedLinks = useMemo<SanitizedNavLink[]>(() => {
    return navLinksRaw.reduce<SanitizedNavLink[]>((acc, link, index) => {
      if (!isValidHref(link.href)) {
        logHrefIssue('Invalid href detected in navbar link', link.href, 'Navbar.useNavContent');
        return acc;
      }

      const sanitizedHref = sanitizeHref(link.href);
      if (sanitizedHref === '/' || sanitizedHref === '/contact') {
        return acc;
      }

      acc.push({
        key: createHrefKey(link.href, index),
        href: sanitizedHref,
        label: link.label,
        isSeasonal: sanitizedHref === '/christmas-menu',
      });
      return acc;
    }, []);
  }, [navLinksRaw]);

  const uiLabels = content?.global?.ui?.labels;
  const ariaLabels = content?.global?.accessibility?.ariaLabels;
  const contactLabel = content?.global?.ui?.buttons?.contact || 'Contact';
  const navLabel = ariaLabels?.mainNavigation || 'Main navigation';
  const menuButtonOpenLabel =
    ariaLabels?.menuButton ||
    ariaLabels?.openMenu ||
    'Open main menu';
  const menuButtonCloseLabel =
    ariaLabels?.closeMenu ||
    ariaLabels?.closeDialog ||
    'Close main menu';
  const logoAlt =
    content?.global?.accessibility?.altTexts?.logo ||
    'Old Crown Girton Logo';

  return {
    links: sanitizedLinks,
    error,
    errorLabel: uiLabels?.error || 'Nav failed',
    contactLabel,
    ariaLabels,
    navLabel,
    menuButtonOpenLabel,
    menuButtonCloseLabel,
    logoAlt,
  };
}

export function NavbarLogo({ altText }: { altText: string }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-lg px-1 py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50"
    >
      <Image
        src="/images/brand/OldCrownLogo.png"
        alt={altText}
        width={60}
        height={45}
        className="h-8 w-auto"
        priority
      />
      <span className="text-lg font-semibold tracking-tight text-brand-800">
        OLD CROWN
      </span>
    </Link>
  );
}

export function DesktopNavLinks({
  links,
  error,
  errorLabel,
}: {
  links: SanitizedNavLink[];
  error: Error | null;
  errorLabel: string;
}) {
  return (
    <div className="hidden items-center gap-3 md:flex">
      {error && (
        <span className="badge badge-error badge-sm font-semibold uppercase tracking-wide text-white">
          {errorLabel}
        </span>
      )}
      <ul className="menu menu-horizontal gap-1 px-0">
        {links.map((link) => (
          <li key={link.key}>
            <Link
              href={link.href}
              className={
                link.isSeasonal
                  ? 'group btn btn-sm min-h-0 gap-2 rounded-full border-none bg-gradient-to-r from-crimson-500 via-brand-600 to-cardamom-600 px-4 font-semibold text-white shadow-lg transition-transform duration-200 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700 motion-safe:hover:scale-[1.02]'
                  : 'btn btn-ghost btn-sm min-h-0 px-3 text-base font-medium text-brand-600 hover:bg-transparent hover:text-brand-800 focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50'
              }
            >
              {link.isSeasonal && (
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-lg"
                  aria-hidden="true"
                >
                  🎄
                </span>
              )}
              <span className={link.isSeasonal ? 'relative' : undefined}>
                {link.label}
                {link.isSeasonal && (
                  <span
                    className="pointer-events-none absolute inset-x-0 -bottom-1 h-px bg-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContactCTA({
  label,
  variant,
  onClick,
}: {
  label: string;
  variant: 'desktop' | 'mobile';
  onClick?: () => void;
}) {
  const baseClasses =
    'btn btn-primary border-none bg-brand-700 text-neutral-50 hover:bg-brand-800 focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50';

  if (variant === 'mobile') {
    return (
      <Link
        href="/contact"
        onClick={onClick}
        className={`${baseClasses} btn-block`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link href="/contact" onClick={onClick} className={`${baseClasses} px-6`}>
      {label}
    </Link>
  );
}

export function MobileNavLinks({
  links,
  error,
  errorLabel,
  contactLabel,
  onNavigate,
}: {
  links: SanitizedNavLink[];
  error: Error | null;
  errorLabel: string;
  contactLabel: string;
  onNavigate: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {error && (
        <span className="badge badge-error badge-sm w-fit">
          {errorLabel}
        </span>
      )}
      <ul className="menu menu-vertical gap-2">
        {links.map((link) => (
          <li key={link.key}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className={
                link.isSeasonal
                  ? 'btn btn-sm w-full gap-2 rounded-full border-none bg-gradient-to-r from-crimson-500 via-brand-600 to-cardamom-600 px-4 font-semibold text-white shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700'
                  : 'btn btn-ghost justify-start text-base font-medium text-brand-600 hover:bg-brand-50 hover:text-brand-800 focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50'
              }
            >
              {link.isSeasonal && (
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-lg"
                  aria-hidden="true"
                >
                  🎄
                </span>
              )}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <ContactCTA label={contactLabel} variant="mobile" onClick={onNavigate} />
    </div>
  );
}
