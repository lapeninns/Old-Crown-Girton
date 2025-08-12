'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function RestaurantLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-neutral">
      <Navbar />
      <main className="overflow-x-hidden" id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
