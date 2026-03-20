export const revalidate = 300;

import { renderSchemaTags } from '@/libs/seo';
import type { PressFeatureContent } from '@/components/restaurant/sections/PressFeatureBanner';
import { getMarketingSmart, getContentSmart } from '@/src/lib/data/server-loader';
import { HOMEPAGE_FAQ_ITEMS } from '@/src/lib/site/homepage';
import { buildFaqSchema, buildWebPageSchema } from '@/src/lib/seo/schema';
import { siteMetadata } from '@/src/lib/site/site';
import React from 'react';
import dynamic from 'next/dynamic';

// Optimized dynamic import with SSR enabled and loading fallback
import { NavbarSkeleton, HeroSkeleton } from '@/components/skeletons/HomeSkeletons';

const ClientHomeContent = dynamic(() => import('@/components/ClientHomeContent'), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen bg-neutral-50">
      <NavbarSkeleton />
      <main className="pt-16">
        <HeroSkeleton />
      </main>
    </div>
  )
});

const HOMEPAGE_FAQ_SCHEMA = buildFaqSchema(HOMEPAGE_FAQ_ITEMS);

function shouldKeepHomeSchemaEntry(entry: Record<string, any>) {
  const schemaType = entry?.['@type'];
  return schemaType !== 'Restaurant' && schemaType !== 'LocalBusiness';
}

function HomePageContent({
  quickLinks,
  ctaSection,
  ctaButtons,
  pressFeature,
  schemaEntries,
  slideshow,
  ariaLabels,
  content
}: {
  quickLinks: any[];
  ctaSection: any;
  ctaButtons: any[];
  pressFeature?: PressFeatureContent | null;
  slideshow?: {
    slides: any[];
    settings?: {
      autoplay?: boolean;
      intervalMs?: number;
      sessionSize?: number;
    };
  } | null;
  ariaLabels?: Record<string, string>;
  schemaEntries?: Record<string, any>[];
  content?: any;
}) {
  return (
    <>
      {schemaEntries && schemaEntries.length > 0 ? renderSchemaTags(schemaEntries) : null}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          html:focus-within{scroll-behavior:auto!important}
        }
      ` }} />
      <ClientHomeContent
        quickLinks={quickLinks}
        ctaSection={ctaSection}
        ctaButtons={ctaButtons}
        pressFeature={pressFeature}
        slideshow={slideshow ? {
          slides: slideshow.slides ?? [],
          settings: slideshow.settings ?? {}
        } : null}
        ariaLabels={ariaLabels}
        content={content}
      />
    </>
  );
}

export default async function Page() {
  // Load content data server-side in parallel for faster TTFB
  const [m, content] = await Promise.all([
    getMarketingSmart(),
    getContentSmart()
  ]);

  const labels = m.buttons || {};

  // Home page content
  const homeContent = content.pages.home;
  const quickLinks = homeContent.sections.quickLinks || [];
  const ctaSection = (homeContent.sections as any).cta;
  const pressFeatureContent = (homeContent.sections as any).pressFeature;
  const pressFeature = pressFeatureContent || null;
  const schemaEntries = [
    buildWebPageSchema({
      path: '/',
      title: siteMetadata.title,
      description: siteMetadata.description,
    }),
    ...(Array.isArray(homeContent.seo?.schemas)
      ? homeContent.seo.schemas.filter(shouldKeepHomeSchemaEntry)
      : []),
    HOMEPAGE_FAQ_SCHEMA,
  ];
  const rawSlideshow = content.components?.slideshow;
  const slideshowContent = rawSlideshow
    ? {
      slides: Array.isArray(rawSlideshow.slides) ? rawSlideshow.slides : [],
      settings: rawSlideshow.settings ?? {}
    }
    : null;
  const ariaLabels = content.global?.accessibility?.ariaLabels ?? {};

  // Process CTA buttons with label fallbacks
  const ctaButtons = ctaSection?.buttons?.map((button: any) => ({
    ...button,
    text: button.key && labels[button.key] ? labels[button.key] : button.text
  })) || [];

  return (
    <HomePageContent
      quickLinks={quickLinks}
      ctaSection={ctaSection}
      ctaButtons={ctaButtons}
      pressFeature={pressFeature}
      slideshow={slideshowContent}
      ariaLabels={ariaLabels}
      schemaEntries={schemaEntries}
      content={content}
    />
  );
}
