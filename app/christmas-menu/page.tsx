import RestaurantLayout from "@/components/restaurant/Layout";
import { FadeIn, FadeInUp, MotionLinkButton } from "@/components/animations/MotionWrappers";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import Link from "@/lib/debugLink";
import { getContactInfo } from "@/lib/restaurantData";
import ChristmasMusicPlayer from "./_components/ChristmasMusicPlayer";

export const metadata = getSEOTags({
  title: "Christmas Menu 2025 | Old Crown Girton – Festive Dining in Cambridge",
  description:
    "Enjoy Old Crown Girton's 2025 Christmas menu. Pick a starter, main, side and dessert, with mulled wine or another drink of their choice included. Chef's set menu costs £44.99 per guest.",
  keywords: [
    "Cambridge Christmas menu",
    "Christmas menu",
    "Old Crown Girton Christmas",
    "Girton festive dining",
    "best Christmas menu 2025",
    "Christmas dining Cambridge",
    "festive menu Girton",
  ],
  canonicalUrlRelative: "/christmas-menu",
  openGraph: {
    title: "Old Crown Girton Christmas Menu 2025 – Reserve Your Festive Table",
    description:
      "Celebrate in Cambridge with the Old Crown Girton Christmas menu. Choose your courses or book the chef's set menu with mulled wine or another drink of their choice included for £44.99 per guest.",
    url: "https://oldcrowngirton.com/christmas-menu",
  },
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

type MenuItemData = {
  id: string;
  name: string;
  description: string;
};

type MenuSectionData = {
  id: string;
  name: string;
  description?: string;
  items: MenuItemData[];
};

type FestiveMenu = {
  title: string;
  description: string;
  sections: MenuSectionData[];
  footer: {
    experience: string;
    location: string;
    contactLabel: string;
    contactWebsite: string;
    contactPhone: string;
    notes: string;
  };
};

type ChefSelections = {
  title: string;
  description: string;
  items: MenuItemData[];
  drink: {
    offer: string;
    included: boolean;
  };
  price: {
    value: string;
  };
};

const FULL_CHRISTMAS_MENU: FestiveMenu = {
  title: "Choose Your Christmas Meal",
  description:
    "Pick one dish from each section. Every guest receives mulled wine or another drink of their choice.",
  sections: [
    {
      id: slugify("Starters"),
      name: "Starters",
      items: [
        {
          id: slugify("Sha Phaley Delight"),
          name: "Sha Phaley Delight",
          description:
            "Crispy fried pastry filled with minced meat, egg and cheese. Served with tomato chutney.",
        },
        {
          id: slugify("Turkey's Nepalese Christmas Choyela"),
          name: "Turkey's Nepalese Christmas Choyela",
          description:
            "Roasted turkey mixed with Nepali spices, mustard oil and fresh herbs.",
        },
        {
          id: slugify("Tandoori Broccoli"),
          name: "Tandoori Broccoli",
          description:
            "Grilled broccoli in spiced yogurt with mint sauce and tamarind chutney.",
        },
        {
          id: slugify("Banana Dumpling"),
          name: "Banana Dumpling",
          description:
            "Warm dumpling with a sweet banana filling.",
        },
      ],
    },
    {
      id: slugify("Mains"),
      name: "Mains",
      items: [
        {
          id: slugify("Zesty Lemon Sea Bass & Creamy Mash"),
          name: "Zesty Lemon Sea Bass & Creamy Mash",
          description:
            "Tender grilled sea bass infused with fresh lemon zest and herbs, served alongside smooth, buttery mashed potatoes.",
        },
        {
          id: slugify("Chicken Pistachio Korma"),
          name: "Chicken Pistachio Korma",
          description:
            "Chicken tikka simmered in a creamy pistachio sauce.",
        },
        {
          id: slugify("Himalayan Christmas Sizzler"),
          name: "Himalayan Christmas Sizzler",
          description:
            "Turkey breast served sizzling in wine and cream sauce with a hint of oyster and bright vegetables.",
        },
        {
          id: slugify("Santa's Vegetarian Feast"),
          name: "Santa's Vegetarian Feast",
          description:
            "Baby corn, potatoes, mushrooms, kidney beans and carrots cooked with butter and herbs.",
        },
      ],
    },
    {
      id: slugify("Sides"),
      name: "Sides",
      items: [
        {
          id: slugify("Fragrant Pilau Rice"),
          name: "Fragrant Pilau Rice",
          description: "Basmati rice cooked with gentle spices and ghee.",
        },
        {
          id: slugify("Mini Festive Naan"),
          name: "Mini Festive Naan",
          description: "Soft naan bread baked fresh for the table.",
        },
      ],
    },
    {
      id: slugify("Desserts"),
      name: "Desserts",
      items: [
        {
          id: slugify("Classic Christmas Pudding"),
          name: "Classic Christmas Pudding",
          description: "Rich spiced pudding served warm.",
        },
        {
          id: slugify("Nepalese Spiced Rice Pudding"),
          name: "Nepalese Spiced Rice Pudding",
          description:
            "Creamy rice pudding with light Nepalese spices.",
        },
        {
          id: slugify("Vegan Rhubarb & Ginger Bravos"),
          name: "Vegan Rhubarb & Ginger Bravos",
          description:
            "Tangy rhubarb dessert with ginger, fully plant-based.",
        },
      ],
    },
  ],
  footer: {
    experience: "Celebrate Christmas at The Old Crown in Girton.",
    location: "89 High St, Girton, Cambridge CB3 0QD",
    contactLabel: "oldcrowngirton.com",
    contactWebsite: "https://oldcrowngirton.com",
    contactPhone: "01223 277217",
    notes:
      "Our regular menu stays available alongside these dishes. Items may change if ingredients run out.",
  },
};

const CHEF_SELECTIONS: ChefSelections = {
  title: "Chef's Christmas Selections",
  description:
    "Enjoy a set menu chosen by our chefs with four courses and mulled wine or another drink of their choice included.",
  items: [
    {
      id: slugify("Turkey's Nepalese Christmas Choyela"),
      name: "Turkey's Nepalese Christmas Choyela",
      description:
        "Roasted turkey tossed with Nepali spices, mustard oil and fresh herbs.",
    },
    {
      id: slugify("Himalayan Christmas Sizzler"),
      name: "Himalayan Christmas Sizzler",
      description:
        "Turkey breast served sizzling with wine and cream sauce, a hint of oyster and bright vegetables.",
    },
    {
      id: slugify("Fragrant Pilau Rice"),
      name: "Fragrant Pilau Rice",
      description: "Basmati rice cooked with gentle spices and ghee.",
    },
    {
      id: slugify("Nepalese Spiced Rice Pudding"),
      name: "Nepalese Spiced Rice Pudding",
      description:
        "Creamy rice pudding with gentle spice to finish the meal.",
    },
  ],
  drink: {
    offer:
      "Enjoy a glass of mulled wine or choose another drink when you arrive.",
    included: true,
  },
  price: {
    value: "44.99",
  },
};

const highlightCards = [
  {
    icon: "🎄",
    title: "A cosy Cambridge Christmas",
    body: "Our dining room is dressed with trees, lights and a glowing fire so it feels warm the moment you walk in.",
  },
  {
    icon: "🍽️",
    title: "Comfort food with spice",
    body: "Classic British comfort dishes sit beside bold Nepalese flavours so everyone finds something they love.",
  },
  {
    icon: "🥂",
    title: "Toasts made easy",
    body: "Start with mulled wine or another drink of their choice, and let our bar team keep the glasses full all night.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Space for every group",
    body: "Bring family, friends or work mates—we can seat small tables or large gatherings with ease.",
  },
] as const;

const assurancePoints = [
  {
    icon: "✅",
    title: "Dietary friendly",
    description: "Tell us about allergies or preferences and we will offer safe swaps without fuss.",
  },
  {
    icon: "📞",
    title: "Friendly planning support",
    description: "Call or email and we will help with bookings, deposits and timings.",
  },
  {
    icon: "🎁",
    title: "Ready for parties",
    description: "Need a private room or team celebration? We can set up the space, music and menu.",
  },
] as const;

export default async function ChristmasMenuPage() {
  const contact = getContactInfo();
  const telHref = contact.phone.primary.replace(/\s+/g, "");
  const phoneDisplay = contact.phone.display.replace(/\s+/g, "\u00a0");

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Menu",
      name: "Old Crown Girton Christmas Menu 2025",
      description: FULL_CHRISTMAS_MENU.description,
      url: "https://oldcrowngirton.com/christmas-menu",
      hasMenuSection: [
        ...FULL_CHRISTMAS_MENU.sections.map((section) => ({
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
        {
          "@type": "MenuSection",
          name: CHEF_SELECTIONS.title,
          description: CHEF_SELECTIONS.description,
          hasMenuItem: [
            ...CHEF_SELECTIONS.items.map((item) => ({
              "@type": "MenuItem",
              name: item.name,
              description: item.description,
              offers: {
                "@type": "Offer",
                availability: "https://schema.org/InStoreOnly",
              },
            })),
            {
              "@type": "MenuItem",
              name: "Festive drink on arrival",
              description: CHEF_SELECTIONS.drink.offer,
              offers: {
                "@type": "Offer",
                availability: "https://schema.org/InStoreOnly",
              },
            },
          ],
        },
      ],
      offers: [
        {
          "@type": "Offer",
          price: CHEF_SELECTIONS.price.value,
          priceCurrency: "GBP",
          description: "Chef's Christmas Selections per person with mulled wine or another drink of their choice included.",
          availability: "https://schema.org/InStoreOnly",
          url: "https://oldcrowngirton.com/christmas-menu",
        },
      ],
      provider: {
        "@type": "Restaurant",
        name: "The Old Crown Girton",
        telephone: contact.phone.primary,
        email: contact.email.primary,
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
                <span aria-hidden="true" role="img">🎄</span>
                <span className="text-sm font-semibold tracking-wide uppercase">Festive Menu 2025</span>
                <span className="sr-only">Christmas menu now available</span>
              </div>
            </FadeIn>
            <FadeInUp>
              <h1 id="christmas-hero-heading" className="text-3xl md:text-5xl font-display font-bold leading-tight">
                Christmas Menu 2025 at Old Crown Girton
              </h1>
            </FadeInUp>
            <FadeInUp>
              <p className="text-lg md:text-xl text-neutral-100 max-w-3xl mx-auto leading-relaxed">
                Join us for a warm festive meal in Girton. Pick your favourites from each course and enjoy mulled wine or another drink of their choice the moment you arrive.
              </p>
            </FadeInUp>
            <FadeInUp>
              <div
                className="flex flex-wrap justify-center gap-3 text-base font-semibold"
                role="list"
                aria-label="Festive inclusions"
              >
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-500 px-4 py-2 text-neutral-900 shadow-sm"
                  role="listitem"
                >
                  <span aria-hidden="true" role="img">
                    🍷
                  </span>
                  Mulled wine or another drink of their choice included
                </span>
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-white shadow-sm backdrop-blur"
                  role="listitem"
                >
                  <span aria-hidden="true" role="img">
                    💷
                  </span>
                  Chef&rsquo;s set menu &pound;44.99&nbsp;per&nbsp;guest
                </span>
              </div>
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
                  href={`tel:${telHref}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent-500 text-neutral-900 font-semibold shadow-lg hover:bg-accent-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-200 focus-visible:ring-offset-brand-700"
                  ariaLabel="Book your table via call"
                >
                  <span aria-hidden="true" role="img">📞</span>
                  Book Your Table via Call
                </MotionLinkButton>
              </div>
            </FadeInUp>
            <FadeInUp>
              <div className="flex justify-center">
                <ChristmasMusicPlayer />
              </div>
            </FadeInUp>
            <FadeInUp>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
                Seats are limited &mdash; book today.
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
                  Festive lunches &amp; dinners
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
                  <span aria-hidden="true" role="img">✨</span>
                  Mulled wine or another drink of their choice included
                </span>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="bg-neutral-50 py-16 md:py-20" aria-labelledby="full-christmas-menu-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <h2 id="full-christmas-menu-heading" className="text-3xl md:text-4xl font-display font-bold text-brand-800">
                  {FULL_CHRISTMAS_MENU.title}
                </h2>
                <p className="text-lg text-brand-600 leading-relaxed">
                  {FULL_CHRISTMAS_MENU.description}
                </p>
              </div>
            </FadeIn>
            <FadeInUp>
              <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                {FULL_CHRISTMAS_MENU.sections.map((section) => (
                  <article
                    key={section.id}
                    className="flex h-full flex-col rounded-2xl border border-brand-100 bg-white/80 p-6 shadow-lg"
                    aria-labelledby={`section-${section.id}-title`}
                  >
                    <header className="mb-4">
                      <h3
                        id={`section-${section.id}-title`}
                        className="text-xl font-semibold text-brand-700"
                      >
                        {section.name}
                      </h3>
                      {section.description && (
                        <p className="mt-1 text-brand-600 leading-relaxed">{section.description}</p>
                      )}
                    </header>
                    <ul className="space-y-4" role="list" aria-label={`${section.name} options`}>
                      {section.items.map((item) => (
                        <li
                          key={item.id}
                          className="rounded-lg border border-neutral-200 bg-neutral-50/80 p-4"
                        >
                          <h4 className="text-base font-semibold text-brand-800 leading-tight">
                            {item.name}
                          </h4>
                          <p className="mt-1 text-sm text-brand-600 leading-relaxed">
                            {item.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </FadeInUp>
            <FadeIn>
              <div className="mt-12 rounded-2xl border border-brand-100 bg-brand-50/70 p-8 shadow-md">
                <h3 className="text-lg font-semibold text-brand-800 mb-4">Good to know</h3>
                <dl className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-semibold uppercase tracking-wide text-brand-600">Experience</dt>
                    <dd className="text-brand-700 leading-relaxed">{FULL_CHRISTMAS_MENU.footer.experience}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold uppercase tracking-wide text-brand-600">Location</dt>
                    <dd className="text-brand-700 leading-relaxed">
                      <address className="not-italic">
                        {FULL_CHRISTMAS_MENU.footer.location}
                      </address>
                      <Link
                        href={contact.address.google_maps_url}
                        className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 underline"
                      >
                        Open in Maps
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold uppercase tracking-wide text-brand-600">Contact</dt>
                    <dd className="text-brand-700 leading-relaxed">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={FULL_CHRISTMAS_MENU.footer.contactWebsite} className="font-semibold underline">
                          {FULL_CHRISTMAS_MENU.footer.contactLabel}
                        </Link>
                        <span aria-hidden="true" className="text-brand-500">•</span>
                        <Link href={`tel:${telHref}`} className="font-semibold underline">
                          {phoneDisplay}
                        </Link>
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold uppercase tracking-wide text-brand-600">Notes</dt>
                    <dd className="text-brand-700 leading-relaxed">
                      {FULL_CHRISTMAS_MENU.footer.notes}
                    </dd>
                  </div>
                </dl>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20" aria-labelledby="chefs-christmas-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="max-w-3xl space-y-4">
                <h2 id="chefs-christmas-heading" className="text-3xl md:text-4xl font-display font-bold text-brand-800">
                  Chef&rsquo;s Christmas Selections
                </h2>
                <p className="text-lg text-brand-600 leading-relaxed">
                  {CHEF_SELECTIONS.description}
                </p>
              </div>
            </FadeIn>
            <div className="mt-10 grid gap-8 lg:grid-cols-[2fr,1fr]">
              <FadeInUp>
                <ul className="space-y-4" role="list" aria-label="Chef&rsquo;s selection dishes">
                  {CHEF_SELECTIONS.items.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-2xl border border-brand-100 bg-neutral-50/80 p-6 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-brand-800 leading-tight">{item.name}</h3>
                      <p className="mt-2 text-brand-600 leading-relaxed">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </FadeInUp>
              <FadeInUp>
                <aside className="rounded-2xl border border-brand-100 bg-brand-50/80 p-8 shadow-lg">
                  <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Per person</p>
                  <p className="mt-2 text-3xl font-display font-bold text-brand-800">
                    &pound;{CHEF_SELECTIONS.price.value}
                  </p>
                  <p className="mt-4 text-brand-700 leading-relaxed">
                  {CHEF_SELECTIONS.drink.offer}
                </p>
                {CHEF_SELECTIONS.drink.included && (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-500 px-3 py-1 text-sm font-semibold text-neutral-900">
                    <span aria-hidden="true" role="img">🍷</span>
                    Mulled wine or another drink of their choice comes with every menu
                  </p>
                )}
                <div className="mt-6 space-y-3">
                  <MotionLinkButton
                    href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-3 text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-300 focus-visible:ring-offset-brand-50"
                    ariaLabel="Book the Chef&rsquo;s Christmas set menu online"
                  >
                    <span aria-hidden="true" role="img">🥂</span>
                    Book the festive set menu
                  </MotionLinkButton>
                    <Link
                      href={`tel:${telHref}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-200 px-5 py-3 text-brand-700 hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                    >
                      <span aria-hidden="true" role="img">☎️</span>
                      Call our team
                    </Link>
                  </div>
                </aside>
              </FadeInUp>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20" aria-labelledby="festive-highlights-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <h2 id="festive-highlights-heading" className="text-3xl md:text-4xl font-display font-bold text-brand-800">
                  Why guests love our Christmas menu
                </h2>
                <p className="text-lg text-brand-600 leading-relaxed">
                  We mix easy-going Old Crown hospitality with bold Nepalese flavour so your festive meal feels relaxed and special.
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
                    Plan your visit with us
                  </h2>
                  <p className="text-lg text-brand-600 leading-relaxed">
                    Tell us about your guests, timings and any needs. We will reserve the right space, handle deposits and keep everything running smoothly.
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
                    Prefer a call? Ring us on <a className="font-semibold underline" href={`tel:${telHref}`}>{phoneDisplay}</a> and ask for the Christmas team.
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
