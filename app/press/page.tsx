import RestaurantLayout from "@/components/restaurant/Layout";
import { FadeIn } from '@/components/animations/MotionWrappers';
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import PressFeatureBanner, { PressFeatureContent } from '@/components/restaurant/sections/PressFeatureBanner';

type PressArticle = {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  href: string;
  ctaLabel: string;
  isExternal?: boolean;
  tags?: string[];
};

const HERO_PRESS_FEATURE: PressFeatureContent = {
  label: "In the press",
  eyebrow: "Country pub of the week",
  title: "Evening Standard spotlights The Old Crown, Girton",
  summary: "David Ellis praises our welcoming village pub, authentic Nepalese cooking, and ever-evolving menu in the Evening Standard's Country Pub of the Week column.",
  quote: "The changes keep locals coming back.",
  quoteAttribution: "David Ellis, Evening Standard",
  cta: {
    text: "Read the review",
    href: "https://www.standard.co.uk/going-out/bars/old-crown-girton-hotel-pub-review-b1249473.html",
  },
};

const FOOD_HYGIENE_CARD = {
  ratingValue: "5",
  ratingLabel: "Very Good",
  inspectedOn: "18 February 2025",
  href: "https://ratings.food.gov.uk/business/1750898/old-crown-girton?utm_source=chatgpt.com",
};

const PRESS_ARTICLES: PressArticle[] = [
  {
    id: "evening-standard-country-pub",
    title: "Evening Standard: Country Pub of the Week",
    summary: "David Ellis highlights our Nepalese kitchen, warm village welcome, and ever-evolving pub menu.",
    source: "Evening Standard",
    date: "19 December 2024",
    href: "https://www.standard.co.uk/going-out/bars/old-crown-girton-hotel-pub-review-b1249473.html",
    ctaLabel: "Full Evening Standard feature",
    isExternal: true,
    tags: ["Press Feature"],
  },
  {
    id: "cambs-edition-royal-makeover",
    title: "Cambs Edition: The Old Crown’s Royal Makeover",
    summary: "Cambridge Edition charts the revitalised interiors, bold Nepalese flavours, and the team leading the transformation.",
    source: "Cambridge Edition",
    date: "20 September 2024",
    href: "https://cambsedition.co.uk/food-drink/the-old-crown-a-royal-makeover/?utm_source=chatgpt.com",
    ctaLabel: "Read Cambs Edition feature",
    isExternal: true,
    tags: ["Lifestyle"],
  },
  {
    id: "press-blog-recap",
    title: "Behind the Feature: Evening Standard Spotlight",
    summary: "Our team shares the story behind the coverage and what it means for Cambridge's largest thatched pub.",
    source: "Old Crown Blog",
    date: "19 December 2024",
    href: "/blog/evening-standard-country-pub-of-the-week",
    ctaLabel: "Read the coverage recap",
    tags: ["Press & Media"],
  },
  {
    id: "cambridge-independent-reopening",
    title: "Cambridge Independent: Revamped Old Crown Reopens",
    summary: "Local press covers our launch party, refreshed spaces, and renewed community focus after the refurbishment.",
    source: "Cambridge Independent",
    date: "21 March 2018",
    href: "https://www.cambridgeindependent.co.uk/lifestyle/revamped-old-crown-in-girton-celebrates-reopening-with-launch-party-9052915/?utm_source=chatgpt.com",
    ctaLabel: "Read Cambridge Independent story",
    isExternal: true,
    tags: ["Community"],
  },
  {
    id: "largest-thatched-heritage",
    title: "England's Largest Thatched Pub Heritage",
    summary: "Dive into the centuries-old story of The Old Crown Girton, a favourite backdrop for visiting journalists.",
    source: "Old Crown Blog",
    date: "10 December 2024",
    href: "/blog/largest-thatched-pub-history",
    ctaLabel: "Explore the heritage feature",
    tags: ["Background"],
  },
  {
    id: "camra-guide",
    title: "CAMRA Guide: Old Crown Pub Profile",
    summary: "Cambridge CAMRA’s guide spotlights our historic building, expansive garden, and multi-space dining experience.",
    source: "Cambridge & District CAMRA",
    date: "CAMRA listing",
    href: "https://pubs.cambridge-camra.org.uk/viewnode.php?id=1636&utm_source=chatgpt.com",
    ctaLabel: "View CAMRA listing",
    isExternal: true,
    tags: ["Heritage"],
  },
  {
    id: "visit-south-cambs",
    title: "Visit South Cambs: Hospitality Spotlight",
    summary: "South Cambridgeshire’s visitor guide features Old Crown Girton as a must-visit hospitality destination.",
    source: "Visit South Cambs",
    date: "Updated 11 September 2025",
    href: "https://visitsouthcambs.co.uk/hospitality/old-crown-girton/?utm_source=chatgpt.com",
    ctaLabel: "View Visit South Cambs listing",
    isExternal: true,
    tags: ["Tourism"],
  },
];

