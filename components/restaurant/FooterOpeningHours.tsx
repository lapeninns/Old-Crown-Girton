'use client';

import { useEffect, useState } from 'react';
import { useOpeningHours } from '@/hooks/data/useOpeningHours';

/**
 * Footer Opening Hours Component
 * 
 * A simplified version of opening hours specifically designed for footer display.
 * This is a client component that can be used within the server-rendered Footer.
 */
export default function FooterOpeningHours() {
  const [isClient, setIsClient] = useState(false);
  const { hours, isLoading, error } = useOpeningHours();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading) {
    return (
      <div className="text-sm space-y-1 animate-pulse">
        <div className="h-4 bg-neutral-600 rounded w-24 mb-2"></div>
        <div className="h-3 bg-neutral-700 rounded w-32 mb-1"></div>
        <div className="h-3 bg-neutral-700 rounded w-28"></div>
      </div>
    );
  }

  if (error || !hours) {
    return (
      <div className="text-sm text-neutral-100">
        <p className="font-medium">Hours</p>
        <p>Call for current hours</p>
        <p>01223277217</p>
      </div>
    );
  }

  return (
    <div className="text-sm space-y-1">
      <div>
        <p className="font-medium text-white">Kitchen</p>
        <p className="text-neutral-200">{hours.summary.kitchenSummary}</p>
      </div>
      <div className="mt-2">
        <p className="font-medium text-white">Bar</p>
        <p className="text-neutral-200">{hours.summary.barSummary}</p>
      </div>
      {hours.currentStatus.isOpen && (
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-300 rounded-full"></span>
            Open Now
          </span>
        </div>
      )}
    </div>
  );
}