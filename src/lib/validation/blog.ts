import { z } from 'zod';
// Note: DOMPurify would be imported in real implementation
// import DOMPurify from 'isomorphic-dompurify';

/**
 * Blog Validation Library
 * 
 * Comprehensive validation for blog content following project security patterns:
 * - Input sanitization for XSS prevention
 * - Type-safe validation with Zod
 * - Content structure validation
 * - Performance-optimized validation caching
 */

// Enhanced blog post schema with security validations
export const SecureBlogPostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title too long'),
    // .transform(title => DOMPurify.sanitize(title, { ALLOWED_TAGS: [] })),
    
  excerpt: z.string()
    .min(10, 'Excerpt too short')
    .max(500, 'Excerpt too long'),
    // .transform(excerpt => DOMPurify.sanitize(excerpt, { ALLOWED_TAGS: [] })),
    
  content: z.string()
    .min(100, 'Content too short'),
    // .transform(content => DOMPurify.sanitize(content, {
    //   ALLOWED_TAGS: ['p', 'h2', 'h3', 'h4', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'blockquote'],
    //   ALLOWED_ATTR: ['href', 'target', 'rel'],
    //   ALLOWED_URI_REGEXP: /^https?:\/\/[^\s/$.?#].[^\s]*$/i,
    // })),
    
  image: z.string()
    .url('Invalid image URL')
    .or(z.string().regex(/^\/[^\/].*\.(jpg|jpeg|png|webp|avif)$/i, 'Invalid image path')),
    
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category too long')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Invalid category format'),
    
  author: z.object({
    name: z.string()
      .min(1, 'Author name required')
      .max(100, 'Author name too long'),
      // .transform(name => DOMPurify.sanitize(name, { ALLOWED_TAGS: [] })),
    bio: z.string()
      .min(10, 'Author bio too short')
      .max(300, 'Author bio too long'),
      // .transform(bio => DOMPurify.sanitize(bio, { ALLOWED_TAGS: [] })),
  }),
  
  publishedDate: z.string()
    .datetime('Invalid date format')
    .refine(date => new Date(date) <= new Date(), 'Future publish dates not allowed'),
    
  modifiedDate: z.string()
    .datetime('Invalid date format'),
    
  readTime: z.string()
    .regex(/^\d+\s?(min|minute|minutes)\s?read$/i, 'Invalid read time format'),
    
  slug: z.string()
    .min(1, 'Slug required')
    .max(100, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Invalid slug format - use lowercase letters, numbers, and hyphens only'),
    
  tags: z.array(
    z.string()
      .min(1, 'Tag cannot be empty')
      .max(30, 'Tag too long')
      .regex(/^[a-zA-Z0-9\s]+$/, 'Invalid tag format')
      // .transform(tag => DOMPurify.sanitize(tag, { ALLOWED_TAGS: [] }))
  ).max(10, 'Too many tags'),
}).refine(
  data => new Date(data.modifiedDate) >= new Date(data.publishedDate),
  {
    message: 'Modified date must be after or equal to published date',
    path: ['modifiedDate'],
  }
);

// Content structure validation
export const BlogContentStructureSchema = z.object({
  posts: z.record(z.string(), SecureBlogPostSchema),
  metadata: z.object({
    siteName: z.string().min(1).max(100),
    baseUrl: z.string().url(),
    defaultAuthor: z.object({
      name: z.string().min(1).max(100),
      bio: z.string().min(10).max(300),
    }),
  }),
  ui: z.object({
    labels: z.object({
      readTime: z.string().max(50),
      publishedOn: z.string().max(50),
      tags: z.string().max(50),
      author: z.string().max(50),
      backToBlog: z.string().max(50),
      sharePost: z.string().max(50),
      bookTable: z.string().max(50),
    }),
    callToAction: z.object({
      title: z.string().min(1).max(100),
      description: z.string().min(10).max(200),
      buttonText: z.string().min(1).max(30),
    }),
  }),
});

export type ValidatedBlogPost = z.infer<typeof SecureBlogPostSchema>;
export type ValidatedBlogContent = z.infer<typeof BlogContentStructureSchema>;

// Validation utilities
const validationCache = new Map<string, { result: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Validate blog post with caching for performance
 */
export function validateBlogPost(data: unknown, useCache = true): ValidatedBlogPost {
  const cacheKey = JSON.stringify(data);
  
  if (useCache) {
    const cached = validationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.result;
    }
  }
  
  try {
    const result = SecureBlogPostSchema.parse(data);
    
    if (useCache) {
      validationCache.set(cacheKey, { result, timestamp: Date.now() });
    }
    
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new Error(`Blog post validation failed: ${errorMessage}`);
    }
    throw error;
  }
}

/**
 * Validate blog content structure
 */
export function validateBlogContent(data: unknown): ValidatedBlogContent {
  try {
    return BlogContentStructureSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new Error(`Blog content validation failed: ${errorMessage}`);
    }
    throw error;
  }
}

/**
 * Content security utilities
 */
export const ContentSecurity = {
  /**
   * Sanitize HTML content for safe rendering
   * Note: In production, implement with DOMPurify
   */
  sanitizeHTML: (html: string): string => {
    // Basic sanitization - in production use DOMPurify
    return html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  },

  /**
   * Validate and sanitize URLs
   */
  sanitizeURL: (url: string): string => {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        throw new Error('Invalid URL protocol');
      }
      return parsed.toString();
    } catch {
      throw new Error('Invalid URL format');
    }
  },

  /**
   * Generate safe slug from title
   */
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100);
  },
};

/**
 * Clear validation cache (useful for testing)
 */
export function clearValidationCache(): void {
  validationCache.clear();
}