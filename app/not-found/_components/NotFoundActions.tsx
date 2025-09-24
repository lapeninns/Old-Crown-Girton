'use client';

import Link from '@/lib/debugLink';
import { useNotFoundContent } from '../_content/useNotFoundContent';

export default function NotFoundActions() {
  const content = useNotFoundContent();
  
  if (!content) {
    return (
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="animate-pulse flex gap-4">
          <div className="h-8 w-20 bg-neutral-200 rounded"></div>
          <div className="h-8 w-20 bg-neutral-200 rounded"></div>
          <div className="h-8 w-20 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Link href="/" className="btn btn-primary btn-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 mr-2"
        >
          <path
            fillRule="evenodd"
            d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
            clipRule="evenodd"
          />
        </svg>
        {content.ui.buttons.home}
      </Link>

  <Link href="/menu#starters" className="btn btn-secondary btn-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 mr-2"
        >
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
        {content.ui.buttons.menu}
  </Link>
    </div>
  );
}
