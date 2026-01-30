import RestaurantLayout from "@/components/restaurant/Layout";
import { FadeIn, FadeInUp, MotionLinkButton } from "@/components/animations/MotionWrappers";
import Link from "@/lib/debugLink";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import { getContactInfo } from "@/lib/restaurantData";

const BASE_COURSES = [
  {
    step: "1",
    title: "Select a sandwich",
    summary: "Each guest chooses one delicate finger sandwich on pillowy bread.",
    options: ["Egg & mayo", "Bacon & cheese"],
  },
  {
    step: "2",
    title: "Add our wings",
    summary: "Serve a warm, lightly spiced chicken wing alongside every plate.",
    options: ["Chicken wings"],
  },
  {
    step: "3",
    title: "Finish with a samosa",
    summary: "Guests choose the filling that suits them best.",
    options: ["Vegetable samosa", "Meat samosa"],
  },
];

const INCLUDED_EXTRAS = [
  {
    title: "Chicken pakora",
    description: "Freshly fried pakora with coriander chutney, prepared minutes before service.",
  },
  {
    title: "Tea or coffee",
    description: "Pots of freshly brewed tea or cafetiere coffee poured alongside dessert and speeches.",
  },
];

const contact = getContactInfo();

export const metadata = getSEOTags({
  title: "Wakes Buffet | Celebration of Life Catering | Old Crown Girton",
  description:
    "Plan a calm celebration of life with our £13-per-guest wakes buffet: one sandwich, chicken wings, a samosa, chicken pakora, and tea or coffee included.",
  keywords: [
    "wakes menu Cambridge",
    "celebration of life catering",
    "Old Crown Girton wakes",
    "funeral reception menu",
    "sandwich buffet Cambridge",
  ],
  canonicalUrlRelative: "/wakes-menu",
  openGraph: {
    title: "Wakes Buffet at The Old Crown Girton",
    description:
      "£13 per guest for a complete package: sandwich, chicken wings, samosa, chicken pakora, and tea or coffee.",
    url: "https://oldcrowngirton.com/wakes-menu",
  },
});

