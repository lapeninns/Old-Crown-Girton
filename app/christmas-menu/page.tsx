import RestaurantLayout from "@/components/restaurant/Layout";
import { FadeIn, FadeInUp, MotionLinkButton } from "@/components/animations/MotionWrappers";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import Link from "@/lib/debugLink";
import { getContactInfo } from "@/lib/restaurantData";

export const metadata = getSEOTags({
  title: "Christmas Menu 2025 | Old Crown Girton – Cambridge Festive Dining",
  description:
    "Discover Old Crown Girton's Cambridge Christmas menu. Our 2025 festive dining experience is coming soon – reserve interest for Girton's best Christmas menu.",
  keywords: [
    "Cambridge Christmas menu",
    "Christmas menu",
    "Old Crown Girton",
    "Girton",
    "best Christmas menu 2025",
    "Christmas dining Cambridge",
    "festive menu Girton",
  ],
  canonicalUrlRelative: "/christmas-menu",
  openGraph: {
    title: "Old Crown Girton Christmas Menu 2025 – Coming Soon",
    description:
      "Celebrate in Cambridge with the Old Crown Girton Christmas menu. Join the waitlist for Girton's most talked-about festive dining experience.",
    url: "https://oldcrowngirton.com/christmas-menu",
  },
});

const highlightCards = [
  {
    icon: "🎄",
    title: "Cambridge's Festive Centrepiece",
    body: "We're crafting a Christmas dining journey that honours our Girton roots while embracing the sparkle of Cambridge celebrations. Expect roaring fires, garlands, and a soundtrack of laughter.",
  },
  {
    icon: "🍽️",
    title: "Nepalese Spice Meets British Comfort",
    body: "Seasonal courses will weave Himalayan warmth with British comfort classics, delivering a Cambridge Christmas experience that feels unmistakably Old Crown Girton.",
  },
  {
    icon: "🥂",
    title: "Toast Worthy Moments",
    body: "Our bar team is crafting celebratory pairings so every toast feels polished, even before we unveil the full Christmas line-up.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Gather the Whole Village",
    body: "Private snug bookings, family-style sharing boards, and accessible seating mean every Girton celebration feels effortless and inclusive.",
  },
] as const;

const assurancePoints = [
  {
    icon: "✅",
    title: "Flexible dietary swaps",
    description: "Gluten-free, vegan, and low-spice alternatives ready without sacrificing flavour.",
  },
  {
    icon: "📞",
    title: "Concierge booking support",
    description: "Dedicated team helps organise large parties, deposits, and bespoke timings.",
  },
  {
    icon: "🎁",
    title: "Corporate & private hire ready",
    description: "Impress clients or reward teams with tailored menus and AV support in Girton's landmark pub.",
  },
] as const;

