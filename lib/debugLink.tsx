"use client";

import Link from 'next/link';
import { useMemo } from 'react';

// Minimal UrlObject shape we care about (avoid importing Node 'url' types into client bundle)
type UrlLike = { pathname: string; query?: Record<string, any>; hash?: string } | string;

interface DebugLinkProps {
  href: UrlLike | any; // any to surface unexpected shapes during development
  children: React.ReactNode;
  [key: string]: any; // pass-through props
}

/**
 * DebugLink: development helper around next/link that prevents accidental
 * coercion of valid Link UrlObjects into the literal string "[object Object]".
 *
 * Root cause of the 404s like GET /[object%20Object]: a previous implementation
 * always executed String(href) which destroys the structured object form that
 * Next.js accepts and prefetches, yielding a broken path.
 *
 * This component now:
 *  - Passes through proper object hrefs untouched
 *  - Logs (once per different bad input) when an obviously malformed object is supplied
 *  - Guards against already-coerced "[object Object]" strings and falls back to '/'
 */
const seenBadInputs = new Set<string>();

export default function DebugLink({ href, children, ...props }: DebugLinkProps) {
  const normalizedHref: UrlLike = useMemo(() => {
    // If it's a string, validate it
    if (typeof href === 'string') {
      if (href.includes('[object Object]')) {
        if (!seenBadInputs.has(href)) {
          seenBadInputs.add(href);
          // eslint-disable-next-line no-console
          console.error('🚨 DebugLink: href string contains [object Object]; falling back to /', { href });
        }
        return '/';
      }
      return href;
    }

    // Accept object form if it has a pathname
    if (href && typeof href === 'object') {
      // Typical Next.js UrlObject shape
      if (typeof href.pathname === 'string') {
        return href as any; // keep structure for Next.js routing
      }

      // Legacy shapes we might try to salvage
      if (typeof href.href === 'string') {
        const candidate = href.href;
        if (candidate.includes('[object Object]')) {
          if (!seenBadInputs.has(candidate)) {
            seenBadInputs.add(candidate);
            // eslint-disable-next-line no-console
            console.error('🚨 DebugLink: object href.href already corrupted', { href });
          }
          return '/';
        }
        return candidate;
      }

      const signature = Object.keys(href).sort().join(',');
      if (!seenBadInputs.has(signature)) {
        seenBadInputs.add(signature);
        // eslint-disable-next-line no-console
        console.error('🚨 DebugLink: unsupported href object shape; coercing to /', { href });
      }
      return '/';
    }

    // Fallback for null/undefined
    if (!href) return '/';

    // Anything else (number, boolean, function) => log once and fallback
    const key = typeof href + ':' + (typeof href === 'object' ? JSON.stringify(href) : String(href));
    if (!seenBadInputs.has(key)) {
      seenBadInputs.add(key);
      // eslint-disable-next-line no-console
      console.error('🚨 DebugLink: unexpected href type; coercing to /', { href });
    }
    return '/';
  }, [href]);

  return (
    <Link href={normalizedHref as any} {...props}>
      {children}
    </Link>
  );
}