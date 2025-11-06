import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
// Critical above-fold components should NOT be dynamic
import NavbarStatic from './NavbarStatic';
import Footer from './Footer';
import Navbar from './Navbar';

const NAVBAR_OFFSET_FALLBACK = '64px';
const NAVBAR_STACK_OFFSET_FALLBACK = '104px';

interface LayoutProps {
  children: ReactNode;
  noMotion?: boolean;
}

export default async function RestaurantLayout({ children, noMotion = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-neutral">
      {noMotion ? <NavbarStatic /> : <Navbar />}
      <main
        className="overflow-x-hidden relative"
        id="main-content"
        tabIndex={-1}
        style={{
          minHeight: `calc(100vh - var(--navbar-offset, ${NAVBAR_OFFSET_FALLBACK}))`, // Base navbar height (excludes promo banner)
          isolation: 'isolate', // Create new stacking context
          paddingTop: `var(--navbar-stack-offset, ${NAVBAR_STACK_OFFSET_FALLBACK})`, // Allow space for navbar + seasonal banner stack
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
