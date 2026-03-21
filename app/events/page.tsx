import RestaurantLayout from "@/components/restaurant/Layout";
import { FadeIn } from "@/components/animations/MotionWrappers";
import { buildPageMetadata, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import { buildBreadcrumbSchema, buildFaqSchema, buildWebPageSchema } from '@/src/lib/seo/schema';

const EVENTS_PAGE_TITLE = 'Private Hire, Wakes & Group Bookings | Old Crown Girton';
const EVENTS_PAGE_DESCRIPTION =
  'Plan private hire, wakes, birthdays, sports gatherings, and group bookings at Old Crown Girton near Cambridge with food, flexible spaces, and free parking.';

const EVENTS_FAQ_ITEMS = [
  {
    question: 'Can I book Old Crown Girton for private events or group gatherings?',
    answer:
      'Yes. We welcome birthdays, family gatherings, business meals, sports groups, and other private events, with flexible spaces inside and outside the pub.',
  },
  {
    question: 'Do you offer wakes or memorial gatherings?',
    answer:
      'Yes. Old Crown Girton can help with wake and memorial arrangements, including practical planning, food options, and a welcoming setting for guests.',
  },
  {
    question: 'Is there parking for event guests?',
    answer:
      'Yes. We have free on-site parking, which makes the venue easier to reach for guests travelling from Cambridge and nearby villages.',
  },
];

const EVENT_USE_CASES = [
  {
    title: 'Birthdays and family gatherings',
    body: 'A more memorable setting than the usual chain option, with room for mixed groups and flexible food choices.',
  },
  {
    title: 'Wakes and remembrance',
    body: 'A practical, welcoming space with support from the team and easy access for guests travelling in.',
  },
  {
    title: 'Business lunches and socials',
    body: 'Useful for teams, clients, and local groups who want something comfortable without feeling overly formal.',
  },
  {
    title: 'Sports groups and community events',
    body: 'Atmosphere, screens, and group-friendly food options make Old Crown a natural gathering point.',
  },
];

const EVENT_STRENGTHS = [
  'Historic thatched pub setting near Cambridge',
  'Authentic Nepalese food plus pub classics',
  'Free parking and straightforward access',
  'Garden and flexible spaces for different group sizes',
];

export const metadata = buildPageMetadata({
  title: EVENTS_PAGE_TITLE,
  description: EVENTS_PAGE_DESCRIPTION,
  keywords: [
    'events Cambridge pub',
    'private hire Girton',
    'sports pub Cambridge',
    'celebrations at Old Crown Girton',
    'community events Girton',
  ],
  path: '/events',
  socialTitle: 'Events & Private Hire | Old Crown Girton',
  socialDescription:
    'Plan private hire, wakes, birthdays, and group gatherings at Old Crown Girton near Cambridge.',
});

export default function EventsPage() {
  return (
    <RestaurantLayout>
      {renderSchemaTags([
        buildWebPageSchema({
          path: '/events',
          title: EVENTS_PAGE_TITLE,
          description: EVENTS_PAGE_DESCRIPTION,
        }),
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
        ]),
        buildFaqSchema(EVENTS_FAQ_ITEMS),
      ])}

      <div className="min-h-screen bg-white">
        <section className="relative bg-gradient-to-br from-brand-600 to-brand-800 py-14 text-white md:py-20">
          <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
          <FadeIn>
            <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-100">Events & private hire</p>
              <h1 className="mt-4 text-3xl font-display font-bold leading-tight md:text-5xl">
                Group bookings that feel easier to plan
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-brand-100 md:text-lg">
                Old Crown is built for gatherings that need both atmosphere and practicality: birthdays, wakes,
                business lunches, sports groups, and community events near Cambridge.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="rounded-full bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50">
                  Enquire Now
                </Link>
                <Link href="/menu" className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                  View Menus
                </Link>
              </div>
            </div>
          </FadeIn>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <section aria-labelledby="event-use-cases-heading">
              <div className="max-w-3xl">
                <h2 id="event-use-cases-heading" className="text-3xl font-display font-bold text-brand-700">
                  The main reasons people book this page
                </h2>
                <p className="mt-4 leading-8 text-brand-600">
                  The goal here is to help planners recognise their use case quickly, then feel confident that the
                  venue can handle it.
                </p>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {EVENT_USE_CASES.map((item) => (
                  <article key={item.title} className="rounded-3xl border border-brand-100 bg-brand-50 p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-brand-700">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-brand-600">{item.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </FadeIn>

          <FadeIn>
            <section className="mt-16 grid gap-8 lg:grid-cols-[1.05fr,0.95fr]" aria-labelledby="event-strengths-heading">
              <div className="rounded-[32px] bg-neutral-50 p-8 shadow-sm">
                <h2 id="event-strengths-heading" className="text-3xl font-display font-bold text-brand-700">
                  Why Old Crown converts well for events
                </h2>
                <ul className="mt-6 space-y-3 text-brand-700">
                  {EVENT_STRENGTHS.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-1 text-brand-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[32px] bg-brand-700 p-8 text-white shadow-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-100">Good fit for</p>
                <h3 className="mt-3 text-2xl font-display font-bold">Private hire without unnecessary complexity</h3>
                <p className="mt-4 leading-8 text-brand-100">
                  Guests need clear next steps, not a wall of information. If you already know the occasion, the best
                  move is simply to contact the team and get availability confirmed.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/contact" className="rounded-full bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50">
                    Contact the Team
                  </Link>
                  <Link href="/wakes-menu" className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                    Wakes Menu
                  </Link>
                </div>
              </div>
            </section>
          </FadeIn>
        </div>
      </div>
    </RestaurantLayout>
  );
}
