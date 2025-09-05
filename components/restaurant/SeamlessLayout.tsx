import React, { ReactNode, Suspense } from 'react';
import { LoadingManagerProvider } from '@/hooks/useSeamlessLoading';
import Navbar from './Navbar';
import NavbarStatic from './NavbarStatic';
import Footer from './Footer';

interface SeamlessLayoutProps {
  children: ReactNode;
  noMotion?: boolean;
}

/**
 * SeamlessLayout - Zero loading delay, no layout shifts, progressive enhancement
 */
export default function SeamlessLayout({ children, noMotion = false }: SeamlessLayoutProps) {
  return (
    <LoadingManagerProvider>
      <SeamlessLayoutContent noMotion={noMotion}>
        {children}
      </SeamlessLayoutContent>
    </LoadingManagerProvider>
  );
}

function SeamlessLayoutContent({ children, noMotion }: SeamlessLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral">
      {/* Navbar with instant loading */}
      {noMotion ? (
        <NavbarStatic />
      ) : (
        <Suspense fallback={<div className="h-16 bg-gray-200 animate-pulse" />}>
          <Navbar />
        </Suspense>
      )}
      
      <main 
        className="overflow-x-hidden relative" 
        id="main-content"
        tabIndex={-1}
        style={{
          minHeight: 'calc(100vh - 64px)', // Account for navbar height
          isolation: 'isolate', // Create new stacking context
          paddingTop: '64px', // Add padding for fixed navbar
        }}
      >
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
