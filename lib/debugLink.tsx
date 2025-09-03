"use client";

import Link from 'next/link';
import { useEffect } from 'react';

interface DebugLinkProps {
  href: string | any;
  children: React.ReactNode;
  [key: string]: any;
}

export default function DebugLink({ href, children, ...props }: DebugLinkProps) {
  useEffect(() => {
    // Enhanced debugging for object href detection
    if (typeof href === 'object' && href !== null) {
      console.error('🚨 OBJECT HREF DETECTED in DebugLink:', {
        href,
        hrefType: typeof href,
        hrefString: String(href),
        componentStack: new Error().stack?.split('\n').slice(0, 5).join('\n'),
        props: Object.keys(props)
      });

      // Try to extract a meaningful string from the object
      let extractedHref = '#';
      if (href && href.pathname) {
        extractedHref = href.pathname;
        if (href.search) extractedHref += href.search;
        if (href.hash) extractedHref += href.hash;
      } else if (href && href.href) {
        extractedHref = href.href;
      } else {
        extractedHref = String(href);
      }

      // Override the href with the extracted string
      href = extractedHref;
    }

    // Additional validation for malformed hrefs
    if (typeof href === 'string') {
      if (href.includes('[object Object]')) {
        console.error('🚨 [object Object] STRING DETECTED in DebugLink:', {
          originalHref: href,
          componentStack: new Error().stack?.split('\n').slice(0, 5).join('\n')
        });
        href = '/'; // Fallback to home page
      }
    }
  }, [href]);

  return (
    <Link href={String(href)} {...props}>
      {children}
    </Link>
  );
}