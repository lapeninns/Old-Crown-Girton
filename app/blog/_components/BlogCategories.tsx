"use client";

import { useState, useEffect } from 'react';

interface Category {
  name: string;
  count: number;
  slug: string;
}

interface BlogCategoriesProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (slug: string) => void;
}

export default function BlogCategories({ 
  categories, 
  activeCategory = 'all',
  onCategoryChange 
}: BlogCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);

  // Update local state when prop changes
  useEffect(() => {
    setSelectedCategory(activeCategory);
  }, [activeCategory]);

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    onCategoryChange?.(slug);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => {
        const isActive = selectedCategory === category.slug;
        return (
          <button
            key={category.slug}
            onClick={() => handleCategoryClick(category.slug)}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${ 
              isActive 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'bg-white text-brand-600 border border-brand-200 hover:bg-brand-50 hover:shadow-sm'
            }`}
            aria-label={`Filter posts by ${category.name}`}
            type="button"
          >
            {category.name}
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
              isActive 
                ? 'bg-brand-500 text-white' 
                : 'bg-brand-100 text-brand-600'
            }`}>
              {category.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
