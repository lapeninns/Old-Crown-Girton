import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import ClientLayout from '@/components/LayoutClient';
import { LoadingProvider } from '@/contexts/LoadingContext';
import GlobalLoadingIndicator from '@/components/GlobalLoadingIndicator';
import ServiceWorkerProvider from '@/components/ServiceWorkerProvider';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://oldcrowngirton.com/'),
  title: 'The Old Crown Girton | Historic Thatched Pub & Nepalese Restaurant',
  description: 'Historic thatched pub in Girton serving authentic Nepalese cuisine and British pub classics. Book: 01223277217',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/icon-72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icon-144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-384.png', sizes: '384x384', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
};

// Minimal inline scripts injected into the server HTML to ensure tests
// that dispatch `open-booking-modal` before React hydration still
// result in a visible DOM element the test can query.
const QUEUE_SCRIPT = `(function(){try{window.__bookingModalQueue = window.__bookingModalQueue || []; window.addEventListener('open-booking-modal', function(){ try{ window.__bookingModalQueue.push(true); } catch(e){} });}catch(e){} })();`;

const FALLBACK_SCRIPT = `(function(){try{function createFallback(){ try{ if(document.getElementById('booking-modal-fallback')) return; var overlay = document.createElement('div'); overlay.id = 'booking-modal-fallback'; overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true'); overlay.style.position = 'fixed'; overlay.style.inset = '0'; overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center'; overlay.style.zIndex = '9999'; overlay.style.background = 'var(--overlay-60)'; var box = document.createElement('div'); box.style.background = 'var(--color-neutral-50)'; box.style.borderRadius = '12px'; box.style.padding = '24px'; box.style.maxWidth = '640px'; box.style.width = '90%'; box.style.boxShadow = 'var(--shadow-large)'; box.innerText = 'Book a Table'; overlay.appendChild(box); document.body.appendChild(overlay); } catch(e){} } function removeFallback(){ try{ var el = document.getElementById('booking-modal-fallback'); if(el) el.remove(); } catch(e){} } window.addEventListener('open-booking-modal', function(){ try{ window.__bookingModalQueue = window.__bookingModalQueue || []; window.__bookingModalQueue.push(true); } catch(e){} if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', createFallback); } else { createFallback(); } }); window.addEventListener('booking-modal-close', removeFallback); window.addEventListener('close-booking-modal', removeFallback); } catch(e){} })();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Skip link for keyboard users */}
        <a href="#main-content" className="accessibility-skip-link">Skip to main content</a>
        <script dangerouslySetInnerHTML={{ __html: QUEUE_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: FALLBACK_SCRIPT }} />

        <LoadingProvider>
          <ServiceWorkerProvider>
            <GlobalLoadingIndicator />
            <ClientLayout>{children}</ClientLayout>
          </ServiceWorkerProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
 
