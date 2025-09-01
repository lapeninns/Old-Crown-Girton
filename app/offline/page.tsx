import { getSEOTags } from '@/libs/seo';
import { OfflineStatus, OfflineFeatures, OfflineActions, OfflineBackground } from './_components';

// SEO Metadata with noindex
export const metadata = getSEOTags({
  title: "Offline - Old Crown Girton",
  description: "You are currently offline. Old Crown Girton content will be available when your connection is restored.",
  canonicalUrlRelative: "/offline",
  robots: {
    index: false,
    follow: false,
  },
});

export default function OfflinePage() {
  return (
    <section className="relative bg-brand-50 text-neutral-900 min-h-screen w-full flex flex-col justify-center gap-8 items-center p-10">
      <OfflineBackground />
      <OfflineStatus />
      <OfflineFeatures />
      <OfflineActions />
    </section>
  );
}