import RestaurantLayout from "@/components/restaurant/Layout";
import { FadeIn, FadeInUp, MotionLinkButton } from "@/components/animations/MotionWrappers";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import Link from "@/lib/debugLink";
import { getContactInfo } from "@/lib/restaurantData";

const BASE_URL = "https://oldcrowngirton.com";

type MenuItem = {
  id: string;
  name: string;
  description: string;
};

type MenuSection = {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const MENU_SECTIONS: MenuSection[] = [
  {
    id: slugify("Starters"),
    name: "Starters",
    description: "Warm up the table with festive sharing plates pulled straight from the tandoor and wok.",
    items: [
      {
        id: slugify("Vegetable Samosa"),
        name: "Vegetable Samosa",
        description: "Crispy pastry parcels filled with spiced potatoes, peas, and herbs, served with tangy chutney.",
      },
      {
        id: slugify("Gobi Manchurian"),
        name: "Gobi Manchurian",
        description: "Crispy cauliflower florets tossed in an Indo-Chinese garlic, soy, and chilli glaze.",
      },
      {
        id: slugify("Chicken Tikka"),
        name: "Chicken Tikka",
        description: "Tender chicken pieces marinated in yogurt and spices, grilled until smoky and succulent.",
      },
      {
        id: slugify("Seekh Kebab"),
        name: "Seekh Kebab",
        description: "Minced lamb skewers scented with aromatic spices, served with cool mint sauce.",
      },
    ],
  },
  {
    id: slugify("Mains"),
    name: "Mains",
    description: "Choose a hearty plate to enjoy while the carols ring out—served with pilau rice for the table.",
    items: [
      {
        id: slugify("Chicken Tikka Masala"),
        name: "Chicken Tikka Masala",
        description: "Chargrilled chicken simmered in a creamy tomato and garam masala sauce.",
      },
      {
        id: slugify("Lamb Curry (Special)"),
        name: "Lamb Curry (Special)",
        description: "Slow-cooked lamb in a rich, traditional curry with warming whole spices.",
      },
      {
        id: slugify("Vegetable Curry"),
        name: "Vegetable Curry",
        description: "Seasonal vegetables cooked gently in a mildly spiced Nepalese curry gravy.",
      },
      {
        id: slugify("Pilau Rice"),
        name: "Pilau Rice",
        description: "Fragrant basmati rice lifted with saffron and whole aromatics.",
      },
      {
        id: slugify("Vegetable Chow Mein"),
        name: "Vegetable Chow Mein",
        description: "Stir-fried noodles with bright vegetables in a savoury soy and garlic sauce.",
      },
    ],
  },
  {
    id: slugify("Dessert & Hot Drinks"),
    name: "Dessert & Hot Drinks",
    description: "Finish on something sweet with a warm drink while our singers take a final bow.",
    items: [
      {
        id: slugify("Coffee with Mince Pie"),
        name: "Coffee with Mince Pie",
        description: "Freshly brewed coffee poured alongside a classic festive mince pie.",
      },
      {
        id: slugify("Christmas Pudding"),
        name: "Christmas Pudding",
        description: "Rich pudding packed with dried fruits and spices, served warm with brandy sauce.",
      },
    ],
  },
];

const HIGHLIGHT_CARDS = [
  {
    icon: "🎶",
    title: "Live carols & singalongs",
    body: "Our choir leads the room through classics and new favourites—song sheets and mulled wine in hand.",
  },
  {
    icon: "🍛",
    title: "Festive Nepalese banquet",
    body: "Shareable starters, bold curries, and comforting desserts keep the table lively all night long.",
  },
  {
    icon: "🎄",
    title: "Thatched-roof atmosphere",
    body: "Twinkling lights, roaring fires, and the largest thatched pub roof in the country create instant cheer.",
  },
] as const;

const ASSURANCE_POINTS = [
  {
    icon: "✅",
    title: "Allergies handled with care",
    description: "Tell us ahead of time and the kitchen will shape safe swaps without losing the festive spirit.",
  },
  {
    icon: "📞",
    title: "Planning support",
    description: "Need to organise a group booking or company outing? Call the team and we will reserve the seats you need.",
  },
  {
    icon: "🕕",
    title: "Two evenings only",
    description: "Curry & Carols runs 16 & 17 December 2025. Arrive from 7pm to settle in before the first song.",
  },
] as const;

export const metadata = getSEOTags({
  title: "Curry & Carols Menu 2025 | Old Crown Girton – Festive Nepalese Banquet",
  description:
    "Discover the full Curry & Carols 2025 menu at The Old Crown Girton. Share starters, choose from warming curries, and finish with mince pies while live carols fill the room.",
  keywords: [
    "Curry and Carols menu",
    "Old Crown Girton Christmas menu",
    "festive Nepalese menu Cambridge",
    "Christmas curry night Cambridge",
    "Curry and carols Cambridge 2025",
  ],
  canonicalUrlRelative: "/curry-and-carols-menu",
  openGraph: {
    title: "Curry & Carols Menu 2025 | Old Crown Girton",
    description:
      "Preview the festive Nepalese banquet served during Curry & Carols at The Old Crown Girton—two joyful evenings of food, mulled cheer, and live carols.",
    url: `${BASE_URL}/curry-and-carols-menu`,
  },
});

const buildStructuredData = (sections: MenuSection[], contact: ReturnType<typeof getContactInfo>) => [
  {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Curry & Carols Menu 2025 at The Old Crown Girton",
    description:
      "Festive Nepalese banquet with sharing starters, warming mains, and classic desserts served during Curry & Carols on 16 & 17 December 2025.",
    url: `${BASE_URL}/curry-and-carols-menu`,
    provider: {
      "@type": "Restaurant",
      name: "The Old Crown Girton",
      telephone: contact.phone.primary,
      address: {
        "@type": "PostalAddress",
        streetAddress: contact.address.street,
        addressLocality: contact.address.city,
        addressRegion: "Cambridgeshire",
        postalCode: contact.address.postcode,
        addressCountry: "GB",
      },
    },
    hasMenuSection: sections.map((section) => ({
      "@type": "MenuSection",
      name: section.name,
      description: section.description,
      hasMenuItem: section.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.description,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStoreOnly",
        },
      })),
    })),
  },
];

