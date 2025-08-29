import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('./Navbar'));
const NavbarStatic = dynamic(() => import('./NavbarStatic'));
import Footer from './Footer';

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
