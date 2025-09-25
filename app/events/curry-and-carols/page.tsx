import RestaurantLayout from "@/components/restaurant/Layout";
import { FadeIn, FadeInUp, MotionLinkButton } from "@/components/animations/MotionWrappers";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import Link from "@/lib/debugLink";
import { getContactInfo } from "@/lib/restaurantData";

export const metadata = getSEOTags({
  title: "Curry & Carols 2025 | Old Crown Girton – Coming Soon",
  description:
    "Curry & Carols returns to The Old Crown Girton on 16 & 17 December 2025. £35 per guest for a festive Nepalese banquet with live carols. Join the waitlist.",
  keywords: [
    "Curry and Carols",
    "Old Crown Girton events",
    "Christmas events Cambridge",
    "Girton festive dining",
    "Curry night Cambridge",
    "Carols night Cambridge",
  ],
  canonicalUrlRelative: "/events/curry-and-carols",
  openGraph: {
    title: "Curry & Carols at The Old Crown Girton – December 2025",
    description:
      "Two festive evenings of Nepalese curry and live carols on 16 & 17 December 2025. £35 per guest – register your interest at The Old Crown Girton.",
    url: "https://oldcrowngirton.com/events/curry-and-carols",
  },
});

export default function CurryAndCarolsPage() {
  const contact = getContactInfo();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Curry & Carols 2025 at The Old Crown Girton",
      description:
        "Festive Curry & Carols evenings featuring a Nepalese banquet and live carollers on 16 and 17 December 2025.",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      startDate: "2025-12-16T18:00:00+00:00",
      endDate: "2025-12-18T00:00:00+00:00",
      eventSchedule: [
        {
          "@type": "Schedule",
          startDate: "2025-12-16",
          endDate: "2025-12-16",
          startTime: "18:00",
          endTime: "22:00",
        },
        {
          "@type": "Schedule",
          startDate: "2025-12-17",
          endDate: "2025-12-17",
          startTime: "18:00",
          endTime: "22:00",
        },
      ],
      location: {
        "@type": "Place",
        name: "The Old Crown Girton",
        address: {
          "@type": "PostalAddress",
          streetAddress: contact.address.street,
          addressLocality: contact.address.city,
          addressRegion: "Cambridgeshire",
          postalCode: contact.address.postcode,
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
        priceCurrency: "GBP",
        price: "35",
        availabilityStarts: "2025-09-01",
        availability: "https://schema.org/PreOrder",
        url: "https://oldcrowngirton.com/events/curry-and-carols",
        description: "Register interest for Curry & Carols 2025 at The Old Crown Girton.",
      },
      performer: {
        "@type": "MusicGroup",
        name: "Live Carol Singers",
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
            { name: "Events", url: "https://oldcrowngirton.com/events" },
            { name: "Curry & Carols", url: "https://oldcrowngirton.com/events/curry-and-carols" },
          ]}
          page="curry-and-carols"
        />

        <section
          className="relative bg-gradient-to-br from-brand-700 via-crimson-600 to-cardamom-700 text-white py-16 md:py-24"
          aria-labelledby="curry-carols-hero-heading"
        >
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <FadeIn>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 rounded-full backdrop-blur touch-manipulation">
                <span aria-hidden="true" role="img">🎄</span>
                <span className="text-sm font-semibold tracking-wide uppercase">Coming Soon</span>
                <span className="sr-only">Curry &amp; Carols announcement</span>
              </span>
            </FadeIn>
            <FadeInUp>
              <h1 id="curry-carols-hero-heading" className="text-3xl md:text-5xl font-display font-bold leading-tight">
                Curry &amp; Carols 2025 at The Old Crown Girton
              </h1>
            </FadeInUp>
            <FadeInUp>
              <p className="text-lg md:text-xl text-neutral-100 max-w-3xl mx-auto leading-relaxed">
                Two sparkling nights of Nepalese curry, mulled cheer, and live carols under our thatched roof. Join us on <strong>16 &amp; 17 December 2025</strong> for a £35 per guest festive feast that warms every chorus.
              </p>
            </FadeInUp>
            <FadeInUp>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <MotionLinkButton
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-brand-800 font-semibold shadow-lg hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-300 focus-visible:ring-offset-brand-700"
                  ariaLabel="Register your interest for Curry and Carols via the contact form"
                >
                  <span aria-hidden="true" role="img">📝</span>
                  Register Interest
                </MotionLinkButton>
                <MotionLinkButton
                  href={`tel:${contact.phone.primary.replace(/\s+/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent-500 text-neutral-900 font-semibold shadow-lg hover:bg-accent-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-200 focus-visible:ring-offset-brand-700"
                  ariaLabel="Call the Old Crown Girton team"
                >
                  <span aria-hidden="true" role="img">📞</span>
                  Call the Team
                </MotionLinkButton>
              </div>
            </FadeInUp>
            <FadeIn>
              <p className="text-sm uppercase tracking-wide text-white/90">
                 stay tuned for the full menu reveal.
              </p>
            </FadeIn>
            <FadeIn>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-neutral-100/90">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
                  <span aria-hidden="true" role="img">📍</span>
                  Girton, Cambridge
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
                  <span aria-hidden="true" role="img">🎶</span>
                  Live carols both evenings
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
                  <span aria-hidden="true" role="img">🍛</span>
                  Nepalese festive banquet
                </span>
              </div>
            </FadeIn>
          </div>
        </section>

        <main className="bg-white">
          <section className="py-16 md:py-20" aria-labelledby="curry-carols-details-heading">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn>
                <div className="max-w-3xl space-y-4 mb-12">
                  <h2 id="curry-carols-details-heading" className="text-3xl md:text-4xl font-display font-bold text-brand-800">
                    What to expect across both evenings
                  </h2>
                  <p className="text-lg text-brand-600 leading-relaxed">
                    We&apos;re keeping the full setlist under wraps for now, but here&apos;s a taste of what makes Curry &amp; Carols Cambridge&apos;s most joyful December tradition.
                  </p>
                </div>
              </FadeIn>
              <FadeInUp>
                <div className="grid gap-8 md:grid-cols-3">
                  {[
                    {
                      icon: "🍽️",
                      title: "£35 festive banquet",
                      description:
                        "Seasonal small plates, hearty mains, and sweet treats blending Nepalese spice with classic British comfort—crafted for lingering table conversations.",
                    },
                    {
                      icon: "🎤",
                      title: "Carols you can sing along to",
                      description:
                        "Live performers guide the room through winter favourites and a few uplifting surprises. Expect lyric cards, warm lighting, and plenty of smiles.",
                    },
                    {
                      icon: "🍷",
                      title: "Mulled pairings & mocktails",
                      description:
                        "Our bar team is preparing limited-edition pours, zero-proof options, and warming tipples to keep every guest toasty between verses.",
                    },
                  ].map((card) => (
                    <article
                      key={card.title}
                      className="rounded-2xl border border-brand-100 bg-neutral-50 p-8 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl focus-within:shadow-2xl"
                    >
                      <div
                        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-2xl"
                        aria-hidden="true"
                      >
                        {card.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-brand-700 mb-3">{card.title}</h3>
                      <p className="text-brand-600 leading-relaxed">{card.description}</p>
                    </article>
                  ))}
                </div>
              </FadeInUp>
            </div>
          </section>

          <section className="bg-brand-50 py-16 md:py-20" aria-labelledby="curry-carols-placeholder-heading">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-2 lg:items-center">
              <FadeIn>
                <figure className="relative w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-brand-200 bg-white/80 shadow-inner flex items-center justify-center text-center px-6">
                  <span className="sr-only">Curry &amp; Carols photography coming soon</span>
                  <div aria-hidden="true" className="space-y-3">
                    <div className="mx-auto h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center text-3xl">📸</div>
                    <p className="text-brand-500 font-semibold tracking-wide uppercase">Imagery on the way…</p>
                    <p className="text-brand-400 max-w-sm mx-auto">
                      We&apos;ll drop brand-new photos of the Curry &amp; Carols setup once styling is locked. Check back soon for a sneak peek.
                    </p>
                  </div>
                </figure>
              </FadeIn>
              <FadeInUp>
                <div className="space-y-6">
                  <h2 id="curry-carols-placeholder-heading" className="text-3xl font-display font-bold text-brand-800">
                    Reserve your spot before seats go live
                  </h2>
                  <p className="text-lg text-brand-600 leading-relaxed">
                    Priority booking opens to our mailing list first. Drop us a note and we&apos;ll make sure you&apos;re the earliest to pick your table and mix of guests for either night.
                  </p>
                  <ul className="space-y-4 text-brand-600">
                    <li className="flex items-start gap-3">
                      <span aria-hidden="true" className="text-2xl">🗓️</span>
                      <div>
                        <strong>Dates:</strong> Tuesday 16 &amp; Wednesday 17 December 2025
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span aria-hidden="true" className="text-2xl">💷</span>
                      <div>
                        <strong>Price:</strong> £35 per guest 
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span aria-hidden="true" className="text-2xl">👥</span>
                      <div>
                        <strong>Ideal for:</strong> Work dos, friend groups, community choirs, and families wanting a cosy festive night out.
                      </div>
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`mailto:${contact.email.primary}?subject=Curry%20and%20Carols%202025%20Interest`}
                      className="inline-flex items-center gap-2 rounded-lg border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors duration-200 hover:border-brand-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-50"
                    >
                      <span aria-hidden="true" role="img">✉️</span>
                      Email the team
                    </Link>
                    <Link
                      href="/book-a-table"
                      className="inline-flex items-center gap-2 rounded-lg border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors duration-200 hover:border-brand-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-50"
                    >
                      <span aria-hidden="true" role="img">🪑</span>
                      Explore dining bookings
                    </Link>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </section>

          <section className="py-16 md:py-20" aria-labelledby="curry-carols-questions-heading">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn>
                <div className="space-y-6 text-center">
                  <h2 id="curry-carols-questions-heading" className="text-3xl font-display font-bold text-brand-800">
                    Questions while you wait?
                  </h2>
                  <p className="text-lg text-brand-600 leading-relaxed">
                    Our team is happy to chat through dietary needs, group sizes, or corporate hire ideas so your evening feels effortless when tickets drop.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 text-brand-700">
                    <div className="flex items-center gap-2 justify-center">
                      <span aria-hidden="true" role="img">📞</span>
                      <Link href={`tel:${contact.phone.primary.replace(/\s+/g, "")}`} className="underline font-semibold">
                        {contact.phone.primary}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <span aria-hidden="true" role="img">✉️</span>
                      <Link href={`mailto:${contact.email.primary}`} className="underline font-semibold">
                        {contact.email.primary}
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>
        </main>
      </RestaurantLayout>
    </>
  );
}
