import { getSEOTags } from '@/libs/seo';
import CLSOptimizedPageClient from './page-client';

export const metadata = getSEOTags({
  title: 'CLS Demo - Old Crown Girton',
  description: 'Internal CLS optimisation demo route. Not intended for search indexing.',
  robots: {
    index: false,
    follow: false,
  },
});

export default function HomePage() {
  return <CLSOptimizedPageClient />;
}
