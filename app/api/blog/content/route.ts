import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BlogContentStructure, BLOG_FALLBACK_CONTENT } from '@/types/blog';

/**
 * Blog Content API Route
 * 
 * Follows established project patterns for API routes:
 * - Type-safe responses
 * - Error handling with fallbacks
 * - Caching headers for performance
 * - Runtime validation with Zod
 */

const BlogContentResponseSchema = z.object({
  posts: z.record(z.string(), z.any()).optional().default({}),
  metadata: z.object({
    siteName: z.string().optional().default('Old Crown Girton'),
    baseUrl: z.string().optional().default('https://oldcrowngirton.com'),
    defaultAuthor: z.object({
      name: z.string().optional().default('Old Crown Team'),
      bio: z.string().optional().default('The passionate team behind Old Crown Girton\'s unique dining experience.'),
    }).optional().default({
      name: 'Old Crown Team',
      bio: 'The passionate team behind Old Crown Girton\'s unique dining experience.',
    }),
  }).optional().default({
    siteName: 'Old Crown Girton',
    baseUrl: 'https://oldcrowngirton.com',
    defaultAuthor: {
      name: 'Old Crown Team',
      bio: 'The passionate team behind Old Crown Girton\'s unique dining experience.',
    },
  }),
  ui: z.object({
    labels: z.object({
      readTime: z.string().optional().default('min read'),
      publishedOn: z.string().optional().default('Published on'),
      tags: z.string().optional().default('Tags'),
      author: z.string().optional().default('About the Author'),
      backToBlog: z.string().optional().default('Back to Blog'),
      sharePost: z.string().optional().default('Share'),
      bookTable: z.string().optional().default('Book Your Table'),
    }).optional().default({
      readTime: 'min read',
      publishedOn: 'Published on',
      tags: 'Tags',
      author: 'About the Author',
      backToBlog: 'Back to Blog',
      sharePost: 'Share',
      bookTable: 'Book Your Table',
    }),
    callToAction: z.object({
      title: z.string().optional().default('Experience Our Restaurant'),
      description: z.string().optional().default('Visit us to taste the authentic difference.'),
      buttonText: z.string().optional().default('Book Now'),
    }).optional().default({
      title: 'Experience Our Restaurant',
      description: 'Visit us to taste the authentic difference.',
      buttonText: 'Book Now',
    }),
  }).optional().default({
    labels: {
      readTime: 'min read',
      publishedOn: 'Published on',
      tags: 'Tags',
      author: 'About the Author',
      backToBlog: 'Back to Blog',
      sharePost: 'Share',
      bookTable: 'Book Your Table',
    },
    callToAction: {
      title: 'Experience Our Restaurant',
      description: 'Visit us to taste the authentic difference.',
      buttonText: 'Book Now',
    },
  }),
}).transform((data) => ({
  posts: data.posts || {},
  metadata: {
    siteName: data.metadata?.siteName || 'Old Crown Girton',
    baseUrl: data.metadata?.baseUrl || 'https://oldcrowngirton.com',
    defaultAuthor: {
      name: data.metadata?.defaultAuthor?.name || 'Old Crown Team',
      bio: data.metadata?.defaultAuthor?.bio || 'The passionate team behind Old Crown Girton\'s unique dining experience.',
    },
  },
  ui: {
    labels: {
      readTime: data.ui?.labels?.readTime || 'min read',
      publishedOn: data.ui?.labels?.publishedOn || 'Published on',
      tags: data.ui?.labels?.tags || 'Tags',
      author: data.ui?.labels?.author || 'About the Author',
      backToBlog: data.ui?.labels?.backToBlog || 'Back to Blog',
      sharePost: data.ui?.labels?.sharePost || 'Share',
      bookTable: data.ui?.labels?.bookTable || 'Book Your Table',
    },
    callToAction: {
      title: data.ui?.callToAction?.title || 'Experience Our Restaurant',
      description: data.ui?.callToAction?.description || 'Visit us to taste the authentic difference.',
      buttonText: data.ui?.callToAction?.buttonText || 'Book Now',
    },
  },
}));

async function getBlogContent(): Promise<BlogContentStructure> {
  try {
    // In a real implementation, this would load from the content management system
    // Following the project's pattern of external JSON loading
    const baseUrl = process.env.NEXT_PUBLIC_DATA_BASE_URL;
    
    if (baseUrl) {
      // Try external CMS first
      const response = await fetch(`${baseUrl}/blog/content.json`, {
        next: { revalidate: 300 }, // 5 minutes cache
      });
      
      if (response.ok) {
        const data = await response.json();
        return BlogContentResponseSchema.parse(data);
      }
    }
    
    // Fallback to local data or return fallback content
    return BLOG_FALLBACK_CONTENT;
    
  } catch (error) {
    console.error('Blog content loading failed:', error);
    return BLOG_FALLBACK_CONTENT;
  }
}

export async function GET(request: NextRequest) {
  try {
    const content = await getBlogContent();
    
    return NextResponse.json(
      {
        ...content,
        status: 'success',
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Blog content API error:', error);
    
    return NextResponse.json(
      {
        ...BLOG_FALLBACK_CONTENT,
        status: 'error',
        error: 'Failed to load blog content',
        timestamp: new Date().toISOString(),
      },
      {
        status: 200, // Return 200 with fallback content
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}