// Enhanced SEO Sitemap Generator - Restaurant-specific sitemap optimization
import { MetadataRoute } from 'next';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface SitemapEntryConfig {
  path: string;
  lastModified?: Date;
  changeFrequency?: ChangeFrequency;
  priority?: number;
  alternates?: {
    languages?: Record<string, string>;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.oldcrowngirton.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  const lastWeek = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  const createEntry = ({
    path,
    lastModified = currentDate,
    changeFrequency = 'monthly',
    priority = 0.5,
    alternates,
  }: SitemapEntryConfig) => ({
    url: `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
    lastModified,
    changeFrequency,
    priority,
    alternates,
  });

  const corePages = [
    createEntry({ path: '/', priority: 1, changeFrequency: 'weekly' }),
    createEntry({ path: '/menu', priority: 0.9, changeFrequency: 'daily' }),
    createEntry({ path: '/about', priority: 0.8, changeFrequency: 'monthly', lastModified: lastMonth }),
    createEntry({ path: '/contact', priority: 0.8, changeFrequency: 'monthly', lastModified: lastMonth }),
    createEntry({ path: '/book-a-table', priority: 0.78, changeFrequency: 'weekly', lastModified: lastWeek }),
    createEntry({ path: '/blog', priority: 0.8, changeFrequency: 'weekly' }),
    createEntry({ path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly', lastModified: new Date('2024-01-01') }),
    createEntry({ path: '/tos', priority: 0.3, changeFrequency: 'yearly', lastModified: new Date('2024-01-01') }),
  ];

  const eventPages = [
    createEntry({ path: '/events', priority: 0.82, changeFrequency: 'weekly', lastModified: lastWeek }),
  ];

  const blogPages = [
    createEntry({ path: '/blog/authentic-momo-dumplings-nepalese-cuisine', lastModified: new Date('2024-11-15'), changeFrequency: 'monthly', priority: 0.7 }),
    createEntry({ path: '/blog/business-lunch-cambridge-guide', lastModified: new Date('2024-11-25'), changeFrequency: 'monthly', priority: 0.7 }),
    createEntry({ path: '/blog/student-guide-cambridge-university', lastModified: new Date('2024-11-20'), changeFrequency: 'monthly', priority: 0.7 }),
    createEntry({ path: '/blog/dog-friendly-dining-guide', lastModified: new Date('2024-12-20'), changeFrequency: 'monthly', priority: 0.7 }),
    createEntry({ path: '/blog/perfect-sunday-roast-guide', lastModified: new Date('2024-12-15'), changeFrequency: 'monthly', priority: 0.7 }),
    createEntry({ path: '/blog/largest-thatched-pub-history', lastModified: new Date('2024-12-10'), changeFrequency: 'monthly', priority: 0.7 }),
    createEntry({ path: '/blog/ultimate-sports-viewing-guide', lastModified: new Date('2024-12-05'), changeFrequency: 'monthly', priority: 0.7 }),
    createEntry({ path: '/blog/local-suppliers-fresh-ingredients', lastModified: new Date('2024-11-30'), changeFrequency: 'monthly', priority: 0.7 }),
    createEntry({ path: '/blog/nepalese-cuisine-journey', lastModified: new Date('2024-08-15'), changeFrequency: 'monthly', priority: 0.7 }),
  ];

  const groupedEntries = [...corePages, ...eventPages, ...blogPages];

  // Deduplicate by URL while preserving highest priority entry
  const dedupedEntries = Array.from(
    groupedEntries
      .reduce((acc, entry) => {
        const existing = acc.get(entry.url);
        if (!existing || (entry.priority ?? 0) > (existing.priority ?? 0)) {
          acc.set(entry.url, entry);
        }
        return acc;
      }, new Map<string, ReturnType<typeof createEntry>>())
      .values()
  );

  return dedupedEntries.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
