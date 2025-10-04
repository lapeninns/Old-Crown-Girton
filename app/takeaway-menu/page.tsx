import RestaurantLayout from "@/components/restaurant/Layout";
import { FadeIn, FadeInUp, MotionLinkButton } from "@/components/animations/MotionWrappers";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import Link from "@/lib/debugLink";
import { getContactInfo } from "@/lib/restaurantData";

const TAKEAWAY_MENU_PATH = "/takeaway-menu/old-crown-takeaway-menu.jpg";

export const metadata = getSEOTags({
  title: "Takeaway Menu Download | Old Crown Girton",
  description:
    "Download The Old Crown Girton takeaway menu and order authentic Nepalese and British pub favourites for collection in Girton, Cambridge.",
  keywords: [
    "takeaway menu Cambridge",
    "Old Crown Girton takeaway",
    "Girton takeaway",
    "download takeaway menu",
    "Nepalese takeaway Cambridge",
    "pub takeaway Girton",
  ],
  canonicalUrlRelative: "/takeaway-menu",
  openGraph: {
    title: "Download the Old Crown Girton Takeaway Menu",
    description:
      "Access our latest takeaway menu and place your collection order direct with the Old Crown Girton team.",
    url: "https://oldcrowngirton.com/takeaway-menu",
  },
});

export default function TakeawayMenuPage() {
  const contact = getContactInfo();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Menu",
      name: "Old Crown Girton Takeaway Menu",
      description:
        "Downloadable takeaway menu featuring Nepalese specialties and British pub classics from The Old Crown Girton.",
      url: `https://oldcrowngirton.com${TAKEAWAY_MENU_PATH}`,
      offers: {
        "@type": "Offer",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStorePickup",
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
    },
  ];

  return (
    <RestaurantLayout>
      {renderSchemaTags(structuredData)}

      <section
        className="relative bg-gradient-to-br from-brand-700 via-crimson-600 to-cardamom-700 text-white py-16 md:py-24"
        aria-labelledby="takeaway-menu-heading"
      >
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <FadeIn>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 rounded-full backdrop-blur">
              <span aria-hidden="true" role="img">🛍️</span>
              <span className="text-sm font-semibold tracking-wide uppercase">Takeaway Menu</span>
              <span className="sr-only">Download our takeaway menu</span>
            </span>
          </FadeIn>
          <FadeInUp>
            <h1 id="takeaway-menu-heading" className="text-3xl md:text-5xl font-display font-bold leading-tight">
              Download the Old Crown Girton Takeaway Menu
            </h1>
          </FadeInUp>
          <FadeInUp>
            <p className="text-lg md:text-xl text-neutral-100 max-w-3xl mx-auto leading-relaxed">
              Explore Nepalese signatures and British pub favourites from the comfort of home. Download the PDF to browse dishes, note allergens, and call us to place your order for collection in Girton.
            </p>
          </FadeInUp>
          <FadeInUp>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={TAKEAWAY_MENU_PATH}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-brand-800 font-semibold shadow-lg hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-300 focus-visible:ring-offset-brand-700 transition-colors duration-200"
                aria-label="Download the takeaway menu"
                download="old-crown-takeaway-menu.jpg"
              >
                <span aria-hidden="true" role="img">⬇️</span>
                Download Menu
              </a>
              <MotionLinkButton
                href={`tel:${contact.phone.primary.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent-500 text-neutral-900 font-semibold shadow-lg hover:bg-accent-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-200 focus-visible:ring-offset-brand-700"
                ariaLabel="Call to place a takeaway order"
              >
                <span aria-hidden="true" role="img">📞</span>
                Call to Order
              </MotionLinkButton>
            </div>
          </FadeInUp>
          <FadeIn>
            <p className="text-sm text-neutral-100/80">
              PDF not downloading? Email <Link href={`mailto:${contact.email.primary}`} className="underline font-semibold">{contact.email.primary}</Link> and we&apos;ll send the latest copy.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20" aria-labelledby="takeaway-details-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-3xl space-y-4 mb-12">
              <h2 id="takeaway-details-heading" className="text-3xl md:text-4xl font-display font-bold text-brand-800">
                Everything you need for an effortless collection
              </h2>
              <p className="text-lg text-brand-600 leading-relaxed">
                Whether you&apos;re planning a cosy night in or a family feast, the Old Crown Girton takeaway menu makes it simple to bring our kitchen home.
              </p>
            </div>
          </FadeIn>
          <FadeInUp>
            <div className="grid gap-8 md:grid-cols-3">
              {[{
                icon: "🕒",
                title: "Order & collection times",
                description: "Call ahead to confirm kitchen opening times— pickups are usually ready within 25 minutes.",
              }, {
                icon: "🚗",
                title: "Easy parking outside",
                description: "Pull into our car park on arrival; we&apos;ll hand over your order at the bar or bring it to your vehicle on request.",
              }, {
                icon: "⚠️",
                title: "Allergens & dietary notes",
                description: "All dishes are labelled in the PDF. Let us know about allergies when you call so the kitchen can advise on safe options.",
              }].map(card => (
                <article
                  key={card.title}
                  className="rounded-2xl border border-brand-100 bg-neutral-50 p-8 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl focus-within:shadow-2xl"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-2xl" aria-hidden="true">
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

    </RestaurantLayout>
  );
}
