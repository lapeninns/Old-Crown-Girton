// Enhanced robots.txt for restaurant SEO optimization
import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.oldcrowngirton.com';
 
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
          '/book-table',
          '/takeaway',
          '/nepalese-restaurant-girton',
          '/indian-restaurant-cambridge',
          '/pub-food-girton',
          '/restaurant-near-me'
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/signin/',
          '/_next/',
          '/admin/',
          '/private/',
          '/*?*', // Block parameter URLs to avoid duplicate content
          '/*#'   // Block fragment URLs
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
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/sitemap-images.xml`,
      `${BASE_URL}/sitemap-news.xml`
    ],
    host: BASE_URL,
  }
}
