import { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import { Viewport } from "next";
import PlausibleProvider from "next-plausible";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import { WebVitalsTracker, PerformanceDebugPanel } from "@/components/ui/PerformanceTracker";
import config from "@/config";
import "./globals.css";

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
        </head>
      )}
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
        <WebVitalsTracker />
        <PerformanceDebugPanel />
      </body>
    </html>
  );
}
