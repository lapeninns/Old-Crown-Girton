import OpeningHoursDebug from '@/components/debug/OpeningHoursDebug';
import { getSEOTags } from '@/libs/seo';

export const metadata = getSEOTags({
  title: 'Opening Hours Debug - Old Crown Girton',
  description: 'Internal opening hours debug route. Not intended for search indexing.',
  robots: {
    index: false,
    follow: false,
  },
});

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Opening Hours Test</h1>
        <OpeningHoursDebug />
      </div>
    </div>
  );
}
