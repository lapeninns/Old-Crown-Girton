'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import LightweightMenu from './menu-content-lightweight';

// Dynamically import the full menu with animations
const FullMenu = dynamic(() => import('./menu-content-complete'), {
  loading: () => <LightweightMenu />,
  ssr: false, // Client-side only for animations
});

export default function ProgressiveMenu() {
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Progressive enhancement: Load full menu after initial render
    const timer = setTimeout(() => {
      setShowFullMenu(true);
    }, 1000); // 1 second delay to ensure smooth initial load

    return () => clearTimeout(timer);
  }, []);

  // Show lightweight version on server and initial client render
  if (!isClient || !showFullMenu) {
    return <LightweightMenu />;
  }

  // Show full menu with animations after progressive enhancement
  return (
    <Suspense fallback={<LightweightMenu />}>
      <FullMenu />
    </Suspense>
  );
}