export default async function ChristmasMenuPage() {
  const contact = getContactInfo();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Old Crown Girton Christmas Menu 2025",
      description:
        "Celebrate the season in Girton, Cambridge with the Old Crown Girton Christmas menu. Register interest now for our 2025 festive dining experience.",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      startDate: "2025-11-24",
      endDate: "2025-12-26",
      location: {
        "@type": "Place",
        name: "The Old Crown Girton",
        address: {
          "@type": "PostalAddress",
          streetAddress: `${contact.address.street}`,
          addressLocality: `${contact.address.city}`,
          addressRegion: "Cambridgeshire",
          postalCode: `${contact.address.postcode}`,
          addressCountry: "GB",
        },
      },
      organizer: {
        "@type": "Restaurant",
        name: "The Old Crown Girton",
        url: "https://oldcrowngirton.com",
        telephone: contact.phone.primary,
        email: contact.email.primary,
      },
      image: [
        "https://oldcrowngirton.com/opengraph-image.png",
        "https://oldcrowngirton.com/twitter-image.png",
      ],
      offers: {
        "@type": "Offer",
        availabilityStarts: "2025-08-15",
        price: "0",
        priceCurrency: "GBP",
        url: "https://oldcrowngirton.com/christmas-menu",
        description: "Register interest for the Old Crown Girton Christmas dining experience.",
      },
    },
  ];

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "@media (prefers-reduced-motion: reduce) {*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important} html:focus-within{scroll-behavior:auto!important}}",
        }}
      />
      <RestaurantLayout>
        {renderSchemaTags(structuredData)}
        <SchemaInjector
          type="breadcrumb"
          data={[
            { name: "Home", url: "https://oldcrowngirton.com/" },
            { name: "Christmas Menu", url: "https://oldcrowngirton.com/christmas-menu" },
          ]}
          page="christmas-menu"
        />

        <section
          className="relative bg-gradient-to-br from-brand-700 via-crimson-600 to-cardamom-700 text-white py-16 md:py-24"
          aria-labelledby="christmas-hero-heading"
        >
          <div className="absolute inset-0 bg-black/20" aria-hidden="true"></div>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 rounded-full backdrop-blur">
                <span aria-hidden="true" role="img">✨</span>
                <span className="text-sm font-semibold tracking-wide uppercase">Coming Soon</span>
                <span className="sr-only">Christmas menu announcement</span>
              </div>
            </FadeIn>
            <FadeInUp>
              <h1 id="christmas-hero-heading" className="text-3xl md:text-5xl font-display font-bold leading-tight">
                Old Crown Girton Christmas Menu 2025 is on its way
              </h1>
            </FadeInUp>
            <FadeInUp>
              <p className="text-lg md:text-xl text-neutral-100 max-w-3xl mx-auto leading-relaxed">
                Cambridge&rsquo;s favourite thatched pub is elevating festive dining with a brand-new Christmas menu. Think Himalayan warmth, British comfort, and the most inviting Girton celebrations. Register your interest today to experience the best Christmas menu 2025 has to offer.
              </p>
            </FadeInUp>
            <FadeInUp>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <MotionLinkButton
                  href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-brand-800 font-semibold shadow-lg hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-300 focus-visible:ring-offset-brand-700"
                  ariaLabel="Book your table online"
                >
                  <span aria-hidden="true" role="img">🗓️</span>
                  Book Your Table Online
                </MotionLinkButton>
                <MotionLinkButton
                  href={`tel:${contact.phone.primary.replace(/\s+/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent-500 text-neutral-900 font-semibold shadow-lg hover:bg-accent-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-200 focus-visible:ring-offset-brand-700"
                  ariaLabel="Book your table via call"
                >
                  <span aria-hidden="true" role="img">📞</span>
                  Book Your Table via Call
                </MotionLinkButton>
              </div>
            </FadeInUp>
            <FadeInUp>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
                Only a few seats remaining &mdash; secure yours today.
              </p>
            </FadeInUp>
            <FadeIn>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-neutral-100/90">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
                  <span aria-hidden="true" role="img">📍</span>
                  Girton, Cambridge
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
                  <span aria-hidden="true" role="img">🎉</span>
                  Festive lunches & dinners
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
                  <span aria-hidden="true" role="img">✨</span>
                  Limited priority bookings
                </span>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20" aria-labelledby="festive-highlights-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <h2 id="festive-highlights-heading" className="text-3xl md:text-4xl font-display font-bold text-brand-800">
                  What to savour from our Cambridge Christmas menu
                </h2>
                <p className="text-lg text-brand-600 leading-relaxed">
                  We are blending centuries of Old Crown Girton hospitality with bold Nepalese flavour for a festive season that feels unmistakably Cambridge.
                </p>
              </div>
            </FadeIn>
            <FadeInUp>
              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                {highlightCards.map((card) => (
                  <article
                    key={card.title}
                    className="h-full rounded-2xl border border-brand-100 bg-neutral-50 p-8 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl focus-within:shadow-2xl"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-2xl" aria-hidden="true">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-brand-700 mb-3">{card.title}</h3>
                    <p className="text-brand-600 leading-relaxed">{card.body}</p>
                  </article>
                ))}
              </div>
            </FadeInUp>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20" aria-labelledby="festive-support-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="grid gap-10 lg:grid-cols-2">
                <div className="space-y-6">
                  <h2 id="festive-support-heading" className="text-3xl md:text-4xl font-display font-bold text-brand-800">
                    Stay in the loop and get first dibs
                  </h2>
                  <p className="text-lg text-brand-600 leading-relaxed">
                    Drop us a line and we will share menu previews, booking windows, and exclusive Cambridge partner collaborations as soon as they launch.
                  </p>
                  <div className="flex flex-col gap-4">
                    <Link
                      href={`mailto:${contact.email.bookings}`}
                      className="inline-flex items-center gap-3 rounded-lg bg-brand-700 px-5 py-3 text-white shadow-lg transition hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-300"
                    >
                      <span aria-hidden="true" role="img">📧</span>
                      Email the festive team
                    </Link>
                    <Link
                      href={contact.address.google_maps_url}
                      className="inline-flex items-center gap-3 rounded-lg border border-brand-200 px-5 py-3 text-brand-700 hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-300"
                    >
                      <span aria-hidden="true" role="img">📍</span>
                      Visit Old Crown Girton
                    </Link>
                  </div>
                  <p className="text-sm text-brand-500 leading-relaxed">
                    Prefer a call? Ring us on <a className="font-semibold underline" href={`tel:${contact.phone.primary.replace(/\s+/g, "")}`}>{contact.phone.display}</a> and ask for the Christmas coordinator.
                  </p>
                </div>
                <div className="space-y-5">
                  {assurancePoints.map((point) => (
                    <div
                      key={point.title}
                      className="rounded-xl border border-brand-100 bg-brand-50/60 p-6 shadow-md"
                    >
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl" aria-hidden="true">
                        {point.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-brand-700">{point.title}</h3>
                      <p className="text-brand-600 leading-relaxed">{point.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </RestaurantLayout>
    </>
  );
}
