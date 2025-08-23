'use client';

import { useState, useEffect } from 'react';

export default function ResponsiveDebugger() {
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('');

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
      
      // Determine current breakpoint
      if (window.innerWidth < 768) {
        setCurrentBreakpoint('Mobile (< 768px)');
      } else if (window.innerWidth < 1024) {
        setCurrentBreakpoint('Tablet (768px - 1023px)');
      } else if (window.innerWidth < 1440) {
        setCurrentBreakpoint('Desktop (1024px - 1439px)');
      } else {
        setCurrentBreakpoint('Large Desktop (1440px+)');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        background: 'var(--overlay-60)',
        color: 'white',
        padding: '8px 12px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        borderRadius: '0 0 0 8px',
        opacity: 0.7,
        pointerEvents: 'none',
      }}
    >
      <div>{screenWidth}x{screenHeight}</div>
      <div>{currentBreakpoint}</div>
      <div style={{ marginTop: '4px', fontSize: '10px' }}>
        Columns: {screenWidth < 768 ? '1' : screenWidth < 1024 ? '2' : screenWidth < 1440 ? '3' : '4'}
      </div>
    </div>
  );
}
