/**
 * Blog Content Types and Interfaces
 * Following project's type-safe content management patterns
 */

import { z } from 'zod';

// Blog post schema for runtime validation
export const BlogPostSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  image: z.string().url().or(z.string().min(1)),
  category: z.string().min(1),
  author: z.object({
    name: z.string().min(1),
    bio: z.string().min(1),
  }),
  publishedDate: z.string().datetime(),
  modifiedDate: z.string().datetime(),
  readTime: z.string().min(1),
  slug: z.string().min(1),
  tags: z.array(z.string().min(1)),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

// Blog content interface for CMS integration
export interface BlogContentStructure {
  posts: {
    [slug: string]: BlogPost;
  };
  metadata: {
    siteName: string;
    baseUrl: string;
    defaultAuthor: {
      name: string;
      bio: string;
    };
  };
  ui: {
    labels: {
      readTime: string;
      publishedOn: string;
      tags: string;
      author: string;
      backToBlog: string;
      sharePost: string;
      bookTable: string;
    };
    callToAction: {
      title: string;
      description: string;
      buttonText: string;
    };
  };
}

// Error fallback content
export const BLOG_FALLBACK_CONTENT: BlogContentStructure = {
  posts: {},
  metadata: {
    siteName: 'Old Crown Girton',
    baseUrl: 'https://oldcrowngirton.com',
    defaultAuthor: {
      name: 'Old Crown Team',
      bio: 'The passionate team behind Old Crown Girton\'s unique dining experience.',
    },
  },
  ui: {
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
  },
};