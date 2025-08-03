import { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import { Viewport } from "next";
import PlausibleProvider from "next-plausible";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import InstallPrompt, { OfflineNotification, UpdateNotification } from "@/components/ui/InstallPrompt";
import ServiceWorkerManager from "@/components/ui/ServiceWorkerManager";
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import config from "@/config";
import "./globals.css";
import "../styles/accessibility.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
});

export const viewport: Viewport = {
  themeColor: "#D4941E", // Crown gold color
  width: "device-width",
  initialScale: 1,
};

// SEO tags for Old Crown restaurant
export const metadata = getSEOTags({
  title: "Old Crown, Girton - Nepalese Restaurant & Pub near Cambridge",
  description: "Authentic Nepalese cuisine and traditional pub classics in Girton, Cambridge. Book a table or order takeaway. Award-winning restaurant with terrace garden.",
  keywords: ["Nepalese restaurant", "Cambridge dining", "Girton pub", "takeaway", "book table", "traditional pub food"],
  canonicalUrlRelative: "/",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      {config.domainName && (
        <head>
          <PlausibleProvider domain={config.domainName} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          
          {/* PWA Manifest */}
          <link rel="manifest" href="/manifest.json" />
          
          {/* PWA Icons */}
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icon.png" />
          
          {/* PWA Meta Tags */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Old Crown" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#D4941E" />
          <meta name="msapplication-tap-highlight" content="no" />
          
          {/* Preload critical resources */}
          <link rel="preload" href="/hero-restaurant.jpg" as="image" />
        </head>
      )}
      <body className={inter.className}>
        {/* SEO Schema Markup */}
        <SchemaInjector type="restaurant" />
        
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="accessibility-skip-link">
          Skip to main content
        </a>
        
        <main id="main-content">
          <ClientLayout>{children}</ClientLayout>
        </main>
        
        {/* PWA Components */}
        <ServiceWorkerManager />
        <InstallPrompt />
        <OfflineNotification />
        <UpdateNotification />
      </body>
    </html>
  );
}
