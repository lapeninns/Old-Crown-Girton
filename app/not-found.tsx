import { getSEOTags } from '@/libs/seo';
import { NotFoundContent, NotFoundActions, NotFoundBackground } from './not-found/_components';

// SEO Metadata with noindex
export const metadata = getSEOTags({
  title: "Page Not Found - Old Crown Girton",
  description: "The page you're looking for doesn't exist. Visit Old Crown Girton homepage to find information about our historic thatched pub in Cambridge.",
  canonicalUrlRelative: "/not-found",
  robots: {
    index: false,
    follow: false,
  },
});

export default function Custom404() {
  return (
    <section className="relative bg-brand-50 text-neutral-900 min-h-screen w-full flex flex-col justify-center gap-8 items-center p-10">
      <NotFoundBackground />
      <NotFoundContent />
      <NotFoundActions />
    </section>
  );
}