export default function CurryAndCarolsMenuPage() {
  const contact = getContactInfo();
  const telHref = contact.phone.primary.replace(/\s+/g, "");
  const phoneDisplay = contact.phone.display.replace(/\s+/g, "\u00a0");

  const structuredData = buildStructuredData(MENU_SECTIONS, contact);

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
            { name: "Home", url: `${BASE_URL}/` },
            { name: "Events", url: `${BASE_URL}/events` },
            { name: "Curry & Carols", url: `${BASE_URL}/events/curry-and-carols` },
            { name: "Curry & Carols Menu", url: `${BASE_URL}/curry-and-carols-menu` },
          ]}
          page="curry-and-carols-menu"
        />

        <section
          className="relative bg-gradient-to-br from-brand-700 via-crimson-600 to-cardamom-700 text-white py-16 md:py-24"
          aria-labelledby="curry-carols-menu-heading"
        >
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <FadeIn>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 rounded-full backdrop-blur touch-manipulation">
                <span aria-hidden="true" role="img">
                  🎷
                </span>
                <span className="text-sm font-semibold tracking-wide uppercase">Festive Dinner &amp; Song</span>
                <span className="sr-only">Curry &amp; Carols menu announcement</span>
              </span>
            </FadeIn>
            <FadeInUp>
              <h1 id="curry-carols-menu-heading" className="text-3xl md:text-5xl font-display font-bold leading-tight">
                Curry &amp; Carols Menu 2025
              </h1>
            </FadeInUp>
            <FadeInUp>
              <p className="text-lg md:text-xl text-neutral-100 max-w-3xl mx-auto leading-relaxed">
                Preview every course from this year&apos;s two-night celebration at The Old Crown Girton. Share starters,
                choose a warming curry, and finish with Christmas pudding while live carols fill our thatched
                dining room.
              </p>
            </FadeInUp>
            <FadeInUp>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <MotionLinkButton
                  href="/contact"
                  className="btn btn-primary w-full sm:w-auto min-h-[3.25rem] bg-white text-brand-800 hover:bg-brand-100 border-none shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-200 focus-visible:ring-offset-brand-700 touch-manipulation"
                  ariaLabel="Register your interest for Curry and Carols via the contact form"
                >
                  <span aria-hidden="true" role="img">
                    📝
                  </span>
                  Register interest
                </MotionLinkButton>
                <MotionLinkButton
                  href={`tel:${telHref}`}
                  className="btn btn-outline w-full sm:w-auto min-h-[3.25rem] border-white/60 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-brand-700 touch-manipulation"
                  ariaLabel="Call the Old Crown Girton team about Curry and Carols"
                >
                  <span aria-hidden="true" role="img">
                    📞
                  </span>
                  Call {phoneDisplay}
                </MotionLinkButton>
              </div>
            </FadeInUp>
            <FadeIn>
              <p className="text-sm uppercase tracking-wide text-white/85">
                Only on 16 &amp; 17 December · £35 per guest · Live carols both nights
              </p>
            </FadeIn>
          </div>
        </section>

        <main className="bg-white" aria-labelledby="curry-carols-menu-overview">
          <section className="py-16 md:py-20" aria-labelledby="curry-carols-menu-overview">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn>
                <div className="max-w-3xl space-y-4 mb-12">
                  <h2 id="curry-carols-menu-overview" className="text-3xl md:text-4xl font-display font-bold text-brand-800">
                    A cosy Nepalese feast made for carolling nights
                  </h2>
                  <p className="text-lg text-brand-600 leading-relaxed">
                    Order mulled wine or your favourite drink from the bar, share the sizzling starters, then pick a main while the
                    choir warms up. Desserts and hot drinks keep things sweet after the final chorus.
                  </p>
                </div>
              </FadeIn>

              <div className="space-y-16">
                {MENU_SECTIONS.map((section) => (
                  <FadeInUp key={section.id}>
                    <section
                      id={section.id}
                      aria-labelledby={`${section.id}-heading`}
                      className="scroll-pt-28"
                    >
                      <div className="flex flex-col gap-4 mb-8 text-center">
                        <div className="mx-auto inline-flex items-center justify-center rounded-full bg-brand-50 px-4 py-2 text-brand-700 border border-brand-100">
                          <span aria-hidden="true" className="text-lg">
                            🍽️
                          </span>
                          <span className="sr-only">Menu section indicator</span>
                        </div>
                        <h3
                          id={`${section.id}-heading`}
                          className="text-2xl md:text-3xl font-display font-semibold text-brand-800"
                        >
                          {section.name}
                        </h3>
                        {section.description && (
                          <p className="text-brand-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                            {section.description}
                          </p>
                        )}
                      </div>

                      <ul
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        role="list"
                        aria-label={`${section.name} dishes`}
                      >
                        {section.items.map((item) => (
                          <li key={item.id}>
                            <article
                              className="h-full rounded-2xl border border-brand-100 bg-neutral-50 p-6 text-left shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:shadow-lg"
                              aria-label={`Menu item ${item.name}`}
                            >
                              <h4 className="text-lg font-semibold text-brand-800 mb-2">{item.name}</h4>
                              <p className="text-sm text-brand-600 leading-relaxed">{item.description}</p>
                            </article>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </FadeInUp>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-brand-50" aria-labelledby="curry-carols-highlights-heading">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn>
                <div className="text-center mb-12">
                  <h2 id="curry-carols-highlights-heading" className="text-3xl md:text-4xl font-display font-bold text-brand-800 mb-4">
                    Why Cambridge loves Curry &amp; Carols
                  </h2>
                  <p className="text-lg text-brand-600 leading-relaxed max-w-2xl mx-auto">
                    Two joyful evenings every December. Here&apos;s what keeps guests booking year after year.
                  </p>
                </div>
              </FadeIn>
              <FadeInUp>
                <div className="grid gap-8 md:grid-cols-3">
                  {HIGHLIGHT_CARDS.map((card) => (
                    <article
                      key={card.title}
                      className="rounded-3xl bg-white p-8 shadow-lg border border-brand-100 transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl focus-within:shadow-2xl"
                    >
                      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 text-3xl" aria-hidden="true">
                        {card.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-brand-800 mb-3">{card.title}</h3>
                      <p className="text-brand-600 leading-relaxed">{card.body}</p>
                    </article>
                  ))}
                </div>
              </FadeInUp>
            </div>
          </section>

          <section className="py-16 md:py-20" aria-labelledby="curry-carols-assurance-heading">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn>
                <div className="max-w-3xl space-y-4 mb-10">
                  <h2 id="curry-carols-assurance-heading" className="text-3xl md:text-4xl font-display font-bold text-brand-800">
                    Ready when your group is
                  </h2>
                  <p className="text-lg text-brand-600 leading-relaxed">
                    Let our team handle the logistics so you can simply arrive, sing, and feast. We&apos;ll confirm seating,
                    take note of dietary needs, and make sure the mulled wine is warm.
                  </p>
                </div>
              </FadeIn>
              <FadeInUp>
                <div className="grid gap-6 md:grid-cols-3">
                  {ASSURANCE_POINTS.map((point) => (
                    <article
                      key={point.title}
                      className="rounded-2xl border border-brand-100 bg-neutral-50 p-6 shadow-sm"
                    >
                      <div className="text-2xl mb-3" aria-hidden="true">
                        {point.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-brand-800 mb-2">{point.title}</h3>
                      <p className="text-sm text-brand-600 leading-relaxed">{point.description}</p>
                    </article>
                  ))}
                </div>
              </FadeInUp>
              <FadeInUp>
                <div className="mt-10 rounded-3xl border border-accent-200 bg-accent-50 p-8 text-center shadow-inner">
                  <h3 className="text-2xl font-display font-semibold text-brand-800 mb-4">
                    How to secure your table
                  </h3>
                  <p className="text-base md:text-lg text-brand-600 leading-relaxed mb-6">
                    Call us on <a href={`tel:${telHref}`} className="font-semibold text-brand-700 underline">{phoneDisplay}</a>{" "}
                    or send a note through the{" "}
                    <Link
                      href="/contact"
                      className="font-semibold text-brand-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-accent-50"
                    >
                      contact form
                    </Link>{" "}
                    and we&apos;ll confirm availability for Curry &amp; Carols. We recommend booking early; the room sells out fast.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <MotionLinkButton
                      href="/events/curry-and-carols"
                      className="btn btn-secondary w-full sm:w-auto min-h-[3rem] bg-brand-700 text-white border-brand-700 hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-300 focus-visible:ring-offset-accent-50 touch-manipulation"
                      ariaLabel="Read more about the Curry and Carols experience"
                    >
                      <span aria-hidden="true" role="img">
                        🎄
                      </span>
                      Event details
                    </MotionLinkButton>
                    <MotionLinkButton
                      href={`mailto:${contact.email.primary}`}
                      className="btn btn-ghost w-full sm:w-auto min-h-[3rem] text-brand-800 border-brand-200 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-300 focus-visible:ring-offset-accent-50 touch-manipulation"
                      ariaLabel="Email the Old Crown Girton team about Curry and Carols"
                    >
                      <span aria-hidden="true" role="img">
                        ✉️
                      </span>
                      Email {contact.email.primary}
                    </MotionLinkButton>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </section>
        </main>
      </RestaurantLayout>
    </>
  );
}
