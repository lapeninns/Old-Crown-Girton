import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/signin/'],
    },
    sitemap: 'https://oldcrowngirton.co.uk/sitemap.xml',
  }
}