const PRESS_FACTS = [
  "England's largest thatched pub, located just outside Cambridge in Girton village.",
  "Authentic Nepalese cuisine paired with British pub classics from our award-winning kitchen team.",
  "Family-friendly, dog-welcoming venue with spacious garden, private dining areas, and live sports.",
  "Featured as the Evening Standard's \"Country Pub of the Week\".",
];

const MEDIA_CONTACT = {
  email: "oldcrown@lapeninns.com",
  phone: "01223 277217",
  address: "89 High Street, Girton, Cambridge, CB3 0QD",
};

export const metadata = getSEOTags({
  title: "Press & Media | Old Crown Girton - Evening Standard Feature & Media Resources",
  description: "Explore press coverage of The Old Crown Girton, including our Evening Standard feature, media highlights, and press enquiry information for journalists.",
  keywords: [
    "Old Crown Girton press",
    "Cambridge pub media coverage",
    "Evening Standard country pub of the week",
    "Nepalese restaurant press kit",
    "Girton thatched pub media resources",
  ],
  canonicalUrlRelative: "/press",
  openGraph: {
    title: "Press & Media | Old Crown Girton",
    description: "Discover media coverage, press resources, and contact details for Old Crown Girton's historic thatched pub.",
    url: "https://oldcrowngirton.com//press",
  },
});

