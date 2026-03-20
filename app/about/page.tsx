/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import { getMarketingSmart, getContentSmart } from '@/src/lib/data/server-loader';
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import { buildBreadcrumbSchema, buildWebPageSchema } from '@/src/lib/seo/schema';
import { FadeIn } from '@/components/animations/MotionWrappers';
import dynamic from 'next/dynamic';
import {
  pageHeroDescriptionRecipe,
  pageHeroInnerClassName,
  pageHeroOverlayClassName,
  pageHeroSectionRecipe,
  pageHeroTitleRecipe,
  sectionInnerClassName,
  sectionShellClassName,
} from '@/src/design-system';

// SEO Metadata
export const metadata = getSEOTags({
  title: "About Old Crown Girton - Largest Thatched Pub | Nepalese Restaurant Cambridge",
  description: "Historic thatched pub in Girton serving authentic Nepalese cuisine and British pub classics. Discover our unique blend of heritage and hospitality.",
  keywords: ["Old Crown Girton", "largest thatched pub", "Nepalese restaurant Cambridge", "Girton pub", "historic pub", "British pub classics"],
  canonicalUrlRelative: "/about",
  openGraph: {
    title: "About Old Crown Girton - Historic Thatched Pub & Nepalese Kitchen",
    description: "Discover England's largest thatched pub in Girton serving authentic Nepalese cuisine and British pub classics.",
    url: "https://oldcrowngirton.com/about",
  },
});

const ABOUT_PAGE_TITLE = "About Old Crown Girton - Largest Thatched Pub | Nepalese Restaurant Cambridge";
const ABOUT_PAGE_DESCRIPTION =
  "Historic thatched pub in Girton serving authentic Nepalese cuisine and British pub classics. Discover our unique blend of heritage and hospitality.";

// Dynamic imports for non-LCP sections
const StoryTimelineSection = dynamic(() => import("@/components/restaurant/sections/StoryTimelineSection"));
const AboutCTASection = dynamic(() => import("@/components/restaurant/sections/AboutCTASection"));

export default async function AboutPage() {
  const m = await getMarketingSmart();
  const content = await getContentSmart();

  const labels = m.buttons || {};
  const labelBookOnline = labels.bookOnline || content.global.ui.buttons.bookOnline || 'Book Online';

  // About page content
  const aboutContent = content.pages.about;
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          html:focus-within{scroll-behavior:auto!important}
        }
      ` }} />
      <RestaurantLayout>
        {renderSchemaTags([
          buildWebPageSchema({
            path: '/about',
            title: ABOUT_PAGE_TITLE,
            description: ABOUT_PAGE_DESCRIPTION,
            type: 'AboutPage',
          }),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ])}

        {/* Hero Section with motion animation */}
        <section className={pageHeroSectionRecipe()} aria-labelledby="about-hero-heading">
          <div className={pageHeroOverlayClassName}></div>
          <FadeIn>
            <div className={pageHeroInnerClassName}>
              <h1 id="about-hero-heading" className={pageHeroTitleRecipe('mb-3')}>
                {aboutContent.hero.title}
              </h1>
              <p className={pageHeroDescriptionRecipe()}>
                {aboutContent.hero.subtitle}
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Main Content with progressive disclosure */}
        <main className="space-y-0">
          <FadeIn>
            <section className={`bg-white ${sectionShellClassName}`} aria-labelledby="story-timeline-heading">
              <div className={sectionInnerClassName}>
                <StoryTimelineSection
                  title={aboutContent.story.title}
                  introduction={aboutContent.story.introduction}
                  timeline={aboutContent.story.timeline}
                />
              </div>
            </section>
          </FadeIn>

          <FadeIn>
            <section className={`bg-brand-100 ${sectionShellClassName}`} aria-labelledby="about-cta-heading">
              <div className={sectionInnerClassName}>
                <AboutCTASection
                  title={aboutContent.cta.title}
                  description={aboutContent.cta.description}
                  buttonText={aboutContent.cta.button}
                  buttonHref="https://www.nabatable.com/restaurants/the-old-crown-girton/book"
                  buttonLabel={labelBookOnline}
                  contact={{
                    address: aboutContent.cta.contact.address
                  }}
                />
              </div>
            </section>
          </FadeIn>
        </main>
      </RestaurantLayout>
    </>
  );
}
