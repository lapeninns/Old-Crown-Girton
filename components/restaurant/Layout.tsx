import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default async function RestaurantLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-neutral">
      <Navbar />
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
