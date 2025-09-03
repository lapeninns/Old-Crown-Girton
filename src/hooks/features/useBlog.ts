import { useCallback } from 'react';
import useSWR from 'swr';
import { BlogPost, BlogContentStructure, BlogPostSchema, BLOG_FALLBACK_CONTENT } from '@/types/blog';
import { z } from 'zod';

/**
 * Custom hook for blog content following project patterns
 * - Implements SWR caching like other data hooks
 * - Provides type-safe data access
 * - Includes error handling with fallbacks
 * - Follows established naming conventions
 */

interface UseBlogOptions {
  slug?: string;
  refreshInterval?: number;
}

interface UseBlogReturn {
  post?: BlogPost;
  posts: BlogPost[];
  content: BlogContentStructure;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const fetcher = async (url: string): Promise<any> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Blog content fetch failed: ${response.status}`);
  }
  return response.json();
};

export function useBlog(options: UseBlogOptions = {}): UseBlogReturn {
  const { slug, refreshInterval = 300000 } = options; // 5 minutes default

  // Fetch blog configuration and content
  const { 
    data: blogContent, 
    error: contentError, 
    isLoading: contentLoading,
    mutate: refetchContent
  } = useSWR<BlogContentStructure>(
    '/api/blog/content',
    fetcher,
    { 
      refreshInterval,
      fallbackData: BLOG_FALLBACK_CONTENT as BlogContentStructure,
      revalidateOnFocus: false,
    }
  );

  // Fetch specific blog post if slug provided
  const { 
    data: postData, 
    error: postError, 
    isLoading: postLoading,
    mutate: refetchPost
  } = useSWR<{ post: BlogPost }>(
    slug ? `/api/blog/posts/${slug}` : null,
    fetcher,
    { 
      refreshInterval,
      revalidateOnFocus: false,
    }
  );

  // Fetch all posts list
  const { 
    data: postsData, 
    error: postsError, 
    isLoading: postsLoading,
    mutate: refetchPosts
  } = useSWR<{ posts: BlogPost[] }>(
    '/api/blog/posts',
    fetcher,
    { 
      refreshInterval,
      revalidateOnFocus: false,
    }
  );

  const refetch = useCallback(() => {
    refetchContent();
    if (slug) refetchPost();
    refetchPosts();
  }, [refetchContent, refetchPost, refetchPosts, slug]);

  // Validate and parse blog post data
  const validatedPost = postData?.post ? (() => {
    try {
      return BlogPostSchema.parse(postData.post);
    } catch (validationError) {
      console.warn('Blog post validation failed:', validationError);
      return undefined;
    }
  })() : undefined;

  // Validate posts array
  const validatedPosts = postsData?.posts ? (() => {
    try {
      return z.array(BlogPostSchema).parse(postsData.posts);
    } catch (validationError) {
      console.warn('Blog posts validation failed:', validationError);
      return [];
    }
  })() : [];

  return {
    post: validatedPost,
    posts: validatedPosts,
    content: blogContent || BLOG_FALLBACK_CONTENT as BlogContentStructure,
    isLoading: contentLoading || postLoading || postsLoading,
    error: contentError || postError || postsError || null,
    refetch,
  };
}

/**
 * Hook for blog metadata and UI content only
 * Lighter version when you don't need post data
 */
export function useBlogContent(): Pick<UseBlogReturn, 'content' | 'isLoading' | 'error' | 'refetch'> {
  return useBlog();
}