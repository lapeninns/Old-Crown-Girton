'use client';

import React from 'react';
import { useMenuContent } from '../_content/useMenuContent';

export default function MenuHero() {
  const content = useMenuContent();
  
  if (!content) {
    return (
      <section className="py-8 bg-gradient-to-br from-stout-800 to-stout-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="flex items-center justify-center gap-3">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  const { hero } = content;
  
  return (
    <section className="py-8 bg-gradient-to-br from-stout-800 to-stout-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{hero.title}</h1>
        <p className="text-sm sm:text-base text-neutral-200 mb-4">{hero.subtitle}</p>
        <div className="flex items-center justify-center gap-3">
          <a 
            href={hero.buttons.bookOnline.url} 
            target={hero.buttons.bookOnline.target} 
            rel="noopener noreferrer" 
            className="bg-accent text-white font-semibold py-2 px-4 rounded-md text-sm"
          >
            {hero.buttons.bookOnline.label}
          </a>
          <a 
            href={hero.buttons.orderTakeaway.url} 
            className="bg-crimson-500 text-white font-semibold py-2 px-4 rounded-md text-sm"
          >
            {hero.buttons.orderTakeaway.label}
          </a>
        </div>
      </div>
    </section>
  );
}