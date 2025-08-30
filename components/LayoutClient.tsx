"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Crisp } from "crisp-sdk-web";
import NextTopLoader from "nextjs-toploader";
import NotificationToaster from '@/components/ui/Notifications';
import { Tooltip } from "react-tooltip";
import config from "@/config";
import dynamic from 'next/dynamic';
import PageTransition from '@/components/PageTransition';
import { MotionConfigProvider } from '@/lib/motion/accessibility';
import { MotionFeatures } from '@/lib/motion/performance';

const StickyCallButtonDynamic = dynamic(() => import('./StickyCallButton'));
const BookingModal = dynamic(() => import('./restaurant/BookingModal'));

const BookingModalPortal = ({ disabled = false }: { disabled?: boolean }) => {
  const [open, setOpen] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
    
    const handler = () => {
    try { console.debug && console.debug('BookingModalPortal: received open-booking-modal'); } catch (e) { /* ignore */ }
      setOpen(true);
    };

    window.addEventListener("open-booking-modal", handler);

    // Mark that the booking portal has mounted so tests can wait for it.
    try {
      document.documentElement.setAttribute('data-booking-portal-mounted', '1');
    } catch (e) { /* ignore */ }

    // Consume any queued events that fired before this component mounted
    try {
      const q = (window as any).__bookingModalQueue;
      if (Array.isArray(q) && q.length > 0) {
        try { console.debug && console.debug('BookingModalPortal: consuming queued events', q.length); } catch (e) { /* ignore */ }
        setOpen(true);
        (window as any).__bookingModalQueue = [];
      }
    } catch (e) { /* ignore */ }

    return () => window.removeEventListener("open-booking-modal", handler);
  }, []);

  React.useEffect(() => {
    if (open) {
      window.dispatchEvent(new CustomEvent("booking-modal-open"));
    } else {
      window.dispatchEvent(new CustomEvent("booking-modal-close"));
    }
  }, [open]);

  // Add a mount marker so tests can wait for portal availability
  if (!isHydrated) {
    return <div data-booking-portal-mounted="0"></div>;
  }

  if (disabled) return null;
  return (
    <div data-booking-portal-mounted={open ? "1" : "0"}>
      <BookingModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

// Crisp customer chat support:
// This component is separated from ClientLayout because it needs to be wrapped with <SessionProvider> to use useSession() hook
const CrispChat = (): null => {
  const pathname = usePathname();

  const supabase = createClientComponentClient();
  const [data, setData] = useState<any>(null);

  // This is used to get the user data from Supabase Auth (if logged in) => user ID is used to identify users in Crisp
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setData(session.user);
      }
    };
    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    if (config?.crisp?.id) {
      // Set up Crisp
      Crisp.configure(config.crisp.id);

      // (Optional) If onlyShowOnRoutes array is not empty in config.js file, Crisp will be hidden on the routes in the array.
      // Use <AppButtonSupport> instead to show it (user clicks on the button to show Crisp—it cleans the UI)
      if (
        config.crisp.onlyShowOnRoutes &&
        !config.crisp.onlyShowOnRoutes?.includes(pathname)
      ) {
        Crisp.chat.hide();
        Crisp.chat.onChatClosed(() => {
          Crisp.chat.hide();
        });
      }
    }
  }, [pathname]);

  // Add User Unique ID to Crisp to easily identify users when reaching support (optional)
  useEffect(() => {
    if (data?.user && config?.crisp?.id) {
      Crisp.session.setData({ userId: data.user?.id });
    }
  }, [data]);

  return null;
};

// All the client wrappers are here (they can't be in server components)
// 1. NextTopLoader: Show a progress bar at the top when navigating between pages
// 2. Toaster: Show Success/Error messages anywhere from the app with toast()
// 3. Tooltip: Show tooltips if any JSX elements has these 2 attributes: data-tooltip-id="tooltip" data-tooltip-content=""
// 4. CrispChat: Set Crisp customer chat support (see above)
const ClientLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() || '';
  const isNoMotion = (
    pathname === '/' ||
    pathname === '/menu' ||
    pathname === '/about' ||
    pathname === '/events' ||
    pathname === '/contact' ||
    pathname === '/tos' ||
    pathname === '/privacy-policy' ||
    pathname.startsWith('/blog')
  );
  return (
    <>
      {/* Show a progress bar at the top when navigating between pages */}
      {!isNoMotion && <NextTopLoader color={config.colors.main} showSpinner={false} />}

      {/* LazyMotion + MotionConfig + Page transitions around route content */}
      <MotionFeatures>
        <MotionConfigProvider reducedMotion="user">
          <PageTransition disableMotion={isNoMotion} routeKey={pathname}>
            {children}
          </PageTransition>
        </MotionConfigProvider>
      </MotionFeatures>

      {/* Standardized notification toaster with ARIA live region */}
      <NotificationToaster />

      {/* Show tooltips if any JSX elements has these 2 attributes: data-tooltip-id="tooltip" data-tooltip-content="" */}
      <Tooltip
        id="tooltip"
        className="z-[60] !opacity-100 max-w-sm shadow-lg"
      />

      {/* Set Crisp customer chat support */}
      <CrispChat />

      {/* Floating Call / Book FAB */}
      {!isNoMotion && <StickyCallButtonDynamic />}
      <BookingModalPortal disabled={isNoMotion} />
    </>
  );
};

export default ClientLayout;