export default function WakesMenuPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Menu",
      name: "Old Crown Girton Wakes Menu",
      description:
        "Wakes and celebration of life catering at The Old Crown Girton with one sandwich, chicken wings, samosa, chicken pakora, and tea or coffee per guest.",
      url: "https://oldcrowngirton.com/wakes-menu",
      offers: {
        "@type": "Offer",
        price: "13.00",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStoreOnly",
      },
      provider: {
        "@type": "Restaurant",
        name: "The Old Crown Girton",
        telephone: contact.phone.primary,
        address: {
          "@type": "PostalAddress",
          streetAddress: contact.address.street,
          addressLocality: contact.address.city,
          postalCode: contact.address.postcode,
          addressCountry: "GB",
        },
      },
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: "Wakes Buffet",
          hasMenuItem: [
            {
              "@type": "MenuItem",
              name: "Sandwich choice",
              description: "Every guest selects one sandwich: egg & mayo or bacon & cheese. Included in the £13 wakes package.",
            },
            {
              "@type": "MenuItem",
              name: "Chicken wings",
              description: "Seasoned chicken wings served warm. Included in the £13 wakes package.",
            },
            {
              "@type": "MenuItem",
              name: "Samosa choice",
              description: "Every guest selects a vegetable or meat samosa. Included in the £13 wakes package.",
            },
            {
              "@type": "MenuItem",
              name: "Chicken pakora",
              description: "Freshly fried chicken pakora with coriander chutney. Included in the £13 wakes package.",
            },
            {
              "@type": "MenuItem",
              name: "Tea or coffee",
              description: "Pots of freshly brewed tea or cafetiere coffee. Included in the £13 wakes package.",
            },
          ],
        },
      ],
    },
  ];

  return (
    <RestaurantLayout>
      {renderSchemaTags(structuredData)}

      <section
        className="relative bg-gradient-to-br from-brand-700 via-crimson-600 to-cardamom-700 text-white py-16 md:py-24"
        aria-labelledby="wakes-menu-heading"
      >
        <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <FadeIn>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 rounded-full backdrop-blur">
              <span aria-hidden="true" role="img">🌿</span>
              <span className="text-sm font-semibold tracking-wide uppercase">Wakes & Celebrations of Life</span>
              <span className="sr-only">Discover our wakes menu</span>
            </span>
          </FadeIn>
          <FadeInUp>
            <h1 id="wakes-menu-heading" className="text-3xl md:text-5xl font-display font-bold leading-tight">
              A Quietly Considered Wakes Buffet
            </h1>
          </FadeInUp>
          <FadeInUp>
            <p className="text-lg md:text-xl text-neutral-100 max-w-3xl mx-auto leading-relaxed">
              Bring everyone together with a calm, £13-per-guest buffet prepared by the Old Crown kitchen. Each person receives a sandwich of their choice, a warm chicken wing, a vegetable or meat samosa, freshly fried chicken pakora, and tea or coffee—all included.
            </p>
          </FadeInUp>
          <FadeInUp>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-white/80">
              {[
                "£13 per guest · complete package",
                "Sandwich, wing, samosa, pakora & hot drink included",
                "Hosted in our dining rooms — no takeaway packaging",
              ].map((detail) => (
                <span
                  key={detail}
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm"
                >
                  <span aria-hidden="true" className="text-white/70">•</span>
                  {detail}
                </span>
              ))}
            </div>
          </FadeInUp>
          <FadeInUp>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <MotionLinkButton
                href={`tel:${contact.phone.primary.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-brand-800 font-semibold shadow-lg hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-300 focus-visible:ring-offset-brand-700"
                style={{ touchAction: "manipulation", WebkitTapHighlightColor: "rgba(0,0,0,0)" }}
                ariaLabel="Call to discuss wakes catering at the Old Crown Girton"
              >
                <span aria-hidden="true" role="img">📞</span>
                Call to plan your wake
              </MotionLinkButton>
              <MotionLinkButton
                href="mailto:oldcrown@lapeninns.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent-500 text-neutral-900 font-semibold shadow-lg hover:bg-accent-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-200 focus-visible:ring-offset-brand-700"
                style={{ touchAction: "manipulation", WebkitTapHighlightColor: "rgba(0,0,0,0)" }}
                ariaLabel="Email the Old Crown Girton about wakes buffet availability"
              >
                <span aria-hidden="true" role="img">✉️</span>
                Request availability by email
              </MotionLinkButton>
            </div>
          </FadeInUp>
          <FadeIn>
            <p className="text-sm text-neutral-100/80">
              Still exploring? <Link href="/menu" className="underline font-semibold">Browse the main restaurant menu</Link> for additional dishes or favourites to serve before or after the wake.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20" aria-labelledby="wakes-offer-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-3xl space-y-4 mb-12">
              <h2 id="wakes-offer-heading" className="text-3xl md:text-4xl font-display font-bold text-brand-800">
                How the £13 wakes buffet is served
              </h2>
              <p className="text-lg text-brand-600 leading-relaxed">
                The buffet is designed so every guest receives one item from each course below, plus chicken pakora and a hot drink. We label platters clearly and can adapt fillings with advance notice.
              </p>
              <p className="text-sm font-semibold text-brand-500 uppercase tracking-wide">
                Example plate: Egg & mayo sandwich · Chicken wing · Vegetable samosa · Chicken pakora · Tea or coffee (£13 per guest)
              </p>
            </div>
          </FadeIn>
          <FadeInUp>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <article className="rounded-3xl border border-brand-100 bg-neutral-50 p-8 shadow-lg focus-within:shadow-2xl" aria-labelledby="per-guest-steps-heading">
                <h3 id="per-guest-steps-heading" className="text-2xl font-display font-semibold text-brand-800 mb-6">
                  Per-guest serving steps
                </h3>
                <ol className="space-y-6" aria-label="Per guest buffet selections">
                  {BASE_COURSES.map((course) => (
                    <li key={course.step} className="flex gap-4">
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-semibold text-white"
                        aria-hidden="true"
                      >
                        {course.step}
                      </span>
                      <div className="space-y-2">
                        <h4 className="text-xl font-semibold text-brand-800">{course.title}</h4>
                        <p className="text-brand-600 leading-relaxed">{course.summary}</p>
                        <ul className="flex flex-wrap gap-2 text-sm text-brand-500" aria-label={`${course.title} options`}>
                          {course.options.map((option) => (
                            <li
                              key={option}
                              className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-brand-100"
                            >
                              {option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 rounded-2xl bg-white/70 p-4 text-sm text-brand-600">
                  <p className="font-semibold text-brand-700">Serving tip</p>
                  <p>
                    Mix and match sandwiches and samosas to reflect your guests. We place vegetarian platters together so they&apos;re easy to spot.
                  </p>
                </div>
              </article>
              <aside className="flex flex-col gap-6">
                <article className="rounded-3xl border border-brand-200 bg-brand-50 p-8 shadow-lg focus-within:shadow-2xl" aria-labelledby="included-extras-heading">
                  <h3 id="included-extras-heading" className="text-2xl font-display font-semibold text-brand-700 mb-4">
                    Also included in £13
                  </h3>
                  <ul className="space-y-4">
                    {INCLUDED_EXTRAS.map((extra) => (
                      <li key={extra.title} className="space-y-1">
                        <p className="text-lg font-semibold text-brand-700">{extra.title}</p>
                        <p className="text-brand-700/80 leading-relaxed">{extra.description}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 rounded-xl bg-white/80 p-4 text-sm text-brand-700">
                    <p className="font-semibold">Complete package</p>
                    <p>Sandwich + chicken wing + samosa + chicken pakora + tea or coffee = £13 per guest.</p>
                  </div>
                </article>
                <article className="rounded-3xl border border-brand-100 bg-white p-6 shadow-lg focus-within:shadow-2xl" aria-labelledby="event-support-heading">
                  <h3 id="event-support-heading" className="text-xl font-semibold text-brand-800 mb-3">
                    Event support
                  </h3>
                  <ul className="space-y-2 text-sm text-brand-600">
                    <li className="flex gap-2">
                      <span aria-hidden="true" className="text-brand-400">•</span>
                      Hosted in our dining rooms with staff on hand throughout
                    </li>
                    <li className="flex gap-2">
                      <span aria-hidden="true" className="text-brand-400">•</span>
                      Quiet background playlists available, or we&apos;ll play yours
                    </li>
                    <li className="flex gap-2">
                      <span aria-hidden="true" className="text-brand-400">•</span>
                      Space for photo displays and memory tables on request
                    </li>
                  </ul>
                </article>
              </aside>
            </div>
          </FadeInUp>
        </div>
      </section>

      <section className="bg-neutral-50 py-16" aria-labelledby="wakes-terms-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 id="wakes-terms-heading" className="text-3xl font-display font-bold text-brand-900 mb-6">
              Wake buffet – terms & conditions
            </h2>
          </FadeIn>
          <FadeInUp>
            <ul className="space-y-4 text-brand-700 leading-relaxed">
              {[
                "Advance booking required – please confirm final numbers 5 days before your event.",
                "A deposit is required to secure the booking and is non-refundable if the event is cancelled late.",
                "Full payment is due on or before the day of the wake.",
                "The buffet is for guests dining in with us; we’re not able to package leftovers to take away.",
                "Minimum guest numbers and charges apply.",
                "Let us know about dietary requirements or allergies when you book so we can prepare safely.",
                "Charges are based on the confirmed number of guests, or the number attending if higher.",
                "Menu items may vary slightly depending on availability, but we’ll always provide a suitable alternative.",
              ].map((term) => (
                <li key={term} className="flex gap-3">
                  <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </FadeInUp>
        </div>
      </section>

      <section className="bg-brand-50 py-16" aria-labelledby="wakes-next-steps-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <FadeIn>
            <h2 id="wakes-next-steps-heading" className="text-3xl font-display font-bold text-brand-900">
              Ready to talk through timings?
            </h2>
          </FadeIn>
          <FadeInUp>
            <p className="text-lg text-brand-700 leading-relaxed">
              We can reserve a private lounge, accommodate speeches, and coordinate timings with your celebrant. Share your expected guest count, favoured arrival time, and whether you’d like the chicken pakora & hot drink add-on—we’ll handle the rest.
            </p>
          </FadeInUp>
          <FadeInUp>
            <div className="flex flex-wrap justify-center gap-4">
              <MotionLinkButton
                href={`tel:${contact.phone.primary.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand-700 text-white font-semibold shadow-lg hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-300 focus-visible:ring-offset-brand-50"
                style={{ touchAction: "manipulation", WebkitTapHighlightColor: "rgba(0,0,0,0)" }}
                ariaLabel="Call the Old Crown Girton"
              >
                <span aria-hidden="true" role="img">📞</span>
                Call {contact.phone.primary}
              </MotionLinkButton>
              <MotionLinkButton
                href="mailto:oldcrown@lapeninns.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-brand-800 font-semibold shadow-lg hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-300 focus-visible:ring-offset-brand-50"
                style={{ touchAction: "manipulation", WebkitTapHighlightColor: "rgba(0,0,0,0)" }}
                ariaLabel="Email the Old Crown Girton"
              >
                <span aria-hidden="true" role="img">✉️</span>
                Email the team
              </MotionLinkButton>
            </div>
          </FadeInUp>
        </div>
      </section>
    </RestaurantLayout>
  );
}
