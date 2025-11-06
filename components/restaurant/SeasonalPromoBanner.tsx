'use client';

import Link from '@/lib/debugLink';

export default function SeasonalPromoBanner() {
  return (
    <div
      className="border-b border-brand-100 bg-brand-50/90 backdrop-blur"
      data-seasonal-banner
    >
      <Link
        href="/christmas-menu"
        className="alert mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-3 rounded-none border-none bg-transparent px-4 py-2.5 text-center text-sm text-brand-900 shadow-none transition hover:bg-brand-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-50 md:flex-row md:gap-4 md:px-6 md:py-3 md:text-base min-h-0"
        aria-label="Explore the Christmas menu and reserve your festive table"
      >
        <span className="flex flex-wrap items-center justify-center gap-2 text-center text-brand-900">
          <span className="badge border border-brand-200 bg-brand-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Christmas 2025
          </span>
          <span aria-hidden="true" className="text-lg leading-none">
            🎄
          </span>
          <span className="font-medium">Festive tasting menus, mulled tipples, and seasonal cheer await.</span>
        </span>

        <span className="flex items-center justify-center gap-2 text-center font-semibold text-brand-800">
          <span className="underline decoration-brand-300 underline-offset-4">
            View the Christmas menu & book your table
          </span>
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            className="text-brand-700"
          >
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </span>
      </Link>
    </div>
  );
}