export default function PressPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          html:focus-within{scroll-behavior:auto!important}
        }
      ` }} />
      <RestaurantLayout>
        {renderSchemaTags([
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://oldcrowngirton.com//press#webpage",
            "name": "Press & Media - Old Crown Girton",
            "description": "Media coverage, press resources, and contact information for The Old Crown Girton.",
            "url": "https://oldcrowngirton.com//press",
            "isPartOf": {
              "@type": "WebSite",
              "name": "Old Crown Girton",
              "url": "https://oldcrowngirton.com/"
            },
            "about": {
              "@type": "LocalBusiness",
              "name": "Old Crown Girton",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": MEDIA_CONTACT.address,
                "addressLocality": "Girton",
                "addressRegion": "Cambridgeshire",
                "postalCode": "CB3 0QD",
                "addressCountry": "GB"
              }
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://oldcrowngirton.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Press & Media",
                "item": "https://oldcrowngirton.com//press"
              }
            ]
          }
        ])}

        <section
          className="relative bg-gradient-to-br from-brand-600 to-brand-800 text-white py-10 md:py-16"
          aria-labelledby="press-hero-heading"
        >
          <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
          <FadeIn>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex justify-center items-center gap-2 text-sm text-brand-100">
                  <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="text-brand-50 font-medium">Press &amp; Media</li>
                </ol>
              </nav>
              <h1 id="press-hero-heading" className="text-2xl md:text-3xl font-display font-bold text-white mb-3 leading-tight">
                Press &amp; Media
              </h1>
              <p className="text-base md:text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
                Explore recent media coverage, grab key facts, and contact our team for interviews, imagery, and story angles about England&apos;s largest thatched pub.
              </p>
            </div>
          </FadeIn>
        </section>

        <main className="space-y-16 bg-white pb-16">
          <FadeIn>
            <section className="pt-12" aria-labelledby="food-hygiene-heading">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card bg-brand-700 text-white shadow-xl border border-brand-600">
                  <div className="card-body gap-6 md:gap-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
                      <div className="flex items-start md:items-center gap-5">
                        <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-white text-brand-700 font-display text-3xl font-bold">
                          {FOOD_HYGIENE_CARD.ratingValue}
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-brand-200 font-semibold">
                            Food Standards Agency
                          </p>
                          <h2 id="food-hygiene-heading" className="text-xl md:text-2xl font-display font-bold leading-snug">
                            Food Hygiene Rating: {FOOD_HYGIENE_CARD.ratingValue} ({FOOD_HYGIENE_CARD.ratingLabel})
                          </h2>
                          <p className="mt-2 text-brand-100 text-sm md:text-base leading-relaxed">
                            Official inspection completed on {FOOD_HYGIENE_CARD.inspectedOn}. View the full report for detailed hygiene, structure, and management scores.
                          </p>
                        </div>
                      </div>
                      <a
                        href={FOOD_HYGIENE_CARD.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline border-white text-white hover:bg-white/10 hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700"
                        aria-label="View Old Crown Girton Food Standards Agency hygiene rating (opens in new tab)"
                        style={{ touchAction: 'manipulation' }}
                      >
                        View rating ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>

          <FadeIn>
            <PressFeatureBanner content={HERO_PRESS_FEATURE} />
          </FadeIn>

          <FadeIn>
            <section className="py-12" aria-labelledby="press-highlights-heading">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                  <div>
                    <h2 id="press-highlights-heading" className="text-2xl md:text-3xl font-display font-bold text-brand-700">
                      Media Highlights
                    </h2>
                    <p className="mt-2 text-brand-600 max-w-2xl">
                      Recent coverage and background features worth sharing with your readers.
                    </p>
                  </div>
                  <div>
                    <span className="badge badge-accent badge-outline text-sm">Updated December 2024</span>
                  </div>
                </div>

                <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {PRESS_ARTICLES.map((article) => {
                    const Tag = article.isExternal ? 'a' : Link;
                    const tagProps = article.isExternal
                      ? {
                          href: article.href,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : { href: article.href };

                    return (
                      <article
                        key={article.id}
                        className="card bg-brand-50 text-brand-700 shadow-md border border-brand-100 transition-all duration-200 hover:shadow-xl focus-within:shadow-xl"
                      >
                        <div className="card-body space-y-4">
                          <div className="flex flex-wrap items-center gap-2 text-sm text-brand-500">
                            <span className="badge badge-outline">{article.source}</span>
                            <time dateTime={article.date} className="text-brand-400">
                              {article.date}
                            </time>
                            {article.tags?.map((tag) => (
                              <span key={tag} className="badge badge-sm badge-primary badge-outline">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-xl font-semibold leading-snug">
                            {article.title}
                          </h3>
                          <p className="text-sm text-brand-600 leading-relaxed">
                            {article.summary}
                          </p>
                          <Tag
                            {...tagProps}
                            className="btn btn-ghost justify-start px-0 text-brand-700 hover:text-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                            aria-label={`${article.ctaLabel} (${article.source})`}
                            style={{ touchAction: 'manipulation' }}
                          >
                            {article.ctaLabel}
                            <span aria-hidden="true" className="ml-2">↗</span>
                          </Tag>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          </FadeIn>

          <FadeIn>
            <section className="py-16 bg-brand-50" aria-labelledby="press-kit-heading">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
                  <div>
                    <h2 id="press-kit-heading" className="text-2xl md:text-3xl font-display font-bold text-brand-700">
                      Press Kit &amp; Quick Facts
                    </h2>
                    <p className="mt-3 text-brand-600 leading-relaxed">
                      Need context for your story? Start with the essentials below or drop us a line for high-resolution imagery, quotes, and spokespeople availability.
                    </p>
                    <ul className="mt-6 space-y-3 text-brand-700">
                      {PRESS_FACTS.map((fact) => (
                        <li key={fact} className="flex items-start gap-3">
                          <span aria-hidden="true" className="mt-1 text-brand-500">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-brand-100 p-6 sm:p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-brand-700">Talk to the team</h3>
                      <p className="mt-2 text-sm text-brand-600 leading-relaxed">
                        We aim to reply to press enquiries within one working day. Please include your deadline, outlet, and angle so we can connect you with the right spokesperson.
                      </p>
                    </div>
                    <div className="space-y-2 text-sm text-brand-700">
                      <p><strong>Email:</strong> <a href={`mailto:${MEDIA_CONTACT.email}`} className="link link-hover text-brand-600">{MEDIA_CONTACT.email}</a></p>
                      <p><strong>Phone:</strong> <a href={`tel:${MEDIA_CONTACT.phone.replace(/\s+/g, '')}`} className="link link-hover text-brand-600">{MEDIA_CONTACT.phone}</a></p>
                      <p><strong>Address:</strong> {MEDIA_CONTACT.address}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={`mailto:${MEDIA_CONTACT.email}?subject=Press enquiry: Old Crown Girton`}
                        className="btn bg-brand-700 text-white hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        style={{ touchAction: 'manipulation' }}
                      >
                        Email Press Team
                      </a>
                      <Link
                        href="/contact"
                        className="btn btn-outline border-brand-300 text-brand-700 hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        style={{ touchAction: 'manipulation' }}
                      >
                        Contact Page
                      </Link>
                    </div>
                    <div className="border border-dashed border-brand-200 rounded-xl p-4 text-sm text-brand-600 bg-brand-50/60">
                      <p className="font-medium text-brand-700 mb-1">Need imagery?</p>
                      <p>
                        We can supply exterior/interior photography and chef portraits sized for print or web. Mention your preferred format when you get in touch.
                      </p>
                    </div>
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
