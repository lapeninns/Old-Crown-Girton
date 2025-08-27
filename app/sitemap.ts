// Enhanced SEO Sitemap Generator - Restaurant-specific sitemap optimization
import { MetadataRoute } from 'next';

// Define sitemap priorities and change frequencies
interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: {
    languages?: Record<string, string>;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.oldcrowngirton.co.uk';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  const lastWeek = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  const staticPages: SitemapEntry[] = [
    // Homepage - highest priority, updated weekly
    {
      url: `${BASE_URL}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    
    // Menu - high priority, updated daily (specials, prices)
    {
      url: `${BASE_URL}/menu`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    
    // About - medium priority, updated monthly
    {
      url: `${BASE_URL}/about`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    
    // Contact - medium priority, updated monthly
    {
      url: `${BASE_URL}/contact`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    
    // Events - high priority, updated weekly
    {
      url: `${BASE_URL}/events`,
      lastModified: lastWeek,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    
    // Blog - medium-high priority, updated weekly
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    
    // Legal pages - low priority, rarely updated
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/tos`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Blog posts - medium priority, content rarely changes once published
  const blogPages: SitemapEntry[] = [
    {
      url: `${BASE_URL}/blog/authentic-momo-dumplings-nepalese-cuisine`,
      lastModified: new Date('2024-11-15'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/business-lunch-cambridge-guide`,
      lastModified: new Date('2024-11-25'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/student-guide-cambridge-university`,
      lastModified: new Date('2024-11-20'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/dog-friendly-dining-guide`,
      lastModified: new Date('2024-12-20'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/perfect-sunday-roast-guide`,
      lastModified: new Date('2024-12-15'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/largest-thatched-pub-history`,
      lastModified: new Date('2024-12-10'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/ultimate-sports-viewing-guide`,
      lastModified: new Date('2024-12-05'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/local-suppliers-fresh-ingredients`,
      lastModified: new Date('2024-11-30'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/nepalese-cuisine-journey`,
      lastModified: new Date('2024-08-15'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // No additional service pages or local SEO pages needed
  const servicePages: SitemapEntry[] = [];
  const localSEOPages: SitemapEntry[] = [];

  // Combine all pages
  const allPages = [
    ...staticPages,
    ...blogPages,
    ...servicePages,
    ...localSEOPages
  ];

  // Convert to MetadataRoute.Sitemap format and sort by priority
  return allPages
    .map(page => ({
      url: page.url,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: page.alternates
    }))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
}
