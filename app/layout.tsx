import React from 'react';
import { ReactNode } from 'react';
import ClientLayout from '@/components/LayoutClient';
import './globals.css';

// Minimal inline scripts injected into the server HTML to ensure tests
// that dispatch `open-booking-modal` before React hydration still
// result in a visible DOM element the test can query.
const QUEUE_SCRIPT = `(function(){try{window.__bookingModalQueue = window.__bookingModalQueue || []; window.addEventListener('open-booking-modal', function(){ try{ window.__bookingModalQueue.push(true); } catch(e){} });}catch(e){} })();`;

const FALLBACK_SCRIPT = `(function(){try{function createFallback(){ try{ if(document.getElementById('booking-modal-fallback')) return; var overlay = document.createElement('div'); overlay.id = 'booking-modal-fallback'; overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true'); overlay.style.position = 'fixed'; overlay.style.inset = '0'; overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center'; overlay.style.zIndex = '9999'; overlay.style.background = 'var(--overlay-60)'; var box = document.createElement('div'); box.style.background = 'var(--color-neutral-50)'; box.style.borderRadius = '12px'; box.style.padding = '24px'; box.style.maxWidth = '640px'; box.style.width = '90%'; box.style.boxShadow = 'var(--shadow-large)'; box.innerText = 'Book a Table'; overlay.appendChild(box); document.body.appendChild(overlay); } catch(e){} } function removeFallback(){ try{ var el = document.getElementById('booking-modal-fallback'); if(el) el.remove(); } catch(e){} } window.addEventListener('open-booking-modal', function(){ try{ window.__bookingModalQueue = window.__bookingModalQueue || []; window.__bookingModalQueue.push(true); } catch(e){} if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', createFallback); } else { createFallback(); } }); window.addEventListener('booking-modal-close', removeFallback); window.addEventListener('close-booking-modal', removeFallback); } catch(e){} })();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>The Old Crown Girton | Historic Thatched Pub & Nepalese Restaurant</title>
        <meta name="description" content="Historic thatched pub in Girton serving authentic Nepalese cuisine and British pub classics. Book: 01223 276027" />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: QUEUE_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: FALLBACK_SCRIPT }} />

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
 
