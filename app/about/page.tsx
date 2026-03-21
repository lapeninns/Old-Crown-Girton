/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import { getMarketingSmart, getContentSmart } from '@/src/lib/data/server-loader';
import Link from '@/lib/debugLink';
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import { buildBreadcrumbSchema, buildFaqSchema, buildWebPageSchema } from '@/src/lib/seo/schema';
import { FadeIn } from '@/components/animations/MotionWrappers';
import dynamic from 'next/dynamic';
import {
  buttonRecipe,
  panelTextRecipe,
  pageHeroDescriptionRecipe,
  pageHeroEyebrowRecipe,
  pageHeroInnerClassName,
  pageHeroOverlayClassName,
  pageHeroSectionRecipe,
  pageHeroTitleRecipe,
  sectionInnerClassName,
  sectionShellClassName,
} from '@/src/design-system';

// SEO Metadata
export const metadata = getSEOTags({
  title: "About Old Crown Girton | Historic Pub Near Cambridge",
  description: "Learn about Old Crown Girton, a historic pub near Cambridge serving authentic Nepalese food and British pub classics with free parking and welcoming spaces.",
  keywords: ["Old Crown Girton", "largest thatched pub", "Nepalese restaurant Cambridge", "Girton pub", "historic pub", "British pub classics"],
  canonicalUrlRelative: "/about",
  openGraph: {
    title: "About Old Crown Girton | Historic Pub Near Cambridge",
    description: "Learn about Old Crown Girton, a historic pub near Cambridge serving authentic Nepalese food and British pub classics with free parking and welcoming spaces.",
    url: "https://oldcrowngirton.com/about",
  },
});

const ABOUT_PAGE_TITLE = "About Old Crown Girton | Historic Pub Near Cambridge";
const ABOUT_PAGE_DESCRIPTION =
  "Learn about Old Crown Girton, a historic pub near Cambridge serving authentic Nepalese food and British pub classics with free parking and welcoming spaces.";

const ABOUT_FAQ_ITEMS = [
  {
    question: 'What makes Old Crown Girton different from other pubs near Cambridge?',
    answer:
      'Old Crown Girton combines the character of a historic thatched pub with authentic Nepalese dishes, British pub classics, family-friendly hospitality, and free parking just outside Cambridge.',
  },
  {
    question: 'Do you only serve Nepalese food?',
    answer:
      'No. Alongside authentic Nepalese dishes, we also serve British pub favourites, which makes the menu work well for mixed groups and different tastes.',
  },
  {
    question: 'Is Old Crown Girton suitable for everyday dining as well as special occasions?',
    answer:
      'Yes. Guests visit for casual meals, family gatherings, drinks, sports, and larger celebrations, so the venue works for both everyday visits and planned occasions.',
  },
];

const ABOUT_VALUE_POINTS = [
  {
    title: 'Historic setting with real character',
    body: "England's largest thatched pub gives Old Crown a genuine sense of place before the food even arrives.",
  },
  {
    title: 'Food that broadens the choice',
    body: 'Authentic Nepalese dishes and British pub classics make the venue easier for mixed groups to agree on.',
  },
  {
    title: 'Practical hospitality',
    body: 'Free parking, family-friendly spaces, and flexible hosting help turn curiosity into a confident booking.',
  },
];

// Dynamic imports for non-LCP sections
const StoryTimelineSection = dynamic(() => import("@/components/restaurant/sections/StoryTimelineSection"));

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
          buildFaqSchema(ABOUT_FAQ_ITEMS),
        ])}

        {/* Hero Section with motion animation */}
        <section className={pageHeroSectionRecipe()} aria-labelledby="about-hero-heading">
          <div className={pageHeroOverlayClassName}></div>
          <FadeIn>
            <div className={pageHeroInnerClassName}>
              <p className={pageHeroEyebrowRecipe()}>
                Why Old Crown is worth choosing
              </p>
              <h1 id="about-hero-heading" className={pageHeroTitleRecipe('mb-3')}>
                {aboutContent.hero.title}
              </h1>
              <p className={pageHeroDescriptionRecipe('mt-4')}>
                {aboutContent.hero.subtitle}
              </p>
            </div>
          </FadeIn>
        </section>

        <main className="space-y-0 bg-white">
          <FadeIn>
            <section className={`bg-white ${sectionShellClassName}`} aria-labelledby="about-value-heading">
              <div className={sectionInnerClassName}>
                <div className="max-w-3xl">
                  <h2 id="about-value-heading" className="text-3xl font-display font-bold text-brand-700">
                    More than heritage alone
                  </h2>
                  <p className={panelTextRecipe('mt-4')}>
                    The story matters, but it only converts if people can see why the place is useful now. Old Crown
                    works because it gives guests a distinctive setting, memorable food, and a visit that feels easy
                    to plan.
                  </p>
                </div>
                <div className="mt-10 grid gap-4 md:grid-cols-3">
                  {ABOUT_VALUE_POINTS.map((point) => (
                    <article key={point.title} className="rounded-3xl border border-brand-100 bg-brand-50 p-6 shadow-sm">
                      <h3 className="text-xl font-semibold text-brand-700">{point.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-brand-600">{point.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </FadeIn>

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
                <div className="rounded-[32px] bg-brand-700 px-6 py-10 text-white shadow-xl sm:px-10">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-100">Next step</p>
                  <h2 id="about-cta-heading" className="mt-3 text-3xl font-display font-bold">
                    {aboutContent.cta.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-brand-100 leading-7">
                    {aboutContent.cta.description}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/book-a-table" className={buttonRecipe({ variant: 'accent', size: 'md', className: 'text-stout-950' })}>
                      {labelBookOnline}
                    </Link>
                    <Link href="/events" className={buttonRecipe({ variant: 'outline', size: 'md', className: 'border-white text-white hover:bg-white/10' })}>
                      Plan an Event
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>
        </main>
      </RestaurantLayout>
    </>
  );
}
