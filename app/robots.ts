// Enhanced robots.txt for restaurant SEO optimization
import { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/src/lib/site/site';

const BASE_URL = SITE_ORIGIN;
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Main crawler rules
      {
        userAgent: '*',
        allow: [
          '/',
          '/menu',
          '/about',
          '/contact',
          '/events',
          '/blog',
          '/book-a-table',
          '/takeaway-menu',
          '/wakes-menu',
          '/menu-information',
          '/press',
          '/privacy-policy',
          '/tos'
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/signin/',
          '/admin/',
          '/private/'
        ],
        crawlDelay: 1,
      },
      
      // Googlebot specific rules (more lenient)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/signin/',
          '/admin/',
          '/private/'
        ],
        crawlDelay: 0,
      },
      
      // Bingbot specific rules
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/signin/',
          '/admin/',
          '/private/'
        ],
        crawlDelay: 1,
      },
      
      // Social media bots (for rich previews)
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },

      // AI crawler rules
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      
      // Block aggressive SEO crawlers
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      }
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`
    ],
    host: BASE_URL,
  }
}
