"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MotionDiv } from '@/components/motion/DynamicMotion';
import { BlogPost } from '@/types/blog';
import { useBlogContent } from '@/src/hooks/features/useBlog';

interface BlogPostLayoutProps {
  post: BlogPost;
  className?: string;
}

/**
 * Reusable blog post layout component following project patterns
 * - Uses content management system for UI text
 * - Implements proper SEO structure
 * - Follows accessibility guidelines
 * - Integrates with motion system
 */
export const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({ 
  post, 
  className = "" 
}) => {
  const { content } = useBlogContent();
  
  // Fallback content if CMS fails
  const ui = content?.ui || {
    labels: {
      publishedOn: 'Published on',
      readTime: 'min read',
      tags: 'Tags',
      author: 'About the Author',
      backToBlog: 'Back to Blog',
    }
  };

  return (
    <div className={`min-h-screen bg-neutral-50 ${className}`}>
      {/* Breadcrumbs */}
      <nav className="bg-white py-4 border-b" aria-label="Breadcrumb">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              Home
            </Link>
            <span aria-hidden="true">→</span>
            <Link href="/blog" className="hover:text-brand-600 transition-colors">
              Blog
            </Link>
            <span aria-hidden="true">→</span>
            <span className="text-brand-600">{post.category}</span>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <header className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-700 mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-neutral-600">
              <span>By {post.author.name}</span>
              <span aria-hidden="true">•</span>
              <time dateTime={post.publishedDate}>
                {new Date(post.publishedDate).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span aria-hidden="true">•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
            <MotionDiv className="absolute inset-0" layoutId={`post:${post.slug}:image`}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
                priority
              />
            </MotionDiv>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg max-w-none prose-brand">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold text-brand-700 mb-4">
                {ui.labels.tags}
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="mt-12 p-6 bg-brand-50 rounded-xl">
            <h3 className="text-lg font-semibold text-brand-700 mb-2">
              {ui.labels.author}
            </h3>
            <p className="text-neutral-600">{post.author.bio}</p>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center">
            <Link 
              href="/blog"
              className="inline-flex items-center text-brand-600 font-semibold hover:text-brand-700 transition-colors"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              {ui.labels.backToBlog}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};