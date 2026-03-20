'use client';

import React from 'react';
import { useMenuContent } from '../_content/useMenuContent';
import { MenuHeroSkeleton } from '@/components/skeletons/MenuSkeletons';
import {
  bannerButtonRecipe,
  pageHeroDescriptionRecipe,
  pageHeroInnerClassName,
  pageHeroOverlayClassName,
  pageHeroSectionRecipe,
  pageHeroTitleRecipe,
} from '@/src/design-system';

export default function MenuHero() {
  const content = useMenuContent();

  if (!content) {
    return <MenuHeroSkeleton />;
  }

  const { hero } = content;

  return (
    <section className={pageHeroSectionRecipe()}>
      <div className={pageHeroOverlayClassName}></div>
      <div className={pageHeroInnerClassName}>
        <h1 className={pageHeroTitleRecipe('mb-3')}>{hero.title}</h1>
        <p className={pageHeroDescriptionRecipe('mb-6')}>{hero.subtitle}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="/wakes-menu"
            className={bannerButtonRecipe('light', 'text-brand-900 hover:bg-brand-100')}
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
          >
            Wakes Menu
          </a>
          <a
            href="/takeaway-menu"
            className={bannerButtonRecipe('light')}
          >
            Takeaway Menu
          </a>
          <a
            href={hero.buttons.bookOnline.url}
            target={hero.buttons.bookOnline.target}
            rel="noopener noreferrer"
            className={bannerButtonRecipe('light')}
          >
            {hero.buttons.bookOnline.label}
          </a>
          <a
            href={hero.buttons.orderTakeaway.url}
            className={bannerButtonRecipe('light')}
          >
            {hero.buttons.orderTakeaway.label}
          </a>
        </div>
      </div>
    </section>
  );
}
