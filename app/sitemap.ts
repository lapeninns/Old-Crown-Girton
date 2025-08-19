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
    
  // (blog removed)
    
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

  // Generate service pages for local SEO
  const servicePages: SitemapEntry[] = [
    {
      url: `${BASE_URL}/book-table`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/takeaway`,
      lastModified: lastWeek,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/dining-in`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/private-dining`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/catering`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.6,
    }
  ];

  // Generate local SEO pages
  const localSEOPages: SitemapEntry[] = [
    {
      url: `${BASE_URL}/nepalese-restaurant-girton`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/indian-restaurant-cambridge`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/pub-food-girton`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/takeaway-near-cambridge`,
      lastModified: lastWeek,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/restaurant-near-me`,
      lastModified: lastWeek,
      changeFrequency: 'weekly',
      priority: 0.8,
    }
  ];

  // Combine all pages
  const allPages = [
    ...staticPages,
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
