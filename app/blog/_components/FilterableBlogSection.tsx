"use client";

import { useState, useMemo } from 'react';
import { BlogCategories } from './index';
import BlogGrid from './BlogGrid';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  publishedDate: string;
  readTime: string;
  slug: string;
}

interface Category {
  name: string;
  count: number;
  slug: string;
}

interface FilterableBlogSectionProps {
  posts: BlogPost[];
  categories: Category[];
}

/**
 * Client-side blog filtering component
 * Handles category filtering without page navigation
 */
export default function FilterableBlogSection({ posts, categories }: FilterableBlogSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') {
      return posts;
    }

    return posts.filter(post => {
      // Create a mapping of category slugs to category names/keywords
      const categoryMappings: Record<string, string[]> = {
        'food-dining': ['food & dining', 'food', 'dining'],
        'nepalese-cuisine': ['nepalese cuisine', 'cuisine', 'nepalese'],
        'business-dining': ['business dining', 'business'],
        'student-life': ['student life', 'student'],
        'history': ['history & heritage', 'history', 'heritage'],
        'sports': ['sports & entertainment', 'sports', 'entertainment'],
        'local-sourcing': ['local sourcing', 'sourcing', 'local'],
        'dog-friendly': ['dog-friendly', 'dog'],
        'press-media': ['press & media', 'press', 'media']
      };
      
      const keywords = categoryMappings[activeCategory] || [activeCategory];
      const postCategory = post.category.toLowerCase();
      
      return keywords.some(keyword => 
        postCategory.includes(keyword.toLowerCase())
      );
    });
  }, [posts, activeCategory]);

  // Update category counts based on current filtering
  const updatedCategories = useMemo(() => {
    return categories.map(category => {
      if (category.slug === 'all') {
        return { ...category, count: posts.length };
      }
      
      const categoryMappings: Record<string, string[]> = {
        'food-dining': ['food & dining', 'food', 'dining'],
        'nepalese-cuisine': ['nepalese cuisine', 'cuisine', 'nepalese'],
        'business-dining': ['business dining', 'business'],
        'student-life': ['student life', 'student'],
        'history': ['history & heritage', 'history', 'heritage'],
        'sports': ['sports & entertainment', 'sports', 'entertainment'],
        'local-sourcing': ['local sourcing', 'sourcing', 'local'],
        'dog-friendly': ['dog-friendly', 'dog'],
        'press-media': ['press & media', 'press', 'media']
      };
      
      const keywords = categoryMappings[category.slug] || [category.slug];
      
      const matchingPosts = posts.filter(post => {
        const postCategory = post.category.toLowerCase();
        return keywords.some(keyword => 
          postCategory.includes(keyword.toLowerCase())
        );
      });
      
      return { ...category, count: matchingPosts.length };
    });
  }, [posts, categories]);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
  };

  return (
    <>
      {/* Categories Filter */}
      <section className="py-12 bg-brand-100" aria-labelledby="blog-categories-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="blog-categories-heading" className="sr-only">Blog Categories</h2>
          <BlogCategories 
            categories={updatedCategories} 
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </section>

      {/* Filtered Posts Grid */}
      <section className="py-16 bg-brand-50" aria-labelledby="filtered-posts-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 id="filtered-posts-heading" className="text-3xl font-display font-bold text-brand-700">
              {activeCategory === 'all' ? 'All Posts' : categories.find(c => c.slug === activeCategory)?.name || 'Posts'}
            </h2>
            <span className="text-neutral-600 text-sm">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>
          
          {filteredPosts.length > 0 ? (
            <BlogGrid posts={filteredPosts} />
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">No posts found</h3>
              <p className="text-neutral-600 mb-4">
                No posts match the selected category. Try selecting a different category.
              </p>
              <button
                onClick={() => setActiveCategory('all')}
                className="inline-flex items-center px-4 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
              >
                View All Posts
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
